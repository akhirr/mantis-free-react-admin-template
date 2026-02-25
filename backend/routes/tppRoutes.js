import express from "express";
import { estimasiTPP } from "../controllers/tppController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/estimasi", verifyToken, estimasiTPP);

export default router;