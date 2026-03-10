import { poolPublic } from "../config/db.js";

export const getRekapBulananByNip = async (nip, startDate) => {
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
  return rows;
};

export const getSummaryRekapByNip = async (nip, bulan, tahun) => {
  const sql = `
    SELECT
      jlh_hari_kerja,
      tmk1, tmk2, tmk3, tmk4,
      psw1, psw2, psw3, psw4,
      hadir,
      alfa,
      sakit,
      izin,
      tugas_luar,
      cuti,
      tugas_belajar
    FROM absen_rekap
    WHERE nip = $1
      AND bulan = $2
      AND tahun = $3
    LIMIT 1
  `;

  const { rows } = await poolPublic.query(sql, [nip, bulan, tahun]);
  return rows[0] || {};
};