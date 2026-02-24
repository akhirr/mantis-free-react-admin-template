import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import HapusAktivitasModal from './HapusAktivitasModal';
import DetailAktivitasModal from './DetailAktivitasModal';
import TambahAktivitasModal from './TambahAktivitasModal';

import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import {
  Paper,
  Chip,
  Stack,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Select,
  FormControl
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/MainCard';

import { PlusOutlined, SearchOutlined, EllipsisOutlined } from '@ant-design/icons';

/* ================= STATUS BADGE ================= */

function StatusBadge({ value }) {
  const statusMap = {
    SELESAI: { label: 'Selesai', color: 'success' },
    PROSES: { label: 'Proses', color: 'warning' },
    PENDING: { label: 'Pending', color: 'default' }
  };

  const status = statusMap[value] || { label: value, color: 'default' };
  return <Chip label={status.label} color={status.color} size="small" />;
}

/* ================= PAGE ================= */

export default function AktivitasDataGrid() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [openModal, setOpenModal] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [detailData, setDetailData] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  /* ================= LOAD DATA ================= */

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:5000/api/aktivitas', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const dataArray =
        Array.isArray(res.data) ? res.data : res.data.data || res.data.rows || res.data.aktivitas || [];

      const mapped = dataArray.map((item) => ({
        id: item.id,
        tanggal: new Date(item.created_at).toLocaleString('id-ID'),
        nama: item.nama_kegiatan,
        kategori: item.kategori,
        lokasiKerja: item.lokasi,
        durasi: item.durasi,
        status: item.status,
        keterangan: item.deskripsi || '-',
        link_bukti: item.link_bukti || null
      }));

      setRows(mapped);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data aktivitas');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= EXPORT ================= */

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Aktivitas');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'data_aktivitas.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Data Aktivitas', 14, 10);

    const tableRows = filteredRows.map((row) => [
      row.id,
      row.tanggal,
      row.nama,
      row.kategori,
      row.lokasiKerja,
      `${row.durasi} Jam`,
      row.status,
      row.keterangan
    ]);

    autoTable(doc, {
      head: [['No', 'Tanggal', 'Nama', 'Kategori', 'Lokasi', 'Durasi', 'Status', 'Keterangan']],
      body: tableRows,
      startY: 20
    });

    doc.save('data_aktivitas.pdf');
  };

  /* ================= ACTION ================= */

  const handleDetail = (row) => {
    setDetailData(row);
    setOpenDetail(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/aktivitas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      loadData();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus');
    }
  };

  const handleTambah = async (data) => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/aktivitas', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      loadData();
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert('Gagal simpan');
    }
  };

  /* ================= FILTER ================= */

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const text = search.toLowerCase();

      const matchSearch =
        row.nama.toLowerCase().includes(text) ||
        row.kategori.toLowerCase().includes(text) ||
        row.lokasiKerja.toLowerCase().includes(text);

      const matchStatus = statusFilter === 'ALL' || row.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  /* ================= COLUMNS ================= */

  const center = { headerAlign: 'center', align: 'center' };

  const columns = [
    { field: 'id', headerName: 'No', width: 70, ...center },
    { field: 'tanggal', headerName: 'Tanggal', width: 170, ...center },
    { field: 'nama', headerName: 'Nama Aktivitas', flex: 1, ...center },
    { field: 'kategori', headerName: 'Kategori', width: 120, ...center },
    { field: 'lokasiKerja', headerName: 'Lokasi', width: 120, ...center },
    { field: 'durasi', headerName: 'Durasi', width: 90, ...center },
    { field: 'status', headerName: 'Status', width: 120, ...center, renderCell: (p) => <StatusBadge value={p.value} /> },
    { field: 'keterangan', headerName: 'Keterangan', flex: 1, ...center },
    {
      field: 'aksi',
      headerName: 'Aksi',
      width: 220,
      sortable: false,
      ...center,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center', // rata vertikal
            height: '100%'        // agar menempel ke tengah vertikal sel
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleDetail(params.row)}
            sx={{ height: 32 }}
          >
            Detail
          </Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)} // sebelumnya salah handleDelete
            sx={{ height: 32 }}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            sx={{ height: 32 }}
          >
            Hapus
          </Button>
        </Stack>
      )
    }
  ];

  /* ================= RENDER ================= */

  return (
    <MainCard
      title="Daftar Aktivitas"
      content={false}
      secondary={
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="ALL">Semua</MenuItem>
              <MenuItem value="SELESAI">Selesai</MenuItem>
              <MenuItem value="PROSES">Proses</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
            Tambah
          </Button>

          <Button onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <EllipsisOutlined />
          </Button>

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={exportPDF}>Export PDF</MenuItem>
            <MenuItem onClick={exportExcel}>Export Excel</MenuItem>
          </Menu>
        </Stack>
      }
    >
      <Paper sx={{ height: 520 }}>
        <DataGrid rows={filteredRows} columns={columns} disableRowSelectionOnClick />
      </Paper>

      <TambahAktivitasModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleTambah} />

      <DetailAktivitasModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        data={detailData}
      />
    </MainCard>
  );
}

StatusBadge.propTypes = { value: PropTypes.string };