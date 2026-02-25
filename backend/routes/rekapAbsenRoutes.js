import express from "express";
import { rekapBulanan } from "../controllers/rekapAbsenController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; //memasukkan middleware untuk otentikasi

const router = express.Router();

router.get("/rekap-bulanan", verifyToken, rekapBulanan);

export default router;