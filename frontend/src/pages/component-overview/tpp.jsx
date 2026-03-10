import { useEffect, useState } from "react";
import { 
  Box, Typography, LinearProgress, Paper, Divider,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import axios from "axios";

const clamp = (v) => Math.max(0, Math.min(100, v));

export default function PerhitunganTPP() {

  const now = new Date();

  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());

  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {

    const token = localStorage.getItem("token");

    (async () => {
      try {
        setErrMsg("");

        const res = await axios.get(
          `${API_URL}/api/tpp/estimasi?bulan=${bulan}&tahun=${tahun}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" }
              : { "Cache-Control": "no-cache" },
          }
        );

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

  const nominal = Number(data?.estimasiNominal ?? data?.estimasi_nominal ?? 0);
  const totalPersen = Number(data?.totalPersen ?? data?.total_persen ?? 0);

  const kehadiran = data?.kehadiran || {};
  const kinerja = data?.kinerja || {};

  const persenKehadiran = Number(kehadiran?.persen ?? 0);
  const persenKinerja = Number(kinerja?.persen ?? 0);

  return (
    <Paper sx={{ p: 3 }}>

      {/* FILTER BULAN */}
      <Box sx={{ display:"flex", gap:2, mb:2 }}>

        <FormControl size="small">
          <InputLabel>Bulan</InputLabel>
          <Select
            value={bulan}
            label="Bulan"
            onChange={(e)=>setBulan(e.target.value)}
          >
            <MenuItem value={1}>Januari</MenuItem>
            <MenuItem value={2}>Februari</MenuItem>
            <MenuItem value={3}>Maret</MenuItem>
            <MenuItem value={4}>April</MenuItem>
            <MenuItem value={5}>Mei</MenuItem>
            <MenuItem value={6}>Juni</MenuItem>
            <MenuItem value={7}>Juli</MenuItem>
            <MenuItem value={8}>Agustus</MenuItem>
            <MenuItem value={9}>September</MenuItem>
            <MenuItem value={10}>Oktober</MenuItem>
            <MenuItem value={11}>November</MenuItem>
            <MenuItem value={12}>Desember</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Tahun</InputLabel>
          <Select
            value={tahun}
            label="Tahun"
            onChange={(e)=>setTahun(e.target.value)}
          >
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2026}>2026</MenuItem>
          </Select>
        </FormControl>

      </Box>


      <Typography variant="h5" fontWeight={800}>Perhitungan TPP</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">Estimasi TPP</Typography>

        <Typography variant="h4" fontWeight={900}>
          Rp. {nominal.toLocaleString("id-ID")},-
        </Typography>

        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={clamp(totalPersen)}
            sx={{ height: 10, borderRadius: 99 }}
          />
          <Typography variant="caption">{Math.round(totalPersen)}%</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* KEHADIRAN */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight={700}>
            Kehadiran ({kehadiran?.bobot ?? 40}%)
          </Typography>

          <Typography fontWeight={700}>
            {Math.round(persenKehadiran)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={clamp(persenKehadiran)}
          sx={{ height: 8, borderRadius: 99, mt: 1 }}
        />

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            ✓ Hari Kerja : {kehadiran?.hadir ?? 0} / {kehadiran?.hariKerja ?? 0}
          </Typography>

 {/*}          <Typography variant="body2">
            ✓ Telat / tidak absen : {kehadiran?.telatAtauTidakAbsen ?? 0}
          </Typography>*/}

          <Typography variant="body2" color="success.main">
            Kontribusi ke TPP : {kehadiran?.kontribusi ?? 0}%
          </Typography>
        </Box>
      </Box>

      {/* KINERJA */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight={700}>
            Kinerja ({kinerja?.bobot ?? 60}%)
          </Typography>

          <Typography fontWeight={700}>
            {Math.round(persenKinerja)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={clamp(persenKinerja)}
          sx={{ height: 8, borderRadius: 99, mt: 1 }}
        />

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
}