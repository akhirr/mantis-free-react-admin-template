import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { nip, password } = req.body;

    if (!nip || !password) {
      return res.status(400).json({
        message: 'NIP dan Password wajib diisi'
      });
    }

    /* Cari user */
    const result = await pool.query(
      'SELECT * FROM users WHERE nip = $1',
      [nip]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        message: 'NIP tidak ditemukan'
      });
    }

    const user = result.rows[0];

    /* Cek password */
    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        message: 'Password salah'
      });
    }

    /* Generate token */
    const token = jwt.sign(
      {
        id: user.id,
        nip: user.nip
      },
      process.env.JWT_SECRET || 'rahasia123',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nip: user.nip,
        nama: user.nama
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error'
    });
  }
};