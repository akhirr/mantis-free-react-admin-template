import db from '../config/db.js';

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
    data.namaKegiatan,
    data.deskripsi,
    data.durasi,
    data.status,
    data.linkBukti
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};


/* ================= GET ALL ================= */
export const getAllAktivitas = async (userId) => {
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
export const updateAktivitas = async (id, userId, data) => {
  const query = `
    UPDATE aktivitas SET
      tanggal=$1,
      lokasi=$2,
      kategori=$3,
      nama_kegiatan=$4,
      deskripsi=$5,
      durasi=$6,
      status=$7,
      link_bukti=$8
    WHERE id=$9 AND user_id=$10
    RETURNING *
  `;

  const values = [
    data.tanggal,
    data.lokasi,
    data.kategori,
    data.namaKegiatan,
    data.deskripsi,
    data.durasi,
    data.status,
    data.linkBukti,
    id,
    userId
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};


/* ================= DELETE ================= */
export const deleteAktivitas = async (id, userId) => {
  const result = await db.query(
    `DELETE FROM aktivitas
     WHERE id=$1 AND user_id=$2
     RETURNING id`,
    [id, userId]
  );

  return result.rows[0];
};