import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DetailAktivitasModal from "./DetailAktivitasModal";
import TambahAktivitasModal from "./TambahAktivitasModal";
import EditAktivitasModal from "./EditAktivitasModal";
import HapusAktivitasMessage from "./HapusAktivitasModal";

import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

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
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import MainCard from "components/MainCard";

import {
  PlusOutlined,
  SearchOutlined,
  EllipsisOutlined
} from "@ant-design/icons";

/* ================= STATUS BADGE ================= */

function StatusBadge({ value }) {

  const status = value?.toLowerCase();

  const map = {
    draft: { label: "Draft", color: "warning" },
    final: { label: "Final", color: "success" }
  };

  const s = map[status] || {
    label: value,
    color: "default"
  };

  return <Chip label={s.label} color={s.color} size="small" />;
}

/* ================= PAGE ================= */

export default function AktivitasDataGrid() {

  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [menuAnchor, setMenuAnchor] = useState(null);

  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedData, setSelectedData] = useState(null);

  const [detailData, setDetailData] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  /* ================= LOAD DATA ================= */

  const loadData = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/aktivitas",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("RESPONSE GET:", res.data);

    const dataArray = res.data?.data || [];

    const mapped = dataArray.map((item) => ({
      id: item.id,
      tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      nama: item.nama_kegiatan,
      kategori: item.kategori,
      lokasi: item.lokasi,
      durasi: item.durasi,
      status: item.status?.toLowerCase(),
      deskripsi: item.deskripsi || "",
      link_bukti: item.link_bukti || ""
    }));

    setRows(mapped);

  } catch (err) {

    console.error("LOAD DATA ERROR:", err);

    alert("Gagal memuat data");

  }
};

  useEffect(() => {
    loadData();
  }, []);

  /* ================= ACTION ================= */

  const handleDetail = (row) => {
    setDetailData(row);
    setOpenDetail(true);
  };

  const handleEdit = (row) => {
    setSelectedData(row);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/aktivitas/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      loadData();

    } catch {
      alert("Gagal hapus data");
    }

  };

  const handleKirim = async (row) => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/aktivitas/${row.id}/kirim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      loadData();

    } catch {
      alert("Gagal kirim");
    }

  };

  /* ================= TAMBAH ================= */

  const handleTambah = async (data) => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/api/aktivitas",
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    await loadData();

    return res.data; // ⭐ penting

  } catch (err) {

    console.error(err);

    return {
      success: false,
      message: "Gagal menyimpan data"
    };

  }

};
  /* ================= EDIT ================= */

  const handleUpdate = async (data) => {

    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/aktivitas/${selectedData.id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    loadData();
    setOpenEdit(false);
  };

  /* ================= FILTER ================= */

  const filteredRows = useMemo(() => {

    return rows.filter((row) => {

      const q = search.toLowerCase();

      const matchSearch =
        row.nama.toLowerCase().includes(q) ||
        row.kategori.toLowerCase().includes(q) ||
        row.lokasi.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        row.status === statusFilter;

      return matchSearch && matchStatus;

    });

  }, [rows, search, statusFilter]);

  /* ================= COLUMNS ================= */

  const center = { headerAlign: "center", align: "center" };

  const columns = [

    { field: "id", headerName: "No", width: 70, ...center },
    { field: "tanggal", headerName: "Tanggal", width: 150, ...center },
    { field: "nama", headerName: "Nama", flex: 1 },
    { field: "kategori", headerName: "Kategori", width: 120, ...center },
    { field: "lokasi", headerName: "Lokasi", width: 120, ...center },
    { field: "durasi", headerName: "Durasi", width: 90, ...center },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      ...center,
      renderCell: (p) => <StatusBadge value={p.value} />
    },

    {
      field: "aksi",
      headerName: "Aksi",
      width: 260,
      sortable: false,
      ...center,

      renderCell: (params) => {

        const status = params.row.status;

        return (

          <Stack direction="row" spacing={1}>

            <Button
              size="small"
              variant="outlined"
              onClick={() => handleDetail(params.row)}
            >
              Detail
            </Button>

            {status === "draft" && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleEdit(params.row)}
                >
                  Edit
                </Button>

                <HapusAktivitasMessage
                  activityName={params.row.nama}
                  onConfirm={() => handleDelete(params.row.id)}
                />
              </>
            )}

            {status === "final" && (
              <Button
                size="small"
                color="success"
                variant="contained"
                onClick={() => handleKirim(params.row)}
              >
                Kirim
              </Button>
            )}

          </Stack>

        );

      }
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

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">Semua</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="final">Final</MenuItem>
            </Select>

          </FormControl>

          <Button
            variant="contained"
            startIcon={<PlusOutlined />}
            onClick={() => setOpenTambah(true)}
          >
            Tambah
          </Button>

          <Button onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <EllipsisOutlined />
          </Button>

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

      <Paper sx={{ height: 520 }}>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          disableRowSelectionOnClick
        />

      </Paper>

      <TambahAktivitasModal
        open={openTambah}
        onClose={() => setOpenTambah(false)}
        onSubmit={handleTambah}
      />

      <EditAktivitasModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={selectedData}
        onSubmit={handleUpdate}
      />

      <DetailAktivitasModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        data={detailData}
      />

    </MainCard>

  );

}

StatusBadge.propTypes = {
  value: PropTypes.string
};