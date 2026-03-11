import { summaryRekapService } from "./rekapAbsenService.js";

export const hitungTPP = async (nip, bulan, tahun, tppDasar) => {

  const disiplin = await summaryRekapService(nip, bulan, tahun);

  const totalPelanggaran =
      disiplin.alpha * 5 +
      disiplin.terlambat_1_30 * 1 +
      disiplin.terlambat_31_60 * 2 +
      disiplin.terlambat_61_90 * 3 +
      disiplin.terlambat_91 * 4;

  const potongan = Math.min(totalPelanggaran, 100);

  const estimasi = tppDasar * (1 - potongan / 100);

  return {
    disiplin,
    potongan,
    estimasi
  };
};