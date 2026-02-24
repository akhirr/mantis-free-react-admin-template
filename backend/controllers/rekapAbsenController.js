import pool from '../config/db.js';

export const getRekapBulanan = async (req, res) => {
  try {

    const { bulan, tahun } = req.query;

    // ambil dari token
    const userId = req.user.id;
    const nip = req.user.nip;

    console.log('USER LOGIN:', userId, nip);

    const query = `
      SELECT
        u.nip,

        COUNT(*) FILTER (WHERE a.status = '1') AS hadir,
        COUNT(*) FILTER (WHERE a.status = '2') AS izin,
        COUNT(*) FILTER (WHERE a.status = '3') AS alpha,
        COUNT(*) FILTER (WHERE a.status = '4') AS cuti,
        COUNT(*) FILTER (WHERE a.status = '5') AS sakit,
        COUNT(*) FILTER (WHERE a.status = '6') AS dinas_luar,

        COUNT(*) AS total_hari,

        COALESCE(SUM(a.terlambat),0) AS total_telat,
        COALESCE(SUM(a.cepat_pulang),0) AS cepat_pulang

      FROM absen a
      JOIN users u ON a.user_id = u.id

      WHERE
        a.user_id = $1
        AND EXTRACT(MONTH FROM a.tanggal) = $2
        AND EXTRACT(YEAR FROM a.tanggal) = $3

      GROUP BY u.nip
    `;

    const result = await pool.query(query, [
      userId,
      bulan,
      tahun
    ]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Gagal ambil rekap',
      error: err.message
    });
  }
};