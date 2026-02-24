import express from "express";
import { getRekapBulanan } from "../controllers/rekapAbsenController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/rekap-bulanan", verifyToken, getRekapBulanan);

export default router;