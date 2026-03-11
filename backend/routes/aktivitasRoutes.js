import express from 'express';

import {
  store,
  update,
  remove,
  getAll,
  detail,
  cekAbsen
} from '../controllers/aktivitasController.js';

import { rekapAktivitas } from '../controllers/rekapAktivitasController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/* ===== ABSEN ===== */

router.get('/cek-absen', verifyToken, cekAbsen);

/* ===== REKAP ===== */

router.get('/rekap-aktivitas', verifyToken, rekapAktivitas);

/* ===== AKTIVITAS ===== */

router.get('/', verifyToken, getAll);
router.get('/:id', verifyToken, detail);
router.post('/', verifyToken, store);
router.put('/:id', verifyToken, update);
router.delete('/:id', verifyToken, remove);

export default router;

