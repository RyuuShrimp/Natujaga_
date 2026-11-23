/* ===== generate-data.js =====
   Skrip untuk mengubah file Markdown dari content/ menjadi data.js

   Cara pakai:
   node scripts/generate-data.js

   Hasilnya akan menimpa file js/data.js dengan data terbaru dari CMS.
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUTPUT_FILE = path.join(ROOT, 'js', 'data.js');

// --- Helper: parsing tanggal teks Indonesia ---
// Tanggal di frontmatter ditulis seperti '28 Agu 2025' / '12 Desember 2026'
// yang tidak bisa dibaca new Date(). Peta ini sama dengan js/tanggal.js
// (dipakai halaman web) supaya urutan di semua tempat konsisten.
const BULAN_ID = {
    jan: 0, januari: 0,
    feb: 1, februari: 1,
    mar: 2, maret: 2,
    apr: 3, april: 3,
    mei: 4,
    jun: 5, juni: 5,
    jul: 6, juli: 6,
    agu: 7, agst: 7, agustus: 7,
    sep: 8, sept: 8, september: 8,
    okt: 9, oktober: 9,
    nov: 10, november: 10,
    des: 11, desember: 11
};

function parseTanggalID(teks) {
    if (!teks) return null;
    const cocok = String(teks).trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!cocok) {
        const d = new Date(teks);
        return isNaN(d) ? null : d;
    }
    const bulan = BULAN_ID[cocok[2].toLowerCase()];
    if (bulan === undefined) return null;
    const hasil = new Date(parseInt(cocok[3], 10), bulan, parseInt(cocok[1], 10));
    return isNaN(hasil) ? null : hasil;
}

// Comparator: tanggal terbaru dulu; tanggal tak dikenal paling akhir.
function bandingTanggalDesc(a, b) {
    const da = parseTanggalID(a);
    const db = parseTanggalID(b);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
}

// --- Helper: parsing frontmatter ---
function parseFrontmatter(fileContent) {
    const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { frontmatter: {}, body: fileContent.trim() };

    const fmRaw = match[1];
    const body = (match[2] || '').trim();

    const fm = {};
    fmRaw.split('\n').forEach((line) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        const key = line.slice(0, colonIndex).trim();
        const rawVal = line.slice(colonIndex + 1).trim();

        // Parsing array YAML sederhana: - item1
        if (rawVal.startsWith('- ')) {
            // Handle sebagai array (akan ditangani di pemanggil)
            return;
        }

        fm[key] = rawVal;
    });

    return { frontmatter: fm, body };
}

// --- Helper: parsing daftar gambar dari frontmatter (YAML list) ---
function parseImageList(fmRawLines, startIndex) {
    const images = [];
    for (let i = startIndex; i < fmRawLines.length; i++) {
        const line = fmRawLines[i];
        const trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
            images.push(trimmed.slice(2).trim());
        } else if (trimmed === '' || trimmed.startsWith('#')) {
            continue;
        } else {
            break;
        }
    }
    return images;
}

function parseFullFrontmatter(fileContent) {
    const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { frontmatter: {}, body: fileContent.trim() };

    const fmRaw = match[1];
    const body = (match[2] || '').trim();
    const lines = fmRaw.split('\n');

    const fm = {};
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) { i++; continue; }

        const key = line.slice(0, colonIndex).trim();
        const rawVal = line.slice(colonIndex + 1).trim();

        if (rawVal === '') {
            // Mungkin array multi-baris (gambar)
            const images = parseImageList(lines, i + 1);
            if (images.length > 0) {
                fm[key] = images;
                i += images.length;
            } else {
                fm[key] = [];
            }
        } else {
            fm[key] = rawVal;
        }
        i++;
    }

    return { frontmatter: fm, body };
}

// --- Fungsi escape untuk string JS ---
function escapeJS(str) {
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
}

// --- Baca semua file .md dari folder ---
function readMarkdownFiles(folderPath) {
    const entries = [];
    if (!fs.existsSync(folderPath)) return entries;

    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.md'));
    files.forEach((file) => {
        const fullPath = path.join(folderPath, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { frontmatter, body } = parseFullFrontmatter(content);
        entries.push({ file, frontmatter, body, fullPath });
    });
    return entries;
}

// --- Format array gambar dalam bentuk JS ---
function formatImageArray(images) {
    if (!images || images.length === 0) return '[]';
    return '[\n' + images.map((img) => `            '${escapeJS(img)}'`).join(',\n') + '\n        ]';
}

// --- Build data.js ---
function build() {
    const kegiatanEntries = readMarkdownFiles(path.join(CONTENT_DIR, 'kegiatan'));
    const artikelEntries = readMarkdownFiles(path.join(CONTENT_DIR, 'artikel'));

    // Urutkan kegiatan berdasarkan tanggal (terbaru dulu).
    // Tanggal frontmatter adalah teks Indonesia — wajib pakai parseTanggalID,
    // new Date() tidak bisa membacanya.
    kegiatanEntries.sort((a, b) =>
        bandingTanggalDesc(a.frontmatter.tanggal, b.frontmatter.tanggal)
    );

    let output = `/* ===== Data Kegiatan Natujaga =====
Dihasilkan otomatis dari content/kegiatan/ oleh Decap CMS.
Jangan edit secara manual — edit melalui halaman admin (/admin) atau file Markdown.
Catatan: field 'views' disiapkan untuk statistik jumlah pembaca;
increment-nya baru aktif setelah Supabase tersambung (belum dihitung sekarang).
*/

