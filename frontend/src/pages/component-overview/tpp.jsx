import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  const disiplin = data?.disiplinKerja || {};

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
      <Divider sx={{ my: 3 }} />

<Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
  Rincian Disiplin Kerja
</Typography>

<TableContainer component={Paper} variant="outlined">
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell><b>Keterangan</b></TableCell>
        <TableCell align="center"><b>Jumlah</b></TableCell>
        <TableCell align="center"><b>Potongan (%)</b></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Alpha</TableCell>
        <TableCell align="center">{disiplin.alpha ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potAlpha ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Terlambat Masuk TL1 (1-30 menit)</TableCell>
        <TableCell align="center">{disiplin.tmk1 ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potTmk1 ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Terlambat Masuk TL2 (31-60 menit)</TableCell>
        <TableCell align="center">{disiplin.tmk2 ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potTmk2 ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Terlambat Masuk TL3 (61-90 menit)</TableCell>
        <TableCell align="center">{disiplin.tmk3 ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potTmk3 ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Terlambat Masuk TL4 (&gt; 90 menit)</TableCell>
        <TableCell align="center">{disiplin.tmk4 ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potTmk4 ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Pulang Cepat PSW1 (1-30 menit)</TableCell>
        <TableCell align="center">{disiplin.psw1 ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potPsw1 ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Pulang Cepat PSW2 (31-60 menit)</TableCell>
        <TableCell align="center">{disiplin.psw2 ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potPsw2 ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Pulang Cepat PSW3 (61-90 menit)</TableCell>
        <TableCell align="center">{disiplin.psw3 ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potPsw3 ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>Pulang Cepat PSW4 (&gt; 90 menit)</TableCell>
        <TableCell align="center">{disiplin.psw4 ?? 0}</TableCell>
        <TableCell align="center">{disiplin.potPsw4 ?? 0}%</TableCell>
      </TableRow>

      <TableRow>
        <TableCell><b>Total Potongan</b></TableCell>
        <TableCell align="center">-</TableCell>
        <TableCell align="center"><b>{disiplin.totalPotongan ?? 0}%</b></TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

    </Paper>
  );
}