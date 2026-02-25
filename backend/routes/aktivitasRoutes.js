import express from 'express';
import {
  update,
  remove,
  getAll,
  detail
} from '../controllers/aktivitasController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { createAktivitas } from "../controllers/aktivitasController.js";

const router = express.Router();

router.get('/', verifyToken, getAll);
router.get('/:id', verifyToken, detail);
router.post('/', verifyToken, createAktivitas);
router.put('/:id', verifyToken, update);
router.delete('/:id', verifyToken, remove);

export default router;