const kegiatan = [
`;

    kegiatanEntries.forEach((entry, idx) => {
        const f = entry.frontmatter;
        const gambarJs = formatImageArray(f.gambar || []);
        output += `    {
        id: '${escapeJS(f.id || entry.file.replace('.md', ''))}',
        judul: '${escapeJS(f.judul || '')}',
        tanggal: '${escapeJS(f.tanggal || '')}',
        kategori: '${escapeJS(f.kategori || '')}',
        icon: '${escapeJS(f.icon || '🌿')}',
        deskripsi: '${escapeJS(f.deskripsi || '')}',
        views: ${parseInt(f.views, 10) || 0},
        gambar: ${gambarJs}
    }${idx < kegiatanEntries.length - 1 ? ',' : ''}\n`;
    });

    output += `];\n\n`;

    output += `/* ===== Data Artikel Natujaga =====
Dihasilkan otomatis dari content/artikel/ oleh Decap CMS.
Jangan edit secara manual — edit melalui halaman admin (/admin) atau file Markdown.
Catatan: field 'views' disiapkan untuk statistik jumlah pembaca;
increment-nya baru aktif setelah Supabase tersambung (belum dihitung sekarang).
*/

const articles = {
`;

    const artikelKeys = artikelEntries.map((e) => e.frontmatter.id || e.file.replace('.md', ''));
    artikelEntries.forEach((entry, idx) => {
        const f = entry.frontmatter;
        const key = f.id || entry.file.replace('.md', '');
        const gambarJs = formatImageArray(f.gambar || []);
        const bodyEscaped = escapeJS(entry.body || '');
        output += `    ${key}: {
        judul: '${escapeJS(f.judul || '')}',
        tanggal: '${escapeJS(f.tanggal || '')}',
        kategori: '${escapeJS(f.kategori || '')}',
        views: ${parseInt(f.views, 10) || 0},
        isi: \`${bodyEscaped}\`,
        gambar: ${gambarJs}
    }${idx < artikelEntries.length - 1 ? ',' : ''}\n`;
    });

    output += `};\n`;

    fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
    console.log(`✅ Berhasil generate ${OUTPUT_FILE}`);
    console.log(`   - ${kegiatanEntries.length} kegiatan`);
    console.log(`   - ${artikelEntries.length} artikel`);
}

build();
