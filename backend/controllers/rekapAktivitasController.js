import { poolLocal } from "../config/db.js";
import * as Aktivitas from "../models/aktivitasModel.js";

/* ================= REKAP AKTIVITAS ================= */

export const rekapAktivitas = async (req, res) => {
  try {

    const { bulan, tahun } = req.query;
    const userId = req.user.id;

    const result = await poolLocal.query(
      `
      SELECT
        tanggal,

        COUNT(*) FILTER (WHERE LOWER(status)='final') AS jumlah_kegiatan,

        COALESCE(
          SUM(durasi) FILTER (WHERE LOWER(status)='final'),
          0
        ) AS total_durasi,

        ROUND(
          LEAST(
            COALESCE(
              SUM(durasi) FILTER (WHERE LOWER(status)='final'),
              0
            ),
            8
          ) * 100.0 / 8,
          2
        ) AS persen

      FROM aktivitas

      WHERE user_id = $1
      AND EXTRACT(MONTH FROM tanggal) = $2
      AND EXTRACT(YEAR FROM tanggal) = $3

      GROUP BY tanggal
      ORDER BY tanggal DESC
      `,
      [userId, bulan, tahun]
    );

    res.json(result.rows);

  } catch (err) {

    console.error("ERROR REKAP:", err);

    res.status(500).json({
      message: "Gagal mengambil rekap aktivitas"
    });

  }
};

/* ================= UPDATE AKTIVITAS ================= */

export const update = async (req, res) => {
  try {

    console.log("BODY UPDATE:", req.body);

    const data = await Aktivitas.updateAktivitas(
      req.params.id,
      req.body
    );

    console.log("RESULT UPDATE:", data);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Data berhasil diupdate",
      data
    });

  } catch (err) {

    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};