/* ===== Parser Tanggal Indonesia Natujaga =====
   Tanggal di data.js ditulis sebagai teks Indonesia, contoh:
   '28 Agu 2025', '12 Desember 2026', '5 Okt 2025'.
   new Date() bawaan JavaScript TIDAK bisa membaca format itu
   (hasilnya Invalid Date / NaN), jadi pengurutan tanggal rusak.
   Pakai parseTanggalID() di bawah ini untuk membaca tanggal dari data.js.
   Mengembalikan objek Date, atau null bila tanggal tidak dikenal
   (pemanggil harus menaruh tanggal null di urutan paling akhir).
*/

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
    if (teks instanceof Date) return isNaN(teks) ? null : teks;

    const cocok = String(teks).trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!cocok) {
        // Format lain (mis. ISO '2025-08-28') — serahkan ke parser bawaan.
        const d = new Date(teks);
        return isNaN(d) ? null : d;
    }

    const bulan = BULAN_ID[cocok[2].toLowerCase()];
    if (bulan === undefined) return null;

    const hasil = new Date(parseInt(cocok[3], 10), bulan, parseInt(cocok[1], 10));
    return isNaN(hasil) ? null : hasil;
}

/* Comparator untuk sort(): tanggal TERBARU dulu.
   Tanggal yang tidak dikenal selalu ditaruh paling akhir (tidak crash). */
function bandingTanggalDesc(a, b) {
    const da = parseTanggalID(a);
    const db = parseTanggalID(b);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
}

// Bila dijalankan di Node (untuk test / skrip), ekspor juga sebagai modul.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseTanggalID, bandingTanggalDesc, BULAN_ID };
}
