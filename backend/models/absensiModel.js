import { poolPublic } from '../config/db.js';
const db = poolPublic;

export const getStatusAbsen = async (nip, tanggal) => {
  const query = `
    SELECT
      r.status,
      a.jam_absen_masuk,
      a.jam_absen_keluar
    FROM absen a
    LEFT JOIN ref_status_absen r ON r.id = a.status
    WHERE a.nip = $1
    AND DATE(a.tanggal AT TIME ZONE 'Asia/Jakarta') = $2
    LIMIT 1
  `;

  const { rows } = await db.query(query, [nip, tanggal]);

  if (!rows[0]) return null;

  return {
    status: rows[0].status,
    jam_masuk: rows[0].jam_absen_masuk,
    jam_keluar: rows[0].jam_absen_keluar
  };
};