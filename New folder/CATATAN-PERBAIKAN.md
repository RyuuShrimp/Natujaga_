# Catatan Perbaikan Natujaga — 23 November 2026

Zip ini berisi project Natujaga dari laptop kamu yang sudah dicek dan diperbaiki.
Tidak ada teks artikel/kegiatan yang diubah isinya, dan hasil ini BELUM
di-push ke GitHub / belum di-deploy ke Netlify.
UPDATE terakhir: pembersihan yang tadinya hanya usulan SUDAH dikerjakan atas
persetujuan kamu — lihat bagian "Pembersihan & perbaikan lanjutan" di bawah.
Semua file yang dihapus masih bisa dikembalikan dari file RAR asli yang
kamu kirim (file itu tidak diubah sama sekali, disimpan sebagai cadangan).

## Cara pakai

1. Extract zip ini, lalu timpa folder project Natujaga di laptop kamu dengan
   isinya (atau jadikan folder ini sebagai folder project barumu).
2. Kalau mau online-kan: commit + push folder ini ke repo GitHub
   `RyuuShrimp/natujaga` (branch `main`). Netlify akan deploy otomatis.
   PENTING: folder `admin/`, `content/`, `admin.html`, `js/admin.js`, dan
   `scripts/` selama ini HANYA ada di laptopmu, belum pernah masuk GitHub —
   push kali ini yang pertama akan membawa mereka online.
3. `node_modules` TIDAK disertakan (tidak dipakai apa pun di project ini —
   `scripts/generate-data.js` hanya memakai modul bawaan Node, jadi tidak
   perlu `npm install` untuk menjalankannya).

## Alur data project ini (hasil audit)

Ada DUA jalur admin yang berjalan bersamaan — ini penting dipahami:

1. **Decap CMS** (`/admin` → `admin/index.html` + `admin/config.yml`)
   → menulis file Markdown di `content/kegiatan/` & `content/artikel/`
   langsung ke repo GitHub (backend git-gateway, branch `main`)
   → lalu `js/data.js` harus di-generate ulang secara manual dengan
   `node scripts/generate-data.js`
   → halaman publik (`index`, `kegiatan`, `artikel`, `artikel-detail`)
   membaca `js/data.js`.
   ⚠️ Belum ada build otomatis di Netlify (tidak ada `netlify.toml`), jadi
   kalau CMS mengubah file .md, `data.js` TIDAK ikut berubah sampai
   generator dijalankan dan hasilnya di-push.
2. **Admin lokal** (`admin.html` + `js/admin.js`)
   → menyimpan ke localStorage browser (`natujaga_kegiatan` /
   `natujaga_artikel`) → ada tombol Export untuk copy-paste hasil ke
   `data.js` secara manual.
   ⚠️ `artikel.html` dan `kegiatan.html` membaca localStorage lebih dulu
   daripada `data.js`, jadi hasil admin lokal HANYA terlihat di browser
   yang sama — pengunjung lain tetap melihat isi `data.js`.

## Perubahan yang sudah dilakukan (per file)

- **`js/tanggal.js` (BARU)** — Parser tanggal teks Indonesia
  (`28 Agu 2025`, `12 Desember 2026`, `5 Okt 2025`, termasuk singkatan
  Agu/Agst, Okt, Des). Mengembalikan `null` untuk tanggal yang tidak
  dikenal, dan menyediakan `bandingTanggalDesc()` (terbaru dulu, tanggal
  tak dikenal ditaruh paling akhir, tidak crash).
- **`artikel.html`** — Memuat `js/tanggal.js`; pengurutan artikel tidak
  lagi memakai `new Date(teks Indonesia)` (hasilnya selalu Invalid Date,
  jadi urutan artikel selama ini tidak bisa diandalkan), diganti
  `bandingTanggalDesc()`.
- **`js/script.js`** — Daftar kegiatan (`renderKegiatan`) dan preview
  4 kegiatan di beranda (`renderActivityPreview`) sekarang diurutkan
  tanggal terbaru dulu memakai parser yang sama. Sebelumnya urutannya
  mengikuti urutan file di `data.js` (alfabetis nama file).
- **`index.html` & `kegiatan.html`** — Memuat `js/tanggal.js` sebelum
  `js/script.js`.
