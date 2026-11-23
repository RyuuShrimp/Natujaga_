/* ===== Data Kegiatan Natujaga =====
Dihasilkan otomatis dari content/kegiatan/ oleh Decap CMS.
Jangan edit secara manual — edit melalui halaman admin (/admin) atau file Markdown.
Catatan: field 'views' disiapkan untuk statistik jumlah pembaca;
increment-nya baru aktif setelah Supabase tersambung (belum dihitung sekarang).
*/

const kegiatan = [
    {
        id: 'beach-clean-up-pantai-maluk',
        judul: 'Beach Clean Up Pantai Maluk',
        tanggal: '12 Desember 2026',
        kategori: 'Aksi Bersih',
        icon: '🏖️',
        deskripsi: 'Menjaga kebersihan pantai bersama masyarakat.',
        views: 0,
        gambar: [
            'assets/images/kegiatan/aksibersih/pantaimaluk121226/542742.jpg',
            'assets/images/kegiatan/aksibersih/pantaimaluk121226/2880x1800.jpg'
        ]
    },
    {
        id: 'aksi-bersih-lingkungan',
        judul: 'Aksi Bersih Lingkungan',
        tanggal: '10 Nov 2025',
        kategori: 'Aksi Bersih',
        icon: '🌱',
        deskripsi: 'Menjaga kebersihan lingkungan bersama masyarakat.',
        views: 0,
        gambar: [
            'assets/images/kegiatan/aksibersih/gerakanpedulilingkungan.jpg'
        ]
    },
    {
        id: 'penanaman-pohon',
        judul: 'Penanaman Pohon',
        tanggal: '28 Okt 2025',
        kategori: 'Penanaman',
        icon: '🌳',
        deskripsi: 'Menanam pohon untuk masa depan yang lebih hijau.',
        views: 0,
        gambar: [
            'assets/images/kegiatan/penanaman/penghijauan.jpg'
        ]
    },
    {
        id: 'edukasi-lingkungan',
        judul: 'Edukasi Lingkungan',
        tanggal: '15 Okt 2025',
        kategori: 'Edukasi',
        icon: '📚',
        deskripsi: 'Meningkatkan kesadaran lingkungan sejak dini.',
        views: 0,
        gambar: [
            'assets/images/kegiatan/edukasi/baca.png'
        ]
    },
    {
        id: 'kegiatan-sosial',
        judul: 'Kegiatan Sosial',
        tanggal: '5 Okt 2025',
        kategori: 'Sosial',
        icon: '🤝',
        deskripsi: 'Berbagi dan peduli bersama.',
        views: 0,
        gambar: [
            'assets/images/kegiatan/sosial/kolaborasisosial.jpg'
        ]
    }
];

/* ===== Data Artikel Natujaga =====
Dihasilkan otomatis dari content/artikel/ oleh Decap CMS.
Jangan edit secara manual — edit melalui halaman admin (/admin) atau file Markdown.
Catatan: field 'views' disiapkan untuk statistik jumlah pembaca;
increment-nya baru aktif setelah Supabase tersambung (belum dihitung sekarang).
*/

const articles = {
    bersama: {
        judul: 'Bersama untuk Lingkungan',
        tanggal: '28 Agu 2025',
        kategori: 'Sosial',
        views: 0,
        isi: `<p>Perubahan besar selalu dimulai dari langkah kecil yang dilakukan bersama-sama. Ketika individu, komunitas, dan organisasi bersatu, dampak yang tercipta jauh lebih besar.</p>\n<h3>Cara Memulai:</h3>\n<ul>\n    <li>Ajak tetangga dan teman bergabung program komunitas.</li>\n    <li>Mulai dari kegiatan kecil di lingkungan sekitar.</li>\n    <li>Bagikan hasil dokumentasi agar makin banyak yang terinspirasi.</li>\n</ul>`,
        gambar: [
            'assets/images/kegiatan/amri.jpeg',
            'assets/images/kegiatan/Life.jpg'
        ]
    },
    edukasi: {
        judul: 'Pemuda Benete Berhasil Juara Tingkat Kabupaten',
        tanggal: '15 Jan 2026',
        kategori: 'Edukasi',
        views: 0,
        isi: `<p>Perubahan besar selalu dimulai dari langkah kecil yang dilakukan bersama-sama. Ketika individu, komunitas, dan organisasi bersatu, dampak yang tercipta jauh lebih besar.</p>\n<h3>Cara Memulai:</h3>\n<ul>\n    <li>Ajak tetangga dan teman bergabung program komunitas.</li>\n    <li>Mulai dari kegiatan kecil di lingkungan sekitar.</li>\n    <li>Bagikan hasil dokumentasi agar makin banyak yang terinspirasi.</li>\n</ul>`,
        gambar: [
            'assets/images/kegiatan/amri.jpeg',
            'assets/images/kegiatan/Life.jpg'
        ]
    },
    hutan: {
        judul: 'Manfaat Hutan Kota',
        tanggal: '5 Sep 2025',
        kategori: 'Lingkungan',
        views: 0,
        isi: `<p>Hutan kota tidak hanya indah dipandang, tetapi juga memiliki peran penting dalam membersihkan udara dan menyerap emisi karbon.</p>\n<h3>Manfaat Utama:</h3>\n<ul>\n    <li>Menyerap polusi udara dari kendaraan bermotor.</li>\n    <li>Menurunkan suhu di area perkotaan.</li>\n    <li>Menjadi tempat bermain dan edukasi untuk anak-anak.</li>\n</ul>`,
        gambar: [
            'assets/images/artikel/1.jpg'
        ]
    },
    sampah: {
        judul: 'Pentingnya Pengelolaan Sampah',
        tanggal: '12 Sep 2025',
        kategori: 'Berita',
        views: 0,
        isi: `<p>Sampah adalah salah satu masalah terbesar yang dihadapi masyarakat modern. Tanpa pengelolaan yang baik, sampah dapat mencemari tanah, air, dan udara.</p>\n<h3>Langkah Sederhana:</h3>\n<ul>\n    <li>Kurangi penggunaan plastik sekali pakai.</li>\n    <li>Pilah sampah organik dan anorganik.</li>\n    <li>Buat kompos dari sampah organik rumahan.</li>\n</ul>\n<p>Dengan sedikit perhatian, kita dapat menciptakan lingkungan yang lebih bersih dan sehat.</p>`,
        gambar: [
            'assets/images/artikel/FB_IMG_1685717936789.jpg'
        ]
    }
};
