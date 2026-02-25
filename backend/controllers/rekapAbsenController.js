import { poolPublic } from "../config/db.js";

export const rekapBulanan = async (req, res) => {
  try {
    const bulan = parseInt(req.query.bulan, 10);
    const tahun = parseInt(req.query.tahun, 10);
    const nip = req.user?.nip;

    if (!bulan || !tahun)
      return res.status(400).json({ message: "Bulan & Tahun wajib diisi" });

    if (!nip)
      return res.status(401).json({ message: "Token tidak valid" });

    const startDate = `${tahun}-${String(bulan).padStart(2, "0")}-01`;

    const sql = `
      WITH kalender AS (
        SELECT generate_series(
          date_trunc('month', $2::date),
          (date_trunc('month', $2::date) + interval '1 month - 1 day')::date,
          interval '1 day'
        )::date AS tanggal
      )
      SELECT
        k.tanggal,

        COALESCE(to_char(a.jam_absen_masuk, 'HH24:MI:SS'), '-') AS jam_absen_masuk,
        COALESCE(to_char(a.jam_absen_keluar, 'HH24:MI:SS'), '-') AS jam_absen_keluar,

        COALESCE(a.terlambat_menit, 0) AS terlambat_menit,
        COALESCE(a.cepat_pulang_menit, 0) AS cepat_pulang_menit,

        
        -- PRIORITAS: tanggal merah > weekend > status > '-'
        COALESCE(
          libur.keterangan,
          CASE
            WHEN EXTRACT(ISODOW FROM k.tanggal) = 6 THEN 'Sabtu'
            WHEN EXTRACT(ISODOW FROM k.tanggal) = 7 THEN 'Minggu'
            ELSE NULL
          END,
          r.status,
          '-'
        ) AS keterangan,

        -- jenis_libur tetap dari tabel libur, tapi weekend bisa diisi juga (opsional)
        COALESCE(
          libur.jenis_libur,
          CASE
            WHEN EXTRACT(ISODOW FROM k.tanggal) IN (6,7) THEN 'WEEKEND'
            ELSE NULL
          END
        ) AS jenis_libur
        

      FROM kalender k
      LEFT JOIN absen a
        ON a.nip = $1
        AND DATE(a.tanggal AT TIME ZONE 'Asia/Jakarta') = k.tanggal

      LEFT JOIN ref_status_absen r
        ON r.id = a.status

      LEFT JOIN jadwal_tanggal_merah libur
        ON libur.tanggal::date = k.tanggal

      ORDER BY k.tanggal;
    `;

    const { rows } = await poolPublic.query(sql, [nip, startDate]);

    const bulanID = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];

    const result = rows.map((row, i) => {
      const tgl = new Date(row.tanggal);

      return {
        id: i + 1,
        tanggal: `${String(tgl.getDate()).padStart(2, "0")} ${
          bulanID[tgl.getMonth()]
        } ${tgl.getFullYear()}`,
        jam_absen_masuk: row.jam_absen_masuk,
        jam_absen_keluar: row.jam_absen_keluar,
        terlambat_menit: `${row.terlambat_menit} menit`,
        cepat_pulang_menit: `${row.cepat_pulang_menit} menit`,
        keterangan: row.keterangan,
        jenis_libur: row.jenis_libur
      };
    });

    res.json(result);

  } catch (err) {
    console.error("rekapBulanan error:", err);
    res.status(500).json({ message: "Server error" });
  }
};