import express from "express";
import { rekapBulanan, summaryRekap } from "../controllers/rekapAbsenController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/rekap-bulanan", verifyToken, rekapBulanan);
router.get("/summary", verifyToken, summaryRekap);

export default router;