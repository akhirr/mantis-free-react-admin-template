import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

export default function DisiplinKerjaTable({ disiplin = {} }) {

  const alpha = disiplin.alpha ?? 0;

  const tl1 = disiplin.tl1 ?? 0;
  const tl2 = disiplin.tl2 ?? 0;
  const tl3 = disiplin.tl3 ?? 0;
  const tl4 = disiplin.tl4 ?? 0;

  const psw1 = disiplin.psw1 ?? 0;
  const psw2 = disiplin.psw2 ?? 0;
  const psw3 = disiplin.psw3 ?? 0;
  const psw4 = disiplin.psw4 ?? 0;
  // hitung potongan
  const potAlpha = alpha * 3;

  const potTL1 = tl1 * 0.5;
  const potTL2 = tl2 * 1;
  const potTL3 = tl3 * 1.5;
  const potTL4 = tl4 * 2;

  const potPSW1 = psw1 * 0.5;
  const potPSW2 = psw2 * 1;
  const potPSW3 = psw3 * 1.5;
  const potPSW4 = psw4 * 2;

  const totalPotongan =
    potAlpha +
    potTL1 +
    potTL2 +
    potTL3 +
    potTL4 +
    potPSW1 +
    potPSW2 +
    potPSW3 +
    potPSW4;

  const rows = [
    ["Alpha", alpha, potAlpha],
    ["Terlambat Datang 1-30 menit", tl1, potTL1],
    ["Terlambat Datang 31-60 menit", tl2, potTL2],
    ["Terlambat Datang 61-90 menit", tl3, potTL3],
    ["Terlambat Datang >90 menit", tl4, potTL4],
    ["Pulang Cepat 1-30 menit", psw1, potPSW1],
    ["Pulang Cepat 31-60 menit", psw2, potPSW2],
    ["Pulang Cepat 61-90 menit", psw3, potPSW3],
    ["Pulang Cepat >90 menit", psw4, potPSW4],
  ];

  return (
    <>
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
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row[0]}</TableCell>
                <TableCell align="center">{row[1]}</TableCell>
                <TableCell align="center">{row[2].toFixed(2)}%</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell><b>Total Potongan</b></TableCell>
              <TableCell align="center">-</TableCell>
              <TableCell align="center">
                <b>{totalPotongan.toFixed(2)}%</b>
              </TableCell>
            </TableRow>
          </TableBody>

        </Table>
      </TableContainer>
    </>
  );
}