import { poolLocal } from '../config/db.js';
const db = poolLocal;

/* ================= CREATE ================= */
export const createAktivitas = async (data) => {
  const query = `
    INSERT INTO aktivitas (
      user_id,
      tanggal,
      lokasi,
      kategori,
      nama_kegiatan,
      deskripsi,
      durasi,
      status,
      link_bukti
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `;

  const values = [
    data.user_id,
    data.tanggal,
    data.lokasi,
    data.kategori,
    data.nama_kegiatan,
    data.deskripsi,
    data.durasi,
    data.status,
    data.link_bukti
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};


/* ================= GET ALL ================= */
export const getAllAktivitas = async (userId) => {
  console.log("USER ID MASUK MODEL:", userId, typeof userId);

  const result = await db.query(
    `SELECT * FROM aktivitas
     WHERE user_id=$1
     ORDER BY id DESC`,
    [userId]
  );

  return result.rows;
};


/* ================= GET DETAIL ================= */
export const getDetailAktivitas = async (id, userId) => {
  const result = await db.query(
    `SELECT * FROM aktivitas
     WHERE id=$1 AND user_id=$2`,
    [id, userId]
  );

  return result.rows[0];
};


/* ================= UPDATE ================= */
export const updateAktivitas = async (id, data) => {

  const {
    lokasi,
    kategori,
    nama_kegiatan,
    deskripsi,
    durasi,
    status,
    link_bukti
  } = data;

  const query = `
    UPDATE aktivitas
    SET
      lokasi = $1,
      kategori = $2,
      nama_kegiatan = $3,
      deskripsi = $4,
      durasi = $5,
      status = $6,
      link_bukti = $7
    WHERE id = $8
    RETURNING *
  `;

  const values = [
    lokasi,
    kategori,
    nama_kegiatan,
    deskripsi,
    durasi,
    status,
    link_bukti,
    id
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};