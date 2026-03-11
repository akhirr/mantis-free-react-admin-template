import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function FilterBulan({ bulan, tahun, setBulan, setTahun }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <FormControl size="small">
        <InputLabel>Bulan</InputLabel>
        <Select value={bulan} label="Bulan" onChange={(e) => setBulan(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel>Tahun</InputLabel>
        <Select value={tahun} label="Tahun" onChange={(e) => setTahun(e.target.value)}>
          {[2024, 2025, 2026].map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}