- **`scripts/generate-data.js`** — (1) Parser tanggal yang sama ditanam
  di generator; pengurutan kegiatan yang tadinya tidak melakukan apa-apa
  (`return 0`) sekarang benar-benar mengurutkan terbaru dulu.
  (2) Generator sekarang mengeluarkan field `views` (lihat di bawah).
- **`content/kegiatan/*.md` (5 file) & `content/artikel/*.md` (8 file)** —
  Ditambah satu baris `views: 0` di frontmatter masing-masing.
  (4 dari 8 file artikel itu kemudian dihapus pada tahap pembersihan —
  lihat bagian lanjutan di bawah — jadi sekarang tersisa 4 file artikel.)
- **`js/data.js`** — Hasil generate ulang dengan generator baru:
  semua kegiatan + artikel punya `views: 0`, dan urutan kegiatan
  sekarang terbaru dulu (12 Des 2026 → 10 Nov 2025 → 28 Okt 2025 →
  15 Okt 2025 → 5 Okt 2025). Isi konten tidak berubah sama sekali.
  Setelah pembersihan, isi `data.js` sekarang: 5 kegiatan + 4 artikel.
  Tentang `views`: field ini BARU disiapkan untuk statistik jumlah
  pembaca. Angkanya belum bertambah sendiri — increment per pengunjung
  baru aktif setelah Supabase tersambung. Tidak ada penghitung palsu
  yang ditanam.
- **`.gitignore` (BARU)** — `node_modules/`, `.env`, `*.bak`, file OS
  (`.DS_Store`, `Thumbs.db`), folder editor (`.vscode/`, `.idea/`).
- **`css/style.css`** — Dihapus referensi gambar latar `hero-bg.jpg`
  yang file-nya tidak ada di project (path-nya selalu 404; dari folder
  `css/` path itu menunjuk ke folder `images/` yang tidak ada).
  Tampilan tidak berubah — selama ini gambarnya memang tidak pernah
  tampil, yang tampil hanya gradiennya, dan gradien itu dipertahankan.

## Hasil pengujian

- `node --check` lolos untuk semua file JS: `js/data.js`,
  `js/tanggal.js`, `js/script.js`, `js/admin.js`,
  `scripts/generate-data.js`.
- Parser diuji: `28 Agu 2025` → 2025-08-28 ✓, `1 Jan 2026` → 2026-01-01 ✓,
  `12 Desember 2026` ✓, `5 Okt 2025` ✓, `15 Agst 2025` ✓, tanggal tidak
  valid / kosong → `null` (ditaruh paling akhir saat sorting) ✓.
  Sebagai perbandingan, `new Date('28 Agu 2025')` = Invalid Date.
- Generator dijalankan ulang: `data.js` hasil generate tetap memuat
  `views` di semua 13 entri, dan `data.js` ter-parse valid sebagai JS.
- Server statis lokal: semua halaman (index, artikel, kegiatan,
  artikel-detail, admin, tentang-kami, program, kontak, /admin/) dan
  aset yang dirujuk membalas HTTP 200.
- Cek referensi: dari 98 referensi file di HTML + `data.js` + CSS,
  sekarang 0 yang rusak (sebelumnya 1: `hero-bg.jpg`).

## Status CMS (admin/config.yml)

- Backend `git-gateway`, branch `main` — SUDAH BENAR: branch default repo
  GitHub `RyuuShrimp/natujaga` memang `main`. Config git-gateway memang
  tidak menulis nama repo (otomatis mengikuti repo yang terhubung ke
  situs Netlify-nya).
- `media_folder: assets/images/uploads` — folder ini belum ada di
  project; Decap akan membuatnya otomatis saat upload foto pertama.
- TAPI CMS-nya BELUM bisa dipakai di situs live, karena:
  1. Folder `admin/` + `content/` belum ada di GitHub (baru ada di
     laptop) — halaman /admin di situs live belum ada.
  2. Netlify Identity + Git Gateway harus diaktifkan dari dashboard
     Netlify (tidak bisa dicek dari file).
  3. Perubahan dari CMS hanya mengubah file .md; `data.js` tidak
     ter-generate otomatis (lihat alur data di atas).

## Pembersihan & perbaikan lanjutan — SUDAH dikerjakan (atas persetujuan kamu)

