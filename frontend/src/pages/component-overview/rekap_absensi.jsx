import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// DataGrid
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'components/MainCard';

// icons
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| COLUMNS ||============================== //

const columns = [
  { field: 'id', headerName: 'No', width: 70, align: 'center', headerAlign: 'center' },
  { field: 'tanggal', headerName: 'Tanggal', width: 170, align: 'center', headerAlign: 'center' },
  { field: 'jam_absen_masuk', headerName: 'Jam Datang', width: 120, align: 'center', headerAlign: 'center' },
  { field: 'jam_absen_keluar', headerName: 'Jam Pulang', width: 120, align: 'center', headerAlign: 'center' },
  { field: 'terlambat_menit', headerName: 'Terlambat Datang', width: 150, align: 'center', headerAlign: 'center' },
  { field: 'cepat_pulang_menit', headerName: 'Cepat Pulang', width: 130, align: 'center', headerAlign: 'center' },
  { field: 'keterangan', headerName: 'Keterangan', width: 160, align: 'center', headerAlign: 'center' }
];

// ==============================|| PAGE ||============================== //

export default function RekapAbsensiBulanan() {
  const theme = useTheme();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [bulan, setBulan] = useState(() => String(new Date().getMonth() + 1));
  const [tahun, setTahun] = useState(() => String(new Date().getFullYear()));

  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [summary, setSummary] = useState({
  hari_kerja: 0,
  alpha: 0,
  sakit: 0,
  izin: 0,
  cuti: 0,
  tugas_luar: 0,
  tugas_belajar: 0,
  hadir: 0,

  telat_1_30: 0,
  telat_31_60: 0,
  telat_61_90: 0,
  telat_91: 0,

  pulang_1_30: 0,
  pulang_31_60: 0,
  pulang_61_90: 0,
  pulang_91: 0
});

const fetchSummary = async (token) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/rekap/summary?bulan=${bulan}&tahun=${tahun}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const r = res.data || {};

    setSummary({
      hari_kerja: Number(r.jlh_hari_kerja ?? 0),
      alpha: Number(r.alfa ?? 0),
      sakit: Number(r.sakit ?? 0),
      izin: Number(r.izin ?? 0),
      cuti: Number(r.cuti ?? 0),
      tugas_luar: Number(r.tugas_luar ?? 0),
      tugas_belajar: Number(r.tugas_belajar ?? 0),
      hadir: Number(r.hadir ?? 0),

      telat_1_30: Number(r.tmk1 ?? 0),
      telat_31_60: Number(r.tmk2 ?? 0),
      telat_61_90: Number(r.tmk3 ?? 0),
      telat_91: Number(r.tmk4 ?? 0),

      pulang_1_30: Number(r.psw1 ?? 0),
      pulang_31_60: Number(r.psw2 ?? 0),
      pulang_61_90: Number(r.psw3 ?? 0),
      pulang_91: Number(r.psw4 ?? 0)
    });
  } catch (err) {
    console.error('Gagal ambil summary:', err);
  }
};
  const fetchRekap = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan, silakan login ulang');
        return;
      }

      let detailData = [];

      try {
        const res = await axios.get(`${API_URL}/api/rekap/rekap-bulanan?bulan=${bulan}&tahun=${tahun}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        detailData = (res.data || []).map((item, index) => ({
          id: index + 1,
          ...item
        }));

        setData(detailData);
      } catch (err) {
        console.error('Gagal ambil detail rekap:', err);

        if (err.response?.status === 401) {
          alert('Session habis / token tidak valid. Silakan login ulang.');
        } else {
          alert(err.response?.data?.message || 'Gagal mengambil data rekap.');
        }

        setData([]);
      }

      await fetchSummary(token);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => {
    const q = (search || '').toLowerCase().trim();
    if (!q) return data;

    return data.filter((row) => {
      const tgl = String(row.tanggal ?? '').toLowerCase();
      const masuk = String(row.jam_absen_masuk ?? '').toLowerCase();
      const keluar = String(row.jam_absen_keluar ?? '').toLowerCase();
      const ket = String(row.keterangan ?? '').toLowerCase();

      return `${tgl} ${masuk} ${keluar} ${ket}`.includes(q);
    });
  }, [data, search]);

  return (
    <MainCard
      title="Rekap Absensi Bulanan"
      content={false}
      sx={{ width: '100%' }}
      secondary={
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <TextField size="small" select value={bulan} onChange={(e) => setBulan(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="1">Januari</MenuItem>
            <MenuItem value="2">Februari</MenuItem>
            <MenuItem value="3">Maret</MenuItem>
            <MenuItem value="4">April</MenuItem>
            <MenuItem value="5">Mei</MenuItem>
            <MenuItem value="6">Juni</MenuItem>
            <MenuItem value="7">Juli</MenuItem>
            <MenuItem value="8">Agustus</MenuItem>
            <MenuItem value="9">September</MenuItem>
            <MenuItem value="10">Oktober</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">Desember</MenuItem>
          </TextField>

          <TextField size="small" value={tahun} onChange={(e) => setTahun(e.target.value)} sx={{ width: 100 }} />

          <Button size="small" variant="contained" onClick={fetchRekap} disabled={loading} sx={{ textTransform: 'none' }}>
            {loading ? 'Loading...' : 'Tampilkan'}
          </Button>

          <TextField
            size="small"
            placeholder="Cari tanggal / keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />

          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <EllipsisOutlined />
          </IconButton>

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => setMenuAnchor(null)}>Export PDF</MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>Export Excel</MenuItem>
          </Menu>
        </Stack>
      }
    >
      
      <Paper
        sx={{
          height: 480,
          width: '100%',
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } }
          }}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': { backgroundColor: theme.palette.grey[100] },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.875rem' },
            '& .MuiDataGrid-cell': { fontSize: '0.875rem', display: 'flex', alignItems: 'center' },
            '& .MuiDataGrid-row:hover': { backgroundColor: theme.palette.action.hover }
          }}
        />
      </Paper>
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
              <TableCell sx={{ fontWeight: 700 }} align="center">
                JUMLAH
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>KETERANGAN</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                JUMLAH
              </TableCell>
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
              <TableCell>Izin</TableCell>
              <TableCell align="center">{summary.izin}</TableCell>
              <TableCell>Terlambat Masuk &gt; 91 Menit</TableCell>
              <TableCell align="center">{summary.telat_91}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Cuti</TableCell>
              <TableCell align="center">{summary.cuti}</TableCell>
              <TableCell>Pulang Lebih Awal 1 - 30 Menit</TableCell>
              <TableCell align="center">{summary.pulang_1_30}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Tugas Luar</TableCell>
              <TableCell align="center">{summary.tugas_luar}</TableCell>
              <TableCell>Pulang Lebih Awal 31 - 60 Menit</TableCell>
              <TableCell align="center">{summary.pulang_31_60}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Tidak Absen Pulang</TableCell>
              <TableCell align="center">{summary.tidak_absen_pulang}</TableCell>
              <TableCell>Pulang Lebih Awal 61 - 90 Menit</TableCell>
              <TableCell align="center">{summary.pulang_61_90}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Bekerja Dari Rumah</TableCell>
              <TableCell align="center">{summary.wfh}</TableCell>
              <TableCell>Pulang Lebih Awal &gt; 91 Menit</TableCell>
              <TableCell align="center">{summary.pulang_91}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Cuti Sakit</TableCell>
              <TableCell align="center">{summary.cuti_sakit}</TableCell>
              <TableCell>Cuti Melahirkan</TableCell>
              <TableCell align="center">{summary.cuti_melahirkan}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Cuti Tahunan</TableCell>
              <TableCell align="center">{summary.cuti_tahunan}</TableCell>
              <TableCell></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

    </MainCard>
  );
}