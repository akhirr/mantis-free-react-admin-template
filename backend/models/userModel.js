import pool from '../config/db.js';

export const findByNip = async (nip) => {
  const result = await pool.query(
    'SELECT id, nip, nama, password FROM users WHERE nip = $1',
    [nip]
  );

  return result.rows[0];
};