/* ===== Admin Natujaga =====
   - Simpan kegiatan & artikel ke localStorage
   - Render daftar di halaman admin
   - Export isi data.js (copy-paste ke file data.js asli)
*/

const STORAGE_KEY_KEGIATAN = 'natujaga_kegiatan';
const STORAGE_KEY_ARTIKEL = 'natujaga_artikel';

// Ambil data awal dari data.js (fallback) atau localStorage
function ambilDataAwal() {
    const kegiatanAwal = typeof kegiatan !== 'undefined' ? kegiatan : [];
    const articlesAwal = typeof articles !== 'undefined' ? articles : {};

    const kegiatanSimpan = localStorage.getItem(STORAGE_KEY_KEGIATAN);
    const artikelSimpan = localStorage.getItem(STORAGE_KEY_ARTIKEL);

    return {
        kegiatan: kegiatanSimpan ? JSON.parse(kegiatanSimpan) : kegiatanAwal,
        articles: artikelSimpan ? JSON.parse(artikelSimpan) : articlesAwal
    };
}

// Simpan ke localStorage
function simpanKeStorage(kegiatan, articles) {
    localStorage.setItem(STORAGE_KEY_KEGIATAN, JSON.stringify(kegiatan));
    localStorage.setItem(STORAGE_KEY_ARTIKEL, JSON.stringify(articles));
}

