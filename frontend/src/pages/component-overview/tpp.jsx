import { useEffect, useState } from "react";
import { Box, Typography, LinearProgress, Paper, Divider } from "@mui/material";
import axios from "axios";

const clamp = (v) => Math.max(0, Math.min(100, v));

export default function PerhitunganTPP({ bulan, tahun }) {
  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const now = new Date();
    const b = Number.isFinite(Number(bulan)) ? Number(bulan) : now.getMonth() + 1;
    const t = Number.isFinite(Number(tahun)) ? Number(tahun) : now.getFullYear();

    // ambil token dari localStorage (sesuaikan key kalau beda)
    const token = localStorage.getItem("token"); // kalau key kamu "accessToken", ganti di sini

    (async () => {
      try {
        setErrMsg("");

        const res = await axios.get(
          `${API_URL}/api/tpp/estimasi?bulan=${b}&tahun=${t}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" }
              : { "Cache-Control": "no-cache" },
          }
        );

        console.log("RESP TPP:", res.data);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setErrMsg(err?.response?.data?.message || "Gagal memuat data TPP");
        setData(null);
      }
    })();
  }, [bulan, tahun, API_URL]);

  if (errMsg) return <Paper sx={{ p: 3 }}>{errMsg}</Paper>;
  if (!data) return <Paper sx={{ p: 3 }}>Loading...</Paper>;

  // fallback aman (tidak crash)
  const nominal = Number(data?.estimasiNominal ?? data?.estimasi_nominal ?? 0);
  const totalPersen = Number(data?.totalPersen ?? data?.total_persen ?? 0);

  const kehadiran = data?.kehadiran || {};
  const kinerja = data?.kinerja || {};

  const persenKehadiran = Number(kehadiran?.persen ?? 0);
  const persenKinerja = Number(kinerja?.persen ?? 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={800}>Perhitungan TPP</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">Estimasi TPP</Typography>
        <Typography variant="h4" fontWeight={900}>
          Rp. {nominal.toLocaleString("id-ID")},-
        </Typography>

        <Box sx={{ mt: 1 }}>
          <LinearProgress variant="determinate" value={clamp(totalPersen)} sx={{ height: 10, borderRadius: 99 }} />
          <Typography variant="caption">{Math.round(totalPersen)}%</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight={700}>Kehadiran ({kehadiran?.bobot ?? 40}%)</Typography>
          <Typography fontWeight={700}>{Math.round(persenKehadiran)}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={clamp(persenKehadiran)} sx={{ height: 8, borderRadius: 99, mt: 1 }} />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            ✓ Hari Kerja : {kehadiran?.hadir ?? 0} / {kehadiran?.hariKerja ?? 0}
          </Typography>
          <Typography variant="body2">
            ✓ Telat / tidak absen : {kehadiran?.telatAtauTidakAbsen ?? 0}
          </Typography>
          <Typography variant="body2" color="success.main">
            Kontribusi ke TPP : {kehadiran?.kontribusi ?? 0}%
          </Typography>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight={700}>Kinerja ({kinerja?.bobot ?? 60}%)</Typography>
          <Typography fontWeight={700}>{Math.round(persenKinerja)}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={clamp(persenKinerja)} sx={{ height: 8, borderRadius: 99, mt: 1 }} />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            ✓ Target harian : {kinerja?.targetMenitPerHari ?? 420} menit (7 jam)
          </Typography>
          <Typography variant="body2" color="success.main">
            Kontribusi ke TPP : {kinerja?.kontribusi ?? 0}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};