Sebelum menghapus, setiap file dicek dulu dengan pencarian di seluruh
project untuk memastikan tidak ada halaman/kode yang masih menunjuknya.
Semua yang dihapus di bawah ini masih bisa dikembalikan dari file RAR
asli yang kamu kirim (disimpan utuh sebagai cadangan).

1. ✅ **4 artikel tes dihapus** — `content/artikel/amri.md` (574 B),
   `saidul.md` (576 B), `boy.md` (572 B), `lol.md` (572 B); judulnya
   "test 1", "test 2", "test3", "test4" dengan isi copy-paste yang sama.
   Setelah dihapus, `data.js` di-generate ulang: artikel sekarang
   tinggal 4 — `sampah`, `hutan`, `bersama`, `edukasi`.
   (Foto `assets/images/kegiatan/amri.jpeg` TIDAK ikut dihapus — itu
   foto beneran yang dipakai artikel `bersama` dan `edukasi`.)
2. ✅ **4 wallpaper tidak terpakai dihapus** dari
   `assets/images/kegiatan/aksibersih/pantaimaluk121226/` —
   `346547-blackangel.jpg` (1.392.293 B), `4602768-deathstroke-wallpaper.jpg`
   (1.443.776 B), `50-awesome-grunge-style-desktop-wallpapers-psdreview.jpg`
   (556.125 B), `ac_syndicate-wallpaper-1366x768.jpg` (352.558 B).
   Total hemat 3.744.752 B (±3,57 MB). Pencarian di semua file
   .html/.js/.md/.css/.yml menunjukkan 0 referensi ke keempatnya.
   Yang terpakai dan TETAP disimpan: `542742.jpg` dan `2880x1800.jpg`
   (foto Beach Clean Up Pantai Maluk).
3. ✅ **`js/data.js.bak` dihapus** (8.248 B) — versi lama `data.js`
   sebelum era CMS. Sudah ditutupi `.gitignore` (`*.bak`) juga.
4. ✅ **`artikel-script.txt` dihapus** (2.933 B) — potongan skrip lama
   di root, tidak dirujuk halaman mana pun.
   Total semua file yang dihapus: 10 file, 3.758.225 B (±3,58 MB).
5. ✅ **Bug Export di `js/admin.js` DIPERBAIKI** — `formatGambar()`
   sekarang menerima `gambar` berbentuk array (dari `data.js`/
   localStorage) maupun string (dari form, dipisah koma/baris baru);
   sebelumnya memanggil `.trim()` pada array sehingga kotak
   "Export ke data.js" error (`TypeError: input.trim is not a function`).
   Hasil export sekarang juga menyertakan field `views` di setiap
   kegiatan dan artikel (diambil dari entri yang ada, default 0), jadi
   copy-paste hasil export tidak lagi menghapus `views` dari `data.js`.
   Entri baru yang dibuat lewat form admin juga langsung diberi
   `views: 0`. Format output export tidak diubah selain itu.
   Sudah diuji dengan harness Node: `generateExport()` memakai data
   asli project (gambar berbentuk array) berjalan TANPA error, output
   memuat 9 baris `views:` (5 kegiatan + 4 artikel), dan outputnya
   valid sebagai JavaScript.

Pengujian ulang setelah pembersihan: `node --check` lolos untuk semua
file JS; `data.js` ter-parse valid (5 kegiatan, 4 artikel, semua
`views === 0`, urutan kegiatan tetap tanggal terbaru dulu, 0 gambar
hilang); cek referensi seluruh project: 125 referensi lokal, 0 rusak;
server statis lokal: halaman utama, artikel, kegiatan, artikel-detail,
admin.html, dan /admin/ semua HTTP 200.

## Usulan — masih menunggu (BELUM dilakukan)

1. **Tulis ulang isi artikel `bersama` dan `edukasi`** — judulnya
   serius, tapi isinya masih teks copy-paste yang sama dengan artikel
   tes yang sudah dihapus. Ini penulisan konten, bukan penghapusan.
2. **Push ke GitHub** folder hasil perbaikan ini supaya situs live ikut
   ter-update (termasuk /admin + content/ untuk pertama kalinya), lalu
   aktifkan Netlify Identity + Git Gateway bila mau memakai Decap CMS.
