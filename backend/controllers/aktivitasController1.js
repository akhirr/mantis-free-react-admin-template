import * as Aktivitas from '../models/aktivitasModel.js';

/* ================= CREATE ================= */
//export const store = async (req, res) => {
//  try {
//    const payload = {
//      ...req.body,
//      user_id: req.user.id
//    };

//    const data = await Aktivitas.createAktivitas(payload);

//    res.status(201).json({
//      success: true,
//      message: 'Aktivitas berhasil dibuat',
//      data
//    });

//  } catch (err) {
//    console.error('STORE ERROR:', err);
//    res.status(500).json({ success: false, message: err.message });
//  }
//};
import { poolLocal } from "../config/db.js";


export const createAktivitas = async (req, res) => {
  try {
    const nip = req.user?.nip;
    if (!nip) return res.status(401).json({ message: "Token tidak valid" });

    const userId = await getUserIdByNip(nip);
    if (!userId) {
      return res.status(404).json({ message: "user_id untuk nip tidak ditemukan (mapping belum ada)" });
    }

    const {
      tanggal,        // "2026-02-25"
      lokasi,
      kategori,
      nama_kegiatan,
      deskripsi,
      durasi,         // menit (int)
      status,
      link_bukti,
    } = req.body;

    if (!tanggal || !nama_kegiatan) {
      return res.status(400).json({ message: "tanggal & nama_kegiatan wajib diisi" });
    }

    // pastikan durasi integer menit
    const durasiMenit = Number.isFinite(Number(durasi)) ? parseInt(durasi, 10) : 0;
    if (durasiMenit < 0) return res.status(400).json({ message: "durasi tidak valid" });

    const sql = `
      INSERT INTO aktivitas
        (user_id, tanggal, lokasi, kategori, nama_kegiatan, deskripsi, durasi, status, link_bukti)
      VALUES
        ($1, $2::date, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, user_id, tanggal, nama_kegiatan, durasi, created_at;
    `;

    const params = [
      userId,
      tanggal,
      lokasi || null,
      kategori || null,
      nama_kegiatan,
      deskripsi || null,
      durasiMenit,
      status || null,
      link_bukti || null,
    ];

    const { rows } = await poolLocal.query(sql, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("createAktivitas error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET ALL ================= */
export const getAll = async (req, res) => {
  try {
    const data = await Aktivitas.getAllAktivitas(req.user.id);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error('GET ALL ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ================= GET DETAIL ================= */
export const detail = async (req, res) => {
  try {
    const data = await Aktivitas.getDetailAktivitas(
      req.params.id,
      req.user.id
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error('DETAIL ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ================= UPDATE ================= */
export const update = async (req, res) => {
  try {
    const data = await Aktivitas.updateAktivitas(
      req.params.id,
      req.user.id,
      req.body
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Data berhasil diupdate',
      data
    });

  } catch (err) {
    console.error('UPDATE ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ================= DELETE ================= */
export const remove = async (req, res) => {
  try {
    const deleted = await Aktivitas.deleteAktivitas(
      req.params.id,
      req.user.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Data berhasil dihapus'
    });

  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};