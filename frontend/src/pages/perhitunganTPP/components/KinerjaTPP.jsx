import { Box, Typography, LinearProgress } from "@mui/material";

const clamp = (v) => Math.max(0, Math.min(100, v));

export default function KinerjaTPP({ data }) {

  const persen = Number(data?.persen ?? 0);
  const totalCapaian = Number(data?.totalCapaian ?? 0);
  const targetCapaian = Number(data?.targetCapaian ?? 0);

  return (
    <Box>

      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontWeight={700}>
          Kinerja ({data?.bobot ?? 60}%)
        </Typography>

        <Typography fontWeight={700}>
          {Math.round(persen)}%
        </Typography>
      </Box>

      {/* PROGRESS BAR */}
      <LinearProgress
        variant="determinate"
        value={clamp(persen)}
        sx={{ height: 8, borderRadius: 99, mt: 1 }}
      />

      {/* DETAIL */}
      <Box sx={{ mt: 1 }}>

        <Typography variant="body2">
          ✓ Target Bulanan : {totalCapaian} / {targetCapaian}
        </Typography>

        <Typography variant="body2" color="success.main">
          Kontribusi ke TPP : {data?.kontribusi ?? 0}%
        </Typography>

      </Box>

    </Box>
  );
}