export const bulanID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];

export const formatTanggalIndonesia = (tanggal) => {
  const tgl = new Date(tanggal);
  return `${String(tgl.getDate()).padStart(2, "0")} ${bulanID[tgl.getMonth()]} ${tgl.getFullYear()}`;
};

export const mapRekapBulananRows = (rows) => {
  return rows.map((row, i) => ({
    id: i + 1,
    tanggal: formatTanggalIndonesia(row.tanggal),
    jam_absen_masuk: row.jam_absen_masuk,
    jam_absen_keluar: row.jam_absen_keluar,
    terlambat_menit: Number(row.terlambat_menit || 0),
    cepat_pulang_menit: Number(row.cepat_pulang_menit || 0),
    keterangan: row.keterangan,
    jenis_libur: row.jenis_libur
  }));
};

export const mapSummaryRekapRow = (row = {}) => ({
  jlh_hari_kerja: Number(row.jlh_hari_kerja ?? 0),
  tmk1: Number(row.tmk1 ?? 0),
  tmk2: Number(row.tmk2 ?? 0),
  tmk3: Number(row.tmk3 ?? 0),
  tmk4: Number(row.tmk4 ?? 0),
  psw1: Number(row.psw1 ?? 0),
  psw2: Number(row.psw2 ?? 0),
  psw3: Number(row.psw3 ?? 0),
  psw4: Number(row.psw4 ?? 0),
  hadir: Number(row.hadir ?? 0),
  alfa: Number(row.alfa ?? 0),
  sakit: Number(row.sakit ?? 0),
  izin: Number(row.izin ?? 0),
  tugas_luar: Number(row.tugas_luar ?? 0),
  cuti: Number(row.cuti ?? 0),
  tugas_belajar: Number(row.tugas_belajar ?? 0)
});