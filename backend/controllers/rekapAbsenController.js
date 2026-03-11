import { getRekapBulananByNip, getSummaryRekapByNip } from "../services/rekapAbsenService.js";
import { mapRekapBulananRows, mapSummaryRekapRow } from "../utils/rekapMapper.js";

export const rekapBulanan = async (req, res) => {
  try {
    const bulan = parseInt(req.query.bulan, 10);
    const tahun = parseInt(req.query.tahun, 10);
    const nip = req.user?.nip;

    if (!bulan || !tahun) {
      return res.status(400).json({ message: "Bulan & Tahun wajib diisi" });
    }

    if (!nip) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    const startDate = `${tahun}-${String(bulan).padStart(2, "0")}-01`;

    const rows = await getRekapBulananByNip(nip, startDate);
    const result = mapRekapBulananRows(rows);

    return res.json(result);
  } catch (err) {
    console.error("rekapBulanan error:", err);

    if (err.code === "ETIMEDOUT") {
      return res.status(503).json({
        message: "Koneksi ke database absensi timeout."
      });
    }

    return res.status(500).json({
      message: "Server error saat mengambil rekap absensi."
    });
  }
};

export const summaryRekap = async (req, res) => {
  try {
    const bulan = parseInt(req.query.bulan, 10);
    const tahun = parseInt(req.query.tahun, 10);
    const nip = req.user?.nip;

    if (!bulan || !tahun) {
      return res.status(400).json({ message: "Bulan & Tahun wajib diisi" });
    }

    if (!nip) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    const row = await getSummaryRekapByNip(nip, bulan, tahun);
    const result = mapSummaryRekapRow(row);
const disiplinKerja = {
  alpha: result.alpha || 0,

  tl1: result.terlambat_1_30 || 0,
  tl2: result.terlambat_31_60 || 0,
  tl3: result.terlambat_61_90 || 0,
  tl4: result.terlambat_91 || 0,

  psw1: result.pulang_1_30 || 0,
  psw2: result.pulang_31_60 || 0,
  psw3: result.pulang_61_90 || 0,
  psw4: result.pulang_91 || 0
};

return res.json({
  ...result,
  disiplinKerja
});
  } catch (err) {
    console.error("summaryRekap error:", err);

    if (err.code === "ETIMEDOUT") {
      return res.status(503).json({
        message: "Koneksi ke database absensi timeout."
      });
    }

    return res.status(500).json({
      message: "Server error saat mengambil summary rekap."
    });
  }
};