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
import Typography from '@mui/material/Typography';

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
  { field: 'nip', headerName: 'NIP', width: 180 },
  { field: 'hadir', headerName: 'Hadir', width: 100, align: 'center' },
  { field: 'izin', headerName: 'Izin', width: 100, align: 'center' },
  { field: 'alpha', headerName: 'Alpha', width: 100, align: 'center' },
  { field: 'cuti', headerName: 'Cuti', width: 100, align: 'center' },
  { field: 'sakit', headerName: 'Sakit', width: 100, align: 'center' },
  { field: 'dinas_luar', headerName: 'Dinas Luar', width: 120, align: 'center' },
  { field: 'total_hari', headerName: 'Total Hari', width: 120, align: 'center' },
  { field: 'total_telat', headerName: 'Total Telat (mnt)', width: 150, align: 'center' },
  { field: 'cepat_pulang', headerName: 'Cepat Pulang (mnt)', width: 170, align: 'center' }
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

  // ================= GET DATA =================

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
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Tambah ID untuk DataGrid
      const result = res.data.map((item, index) => ({
        id: index + 1,
        ...item
      }));

      setData(result);

    } catch (err) {
      console.error('Gagal ambil rekap:', err);

      if (err.response?.status === 401) {
        alert('Session habis, silakan login ulang');
      }

    } finally {
      setLoading(false);
    }
  };

  // ================= AUTO LOAD =================

  useEffect(() => {
    fetchRekap();
  }, []);

  // ================= SEARCH =================

  const rows = useMemo(() => {
    return data.filter((row) =>
      row.nip.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // ==============================|| UI ||============================== //

  return (
    <MainCard
      title="Rekap Absensi Bulanan"
      content={false}
      sx={{ width: '100%' }}
      secondary={
        <Stack direction="row" spacing={1} alignItems="center">

          {/* BULAN */}
          <TextField
            size="small"
            select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
          >
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
          <TextField
            size="small"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            sx={{ width: 90 }}
          />

          {/* TAMPILKAN */}
          <Button
            size="small"
            variant="contained"
            onClick={fetchRekap}
            sx={{ textTransform: 'none' }}
          >
            Tampilkan
          </Button>

          {/* SEARCH */}
          <TextField
            size="small"
            placeholder="Cari NIP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchOutlined style={{ marginRight: 8 }} />
            }}
          />

          {/* EXPORT */}
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <EllipsisOutlined />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem>Export PDF</MenuItem>
            <MenuItem>Export Excel</MenuItem>
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

            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.grey[100]
            },

            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              fontSize: '0.875rem'
            },

            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center'
            },

            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        />

      </Paper>

    </MainCard>
  );
}