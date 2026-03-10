import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function SummaryTable({ summary, theme }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 0,
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
            <TableCell sx={{ fontWeight: 700 }}>KETERANGAN</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">JUMLAH</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>KETERANGAN</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">JUMLAH</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>Jumlah Total Hari Kerja</TableCell>
            <TableCell align="center">{summary.hari_kerja}</TableCell>
            <TableCell>Terlambat Masuk 1 - 30 Menit</TableCell>
            <TableCell align="center">{summary.telat_1_30}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Alpha</TableCell>
            <TableCell align="center">{summary.alpha}</TableCell>
            <TableCell>Terlambat Masuk 31 - 60 Menit</TableCell>
            <TableCell align="center">{summary.telat_31_60}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Sakit</TableCell>
            <TableCell align="center">{summary.sakit}</TableCell>
            <TableCell>Terlambat Masuk 61 - 90 Menit</TableCell>
            <TableCell align="center">{summary.telat_61_90}</TableCell>
          </TableRow>

           <TableRow>
            <TableCell>Tidak Upacara Hari Besar</TableCell>
            <TableCell align="center">{summary.upacara_hari_besar}</TableCell>
            <TableCell>Terlambat Masuk &gt; 91 Menit</TableCell>
            <TableCell align="center">{summary.telat_91}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Tidak Apel Pagi/Sore</TableCell>
            <TableCell align="center">{summary.tidak_absen_sore}</TableCell>
            <TableCell>Pulang Lebih Awal 1 - 30 Menit</TableCell>
            <TableCell align="center">{summary.pulang_1_30}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Izin</TableCell>
            <TableCell align="center">{summary.izin}</TableCell>
            <TableCell>Pulang Lebih Awal 31 - 60 Menit</TableCell>
            <TableCell align="center">{summary.pulang_31_60}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Cuti</TableCell>
            <TableCell align="center">{summary.cuti}</TableCell>
            <TableCell>Pulang Lebih Awal 61 - 90 Menit</TableCell>
            <TableCell align="center">{summary.pulang_61_90}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Tugas Luar</TableCell>
            <TableCell align="center">{summary.tugas_luar}</TableCell>
            <TableCell>Pulang Lebih Awal &gt; 91 Menit</TableCell>
            <TableCell align="center">{summary.pulang_91}</TableCell>
          </TableRow>

           <TableRow>
            <TableCell>Tidak Absen Pulang</TableCell>
            <TableCell align="center">{summary.tidak_absen_sore}</TableCell>
            <TableCell>Cuti Sakit</TableCell>
            <TableCell align="center">{summary.cuti_sakit}</TableCell>
          </TableRow>

           <TableRow>
            <TableCell>Cuti Melahirkan</TableCell>
            <TableCell align="center">{summary.cuti_melahirkan}</TableCell>
            <TableCell>Akumulasi Izin + Sakit ( max 3 Hari )</TableCell>
            <TableCell align="center">{summary.akumulasi_izin}</TableCell>
          </TableRow>

           <TableRow>
            <TableCell>Cuti Melahirkan &gt; 3</TableCell>
            <TableCell align="center">{summary.cuti_melahirkan_3}</TableCell>
            <TableCell>Absen Dibatalkan</TableCell>
            <TableCell align="center">{summary.absen_dibatalkan}</TableCell>
          </TableRow>
          
           <TableRow>
            <TableCell>Bekerja Dari Rumah</TableCell>
            <TableCell align="center">{summary.bekerja_dari_rumah}</TableCell>
            <TableCell>Hasil Investigasi</TableCell>
            <TableCell align="center">{summary.hasil_investigasi}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Cuti Tahunan</TableCell>
            <TableCell align="center">{summary.cuti_tahunan}</TableCell>
            <TableCell>Absen Masuk Dibatalkan</TableCell>
            <TableCell align="center">{summary.absen_dibatalkan_2}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Hadir</TableCell>
            <TableCell align="center">{summary.hadir}</TableCell>
            <TableCell>Absen Keluar Dibatalkan</TableCell>
            <TableCell align="center">{summary.absen_dibatalkan_2}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}