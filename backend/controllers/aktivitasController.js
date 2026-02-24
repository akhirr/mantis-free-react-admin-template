import * as Aktivitas from '../models/aktivitasModel.js';

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