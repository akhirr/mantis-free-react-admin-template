import { Box, Typography, LinearProgress } from "@mui/material";

const clamp = (v) => Math.max(0, Math.min(100, v));

export default function KehadiranTPP({ data }) {

  const persen = Number(data?.persen ?? 0);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontWeight={700}>
          Kehadiran ({data?.bobot ?? 40}%)
        </Typography>
        

        <Typography fontWeight={700}>
          {Math.round(persen)}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={clamp(persen)}
        sx={{ height: 8, borderRadius: 99, mt: 1 }}
      />

      <Box sx={{ mt: 1 }}>
        <Typography variant="body2">
          ✓ Hari Kerja : {data?.hadir ?? 0} / {data?.hariKerja ?? 0}
        </Typography>
        <Typography variant="body2">
          Potongan Disiplin : {data?.potonganDisiplin ?? 0}%
        </Typography>

        <Typography variant="body2">
          Persen Kehadiran Bersih : {data?.persenBersih ?? 0}%
        </Typography>

        <Typography variant="body2" color="success.main">
          Kontribusi ke TPP : {data?.kontribusi ?? 0}%
        </Typography>
      </Box>
    </Box>
  );
}