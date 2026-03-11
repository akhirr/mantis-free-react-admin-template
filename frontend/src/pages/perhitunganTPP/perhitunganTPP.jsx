import { useEffect, useState } from "react";
import { Paper, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

import FilterBulan from "./components/FilterBulan";
import EstimasiTPP from "./components/EstimasiTPP";
import KehadiranTPP from "./components/KehadiranTPP";
import KinerjaTPP from "./components/KinerjaTPP";
import DisiplinKerjaTable from "./components/DisiplinKerjaTable";

import SummaryTable from "../rekap-absensi/SummaryTable";
import useRekapAbsensi from "../rekap-absensi/useRekapAbsensi";

export default function PerhitunganTPP() {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const now = new Date();
  const {summary,disiplin} = useRekapAbsensi(API_URL);

  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [data, setData] = useState(null);
  const theme = useTheme();

  

  useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get(`${API_URL}/api/tpp/estimasi?bulan=${bulan}&tahun=${tahun}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setData(res.data))
      .catch(() => setData(null));

  }, [bulan, tahun]);

  if (!data) return <Paper sx={{ p: 3 }}>Loading...</Paper>;

  return (
    <Paper sx={{ p: 3 }}>

      <FilterBulan
        bulan={bulan}
        tahun={tahun}
        setBulan={setBulan}
        setTahun={setTahun}
      />

      <EstimasiTPP
        nominal={data.estimasiNominal}
        totalPersen={data.totalPersen}
      />

      <Divider sx={{ my: 2 }} />

      <KehadiranTPP data={data.kehadiran} />

      <KinerjaTPP data={data.kinerja} />

      <Divider sx={{ my: 3 }} />

      <DisiplinKerjaTable disiplin={data?.disiplin ||{}}  />

       <SummaryTable summary={summary} theme={theme} />

    </Paper>
  );
}