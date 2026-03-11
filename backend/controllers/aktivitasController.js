import * as Aktivitas from '../models/aktivitasModel.js';
import { getStatusAbsen } from '../models/absensiModel.js';

/* ================= CEK ABSEN ================= */
export const cekAbsen = async (req, res) => {
  try {
    console.log("=== CEK ABSEN MASUK ===");
    console.log("QUERY:", req.query);
    console.log("USER:", req.user);

    const { tanggal } = req.query;

    if (!tanggal) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal wajib dikirim'
      });
    }

    // ===== VALIDASI 7 HARI =====
    const today = new Date();
    const selected = new Date(tanggal);

    if (isNaN(selected)) {
      return res.status(400).json({
        success: false,
        message: 'Format tanggal tidak valid'
      });
    }

    const diffTime = today - selected;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 7 || diffDays < 0) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal hanya bisa dicek maksimal 7 hari ke belakang'
      });
    }

    // ===== VALIDASI USER =====
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan (token invalid)'
      });
    }

    if (!req.user.nip) {
      console.log("NIP TIDAK ADA DI TOKEN");
      return res.status(400).json({
        success: false,
        message: 'NIP tidak ditemukan di token'
      });
    }

    const nip = req.user.nip;

    const data = await getStatusAbsen(nip, tanggal);

    console.log("DATA ABSEN:", data);

    if (!data) {
      return res.json({
        success: true,
        allowed: false,
        message: 'Tidak ada data absensi'
      });
    }

    const status = data.status?.toLowerCase();

    const allowed =
      status === 'hadir' ||
      status === 'tugas luar';

    return res.json({
      success: true,
      allowed,
      status: data.status,
      jam_masuk: data.jam_masuk,
      jam_keluar: data.jam_keluar
    });

  } catch (err) {
    console.error('CEK ABSEN ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};


/* ================= CREATE ================= */
export const store = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      user_id: req.user.id
    };

    const data = await Aktivitas.createAktivitas(payload);

    res.status(201).json({
      success: true,
      message: 'Aktivitas berhasil dibuat',
      data
    });

  } catch (err) {
    console.error('STORE ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
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

    const id = req.params.id;
    const data = req.body;

    console.log("BODY UPDATE:", data);

    /* ===== CEK DATA LAMA ===== */
    const old = await Aktivitas.getDetailAktivitas(
      id,
      req.user.id
    );

    if (!old) {
      return res.status(404).json({
        success: false,
        message: "Data aktivitas tidak ditemukan"
      });
    }

    console.log("OLD DATA:", old);

    /* ===== CEK STATUS FINAL ===== */
    if (old.status === "Final") {
      return res.status(400).json({
        success: false,
        message: "Aktivitas dengan status Final tidak dapat diedit"
      });
    }

    /* ===== CEK BATAS 7 HARI ===== */

    const today = new Date();
    const tanggalAktivitas = new Date(old.tanggal);

    const diffTime = today - tanggalAktivitas;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      return res.status(400).json({
        success: false,
        message: "Aktivitas hanya dapat diedit maksimal 7 hari"
      });
    }

    /* ===== PROSES UPDATE ===== */

    const result = await Aktivitas.updateAktivitas(
      id,
      data
    );

    res.json({
      success: true,
      message: "Aktivitas berhasil diperbarui",
      data: result
    });

  } catch (err) {

    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Gagal update aktivitas"
    });

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