import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Paper,
  Chip,
  Box,
  Stack,
  Button,
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputAdornment,
  Typography,
  CircularProgress
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import MainCard from "components/MainCard";

import { SearchOutlined, EllipsisOutlined } from "@ant-design/icons";

/* ================= BADGE ================= */

const PersenBadge = ({ value }) => {

  const persen = Number(value) || 0;

  let color = "error";

  if (persen >= 100) color = "success";
  else if (persen >= 75) color = "warning";

  return <Chip label={`${persen}%`} color={color} size="small" />;

};

/* ================= PAGE ================= */

export default function RekapAktivitas() {

  const now = new Date();

  const [bulan, setBulan] = useState(String(now.getMonth() + 1));
  const [tahun, setTahun] = useState(String(now.getFullYear()));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);

  /* ================= FETCH DATA ================= */

  const fetchRekap = async () => {

  try {

    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:5000/api/aktivitas/rekap-aktivitas?bulan=${bulan}&tahun=${tahun}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = Array.isArray(res.data) ? res.data : [];

    const mapped = data.map((r, i) => ({

    id: i + 1,

    rawTanggal: r.tanggal,

    tanggal: new Date(r.tanggal).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"

    }),

    jumlah: Number(r.jumlah_kegiatan),

    durasi: Number(r.total_durasi),

    persen: Number(r.persen)

    }));

    setRows(mapped);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }

};

  /* LOAD PERTAMA */

  useEffect(() => {
    fetchRekap();
  }, []);

  /* ================= SEARCH ================= */

  const filteredRows = useMemo(() => {

    if (!search) return rows;

    const q = search.toLowerCase();

    return rows.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(q)
    );

  }, [rows, search]);

  /* ================= SUMMARY ================= */

  const { capaianHariIni, rataBulan, totalKegiatan } = useMemo(() => {

    let durasiHariIni = 0;
    let durasiBulan = 0;
    let hariAktifBulan = new Set();
    let kegiatan = 0;

    const now = new Date();

    rows.forEach((r) => {

      const tgl = new Date(r.rawTanggal);

      const sameDay =
        tgl.getDate() === now.getDate() &&
        tgl.getMonth() === now.getMonth() &&
        tgl.getFullYear() === now.getFullYear();

      if (sameDay) durasiHariIni += r.durasi;

      const sameMonth =
        tgl.getMonth() === now.getMonth() &&
        tgl.getFullYear() === now.getFullYear();

      if (sameMonth) {

        durasiBulan += Math.min(r.durasi, 8);
        hariAktifBulan.add(tgl.getDate());
        kegiatan += r.jumlah;

      }

    });

    return {

      capaianHariIni: Math.round((Math.min(durasiHariIni, 8) / 8) * 100),

      rataBulan: hariAktifBulan.size
        ? Math.round((durasiBulan / (hariAktifBulan.size * 8)) * 100)
        : 0,

      totalKegiatan: kegiatan

    };

  }, [rows]);

  /* ================= EXPORT ================= */

  const exportExcel = () => {

    const data = filteredRows.map((r, i) => ({
      No: i + 1,
      Tanggal: r.tanggal,
      Jumlah: r.jumlah,
      Durasi: r.durasi,
      Capaian: `${r.persen}%`
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Rekap");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(new Blob([buffer]), "rekap_aktivitas.xlsx");

  };

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text("Rekap Aktivitas Harian", 14, 10);

    autoTable(doc, {
      head: [["No", "Tanggal", "Jumlah", "Durasi", "Capaian"]],
      body: filteredRows.map((r, i) => [
        i + 1,
        r.tanggal,
        r.jumlah,
        `${r.durasi} Jam`,
        `${r.persen}%`
      ]),
      startY: 20
    });

    doc.save("rekap_aktivitas.pdf");

  };

  /* ================= COLUMNS ================= */

  const center = { headerAlign: "center", align: "center" };

  const columns = [

    { field: "id", headerName: "No", width: 70, ...center },
    { field: "tanggal", headerName: "Tanggal", flex: 1 },
    { field: "jumlah", headerName: "Jumlah", width: 120, ...center },
    { field: "durasi", headerName: "Durasi (Jam)", width: 140, ...center },
    {
      field: "persen",
      headerName: "Capaian",
      width: 130,
      ...center,
      renderCell: (p) => <PersenBadge value={p.value} />
    }

  ];

  /* ================= RENDER ================= */

  return (

    <MainCard
      title="Rekap Aktivitas"
      content={false}
      secondary={

        <Stack direction="row" spacing={1} alignItems="center">

          {/* BULAN */}

          <TextField
            size="small"
            select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
          >

            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={String(i + 1)}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </MenuItem>
            ))}

          </TextField>

          {/* TAHUN */}

          <TextField
            size="small"
            type="number"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            inputProps={{ min: 2020, max: 2100, step: 1 }}
            sx={{ width: 110 }}
          />

          {/* BUTTON TAMPILKAN */}

          <Button
            variant="contained"
            size="small"
            onClick={fetchRekap}
          >
            Tampilkan
          </Button>

          {/* SEARCH */}

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

          {/* EXPORT */}

          <Button onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <EllipsisOutlined />
          </Button>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={exportPDF}>Export PDF</MenuItem>
            <MenuItem onClick={exportExcel}>Export Excel</MenuItem>
          </Menu>

        </Stack>

      }
    >

      <Box p={2}>

        <Stack direction="row" spacing={5}>

          <Typography variant="subtitle2">
            Capaian Hari Ini : <PersenBadge value={capaianHariIni} />
          </Typography>

          <Typography variant="subtitle2">
            Rata-rata Bulan : <PersenBadge value={rataBulan} />
          </Typography>

          <Typography variant="subtitle2">
            Total Kegiatan : <b>{totalKegiatan}</b>
          </Typography>

        </Stack>

      </Box>

      <Paper sx={{ height: 520 }}>

        {loading ? (

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>

        ) : (

          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              }
            }}
          />

        )}

      </Paper>

    </MainCard>

  );

}