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

  const [bulan, setBulan] = useState('2');
  const [tahun, setTahun] = useState('2026');

  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const fetchRekap = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan, silakan login ulang');
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/rekap/rekap-bulanan?bulan=${bulan}&tahun=${tahun}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // DataGrid wajib ada "id" unik
      
      const result = (res.data || []).map((item, index) => ({
        id: index + 1,
        ...item
      }));

      setData(result);
    } catch (err) {
      console.error('Gagal ambil rekap:', err);

      if (err.response?.status === 401) {
        alert('Session habis / token tidak valid. Silakan login ulang.');
      } else {
        alert('Gagal mengambil data rekap.');
      }
    } finally {
      setLoading(false);
    }
  };

  // load awal (biarkan, karena ada tombol "Tampilkan")
  useEffect(() => {
    fetchRekap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SEARCH: karena halaman pegawai sudah terfilter nip di backend,
  // search kita arahkan ke tanggal/jam/keterangan
  const rows = useMemo(() => {
    const q = (search || '').toLowerCase();
    if (!q) return data;

    return data.filter((row) => {
      const tgl = (row.tanggal ?? '').toString().toLowerCase();
      const masuk = (row.jam_absen_masuk ?? '').toString().toLowerCase();
      const keluar = (row.jam_absen_keluar ?? '').toString().toLowerCase();
      const ket = (row.status ?? '').toString().toLowerCase();
      return `${tgl} ${masuk} ${keluar} ${ket}`.includes(q);
    });
  }, [data, search]);

  return (
    <MainCard
      title="Rekap Absensi Bulanan"
      content={false}
      sx={{ width: '100%' }}
      secondary={
        <Stack direction="row" spacing={1} alignItems="center">
          {/* BULAN */}
          <TextField size="small" select value={bulan} onChange={(e) => setBulan(e.target.value)}>
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

          {/* TAHUN */}
          <TextField size="small" value={tahun} onChange={(e) => setTahun(e.target.value)} sx={{ width: 90 }} />

          {/* TAMPILKAN */}
          <Button size="small" variant="contained" onClick={fetchRekap} sx={{ textTransform: 'none' }}>
            Tampilkan
          </Button>

          {/* SEARCH */}
          <TextField
            size="small"
            placeholder="Cari tanggal / keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchOutlined style={{ marginRight: 8 }} />
            }}
            sx={{ minWidth: 220 }}
          />

          {/* EXPORT */}
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
    </MainCard>
  );
}