// Generate ID unik dari judul
function generateId(judul) {
    return judul.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Format array gambar dalam bentuk JS array string.
// Menerima array (dari data.js / localStorage) ATAU string
// (dari input form: dipisah koma dan/atau baris baru).
function formatGambar(input) {
    if (!input) return '[]';
    let daftar;
    if (Array.isArray(input)) {
        daftar = input.map(s => String(s).trim()).filter(s => s !== '');
    } else if (typeof input === 'string') {
        if (input.trim() === '') return '[]';
        daftar = input.split(/[\n,]/).map(s => s.trim()).filter(s => s !== '');
    } else {
        return '[]';
    }
    return JSON.stringify(daftar);
}

// Ambil nilai views sebuah entri (default 0 bila tidak ada / tidak valid)
function formatViews(entri) {
    const v = parseInt(entri && entri.views, 10);
    return Number.isNaN(v) ? 0 : v;
}

// Format isi artikel agar aman untuk diletakkan di template literal
function escapeTemplate(str) {
    return str.replace(/`/g, '\\`').replace(/\$\{/g, '\\${}');
}

// Render daftar kegiatan
function renderListKegiatan() {
    const { kegiatan } = ambilDataAwal();
    const container = document.getElementById('list-kegiatan');
    if (!container) return;

    container.innerHTML = '';

    if (kegiatan.length === 0) {
        container.innerHTML = '<div class="empty-state">Belum ada kegiatan tersimpan.</div>';
        return;
    }

    kegiatan.forEach((k, i) => {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="data-item-info">
                <h4>${escapeHtml(k.judul)}</h4>
                <p>${k.tanggal} · ${k.kategori} · ${k.id}</p>
            </div>
            <div class="data-item-actions">
                <button onclick="hapusKegiatan(${i})">Hapus</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Render daftar artikel
function renderListArtikel() {
    const { articles } = ambilDataAwal();
    const container = document.getElementById('list-artikel');
    if (!container) return;

    container.innerHTML = '';

    const entries = Object.entries(articles);
    if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state">Belum ada artikel tersimpan.</div>';
        return;
    }

    entries.forEach(([id, a], i) => {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="data-item-info">
                <h4>${escapeHtml(a.judul)}</h4>
                <p>${a.tanggal} · ${a.kategori} · ${id}</p>
            </div>
            <div class="data-item-actions">
                <button onclick="hapusArtikel('${escapeHtml(id)}')">Hapus</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Hapus kegiatan
window.hapusKegiatan = function(index) {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return;
    const { kegiatan, articles } = ambilDataAwal();
    kegiatan.splice(index, 1);
    simpanKeStorage(kegiatan, articles);
    renderListKegiatan();
    generateExport();
    tampilkanPesan('msg-kegiatan', 'Kegiatan berhasil dihapus.', 'success');
};

// Hapus artikel
window.hapusArtikel = function(id) {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;
    const { kegiatan, articles } = ambilDataAwal();
    delete articles[id];
    simpanKeStorage(kegiatan, articles);
    renderListArtikel();
    generateExport();
    tampilkanPesan('msg-artikel', 'Artikel berhasil dihapus.', 'success');
};

// Reset form
window.resetForm = function(type) {
    if (type === 'kegiatan') {
        document.getElementById('form-kegiatan').reset();
        document.getElementById('k-icon').value = '🌿';
        document.getElementById('msg-kegiatan').style.display = 'none';
        document.getElementById('err-kegiatan').style.display = 'none';
    } else {
        document.getElementById('form-artikel').reset();
        document.getElementById('msg-artikel').style.display = 'none';
        document.getElementById('err-artikel').style.display = 'none';
    }
};

// Tampilkan pesan sukses/error
function tampilkanPesan(id, teks, jenis) {
    const el = document.getElementById(id);
    el.textContent = teks;
    el.className = jenis === 'success' ? 'success-msg' : 'error-msg';
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// Escape HTML untuk ditampilkan aman
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate kode data.js untuk di-copy
function generateExport() {
    const { kegiatan, articles } = ambilDataAwal();

    // Format array kegiatan
    let kegiatanJS = 'const kegiatan = [\n';
    kegiatan.forEach((k, i) => {
        kegiatanJS += `    {
        id: '${escapeHtml(k.id)}',
        judul: '${escapeHtml(k.judul)}',
        tanggal: '${escapeHtml(k.tanggal)}',
        kategori: '${escapeHtml(k.kategori)}',
        icon: '${escapeHtml(k.icon || '🌿')}',
        deskripsi: '${escapeHtml(k.deskripsi)}',
        views: ${formatViews(k)},
        gambar: ${formatGambar(k.gambar)}
    }${i < kegiatan.length - 1 ? ',' : ''}\n`;
    });
    kegiatanJS += '];\n\n';

    // Format objek articles
    let articlesJS = 'const articles = {\n';
    const entries = Object.entries(articles);
    entries.forEach(([id, a], i) => {
        articlesJS += `    ${escapeHtml(id)}: {
        judul: '${escapeHtml(a.judul)}',
        tanggal: '${escapeHtml(a.tanggal)}',
        kategori: '${escapeHtml(a.kategori)}',
        isi: \`${escapeTemplate(a.isi)}\`,
        views: ${formatViews(a)},
        gambar: ${formatGambar(a.gambar)}
    }${i < entries.length - 1 ? ',' : ''}\n`;
    });
    articlesJS += '};';

    const hasil = kegiatanJS + articlesJS;
    document.getElementById('export-data').textContent = hasil;
    return hasil;
}

// Copy ke clipboard
document.getElementById('btn-copy-data').addEventListener('click', () => {
    const kode = generateExport();
    navigator.clipboard.writeText(kode).then(() => {
        const btn = document.getElementById('btn-copy-data');
        const teksLama = btn.textContent;
        btn.textContent = 'Disalin!';
        setTimeout(() => { btn.textContent = teksLama; }, 1500);
    });
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        const tabId = 'tab-' + btn.dataset.tab;
        document.getElementById(tabId).style.display = 'block';

        if (btn.dataset.tab === 'kegiatan') renderListKegiatan();
        if (btn.dataset.tab === 'artikel') renderListArtikel();
        generateExport();
    });
});

// Form submit: kegiatan
document.getElementById('form-kegiatan').addEventListener('submit', (e) => {
    e.preventDefault();
    const { kegiatan, articles } = ambilDataAwal();

    const judul = document.getElementById('k-judul').value.trim();
    const tanggal = document.getElementById('k-tanggal').value.trim();
    const kategori = document.getElementById('k-kategori').value;
    const icon = document.getElementById('k-icon').value.trim() || '🌿';
    const deskripsi = document.getElementById('k-deskripsi').value.trim();
    const gambarInput = document.getElementById('k-gambar').value.trim();

    if (!judul || !tanggal || !kategori || !deskripsi) {
        tampilkanPesan('err-kegiatan', 'Harap isi semua field yang wajib diisi.', 'error');
        return;
    }

    const id = generateId(judul);
    // Cek duplikat id
    if (kegiatan.some(k => k.id === id)) {
        tampilkanPesan('err-kegiatan', 'Judul sudah ada, gunakan judul lain.', 'error');
        return;
    }

    const baru = {
        id,
        judul,
        tanggal,
        kategori,
        icon,
        deskripsi,
        views: 0,
        gambar: gambarInput ? gambarInput.split(',').map(s => s.trim()).filter(s => s !== '') : []
    };

    kegiatan.push(baru);
    simpanKeStorage(kegiatan, articles);
    renderListKegiatan();
    generateExport();
    document.getElementById('form-kegiatan').reset();
    document.getElementById('k-icon').value = '🌿';
    tampilkanPesan('msg-kegiatan', 'Kegiatan berhasil disimpan di browser.', 'success');
});

// Form submit: artikel
document.getElementById('form-artikel').addEventListener('submit', (e) => {
    e.preventDefault();
    const { kegiatan, articles } = ambilDataAwal();

    const judul = document.getElementById('a-judul').value.trim();
    const tanggal = document.getElementById('a-tanggal').value.trim();
    const kategori = document.getElementById('a-kategori').value.trim();
    const isi = document.getElementById('a-isi').value.trim();
    const gambarInput = document.getElementById('a-gambar').value.trim();

    if (!judul || !tanggal || !kategori || !isi) {
        tampilkanPesan('err-artikel', 'Harap isi semua field yang wajib diisi.', 'error');
        return;
    }

    const id = generateId(judul);
    if (articles[id]) {
        tampilkanPesan('err-artikel', 'Judul sudah ada, gunakan judul lain.', 'error');
        return;
    }

    const baru = {
        judul,
        tanggal,
        kategori,
        isi,
        views: 0,
        gambar: gambarInput ? gambarInput.split(',').map(s => s.trim()).filter(s => s !== '') : []
    };

    articles[id] = baru;
    simpanKeStorage(kegiatan, articles);
    renderListArtikel();
    generateExport();
    document.getElementById('form-artikel').reset();
    tampilkanPesan('msg-artikel', 'Artikel berhasil disimpan di browser.', 'success');
});

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    renderListKegiatan();
    renderListArtikel();
    generateExport();
});