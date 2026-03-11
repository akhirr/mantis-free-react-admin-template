import { Box, Typography, LinearProgress } from "@mui/material";

const clamp = (v) => Math.max(0, Math.min(100, v));

export default function EstimasiTPP({ nominal, totalPersen }) {
  return (
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
  );
}