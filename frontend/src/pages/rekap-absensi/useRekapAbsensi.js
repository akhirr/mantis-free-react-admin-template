import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';

export default function useRekapAbsensi(API_URL) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulan, setBulan] = useState(() => String(new Date().getMonth() + 1));
  const [tahun, setTahun] = useState(() => String(new Date().getFullYear()));
  const [search, setSearch] = useState('');

  const [summary, setSummary] = useState({
    hari_kerja: 0,
    alpha: 0,
    sakit: 0,
    upacara_hari_besar: 0,
    cuti_melahirkan: 0,
    cuti_melahirkan_3: 0,
    bekerja_dari_rumah: 0,
    cuti_tahunan: 0,
    absen_dibatalkan: 0,
    absen_dibatalkan_2: 0,
    hasil_investigasi: 0,
    akumulasi_izin: 0,
    cuti_sakit: 0,
    izin: 0,
    cuti: 0,
    tugas_luar: 0,
    tugas_belajar: 0,
    tidak_absen_sore: 0,
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        tidak_absen_sore: Number(r.tidak_absen_sore ?? 0),
        hadir: Number(r.hadir ?? 0),
        telat_1_30: Number(r.tmk1 ?? 0),
        telat_31_60: Number(r.tmk2 ?? 0),
        telat_61_90: Number(r.tmk3 ?? 0),
        telat_91: Number(r.tmk4 ?? 0),
        pulang_1_30: Number(r.psw1 ?? 0),
        pulang_31_60: Number(r.psw2 ?? 0),
        pulang_61_90: Number(r.psw3 ?? 0),
        pulang_91: Number(r.psw4 ?? 0),
        upacara_hari_besar: Number(r.upacara_hari_besar ?? 0),
        cuti_melahirkan: Number(r.cuti_melahirkan ?? 0),
        cuti_melahirkan_3: Number(r.cuti_melahirkan_3 ?? 0),
        cuti_tahunan: Number(r.cuti_tahunan ?? 0),
        bekerja_dari_rumah: Number(r.bekerja_dari_rumah ?? 0),        
        absen_dibatalkan: Number(r.absen_dibatalkan ?? 0),
        absen_dibatalkan_2: Number(r.absen_dibatalkan_2 ?? 0),
        hasil_investigasi: Number(r.hasil_investigasi ?? 0),
        akumulasi_izin: Number(r.akumulasi_izin ?? 0),
        cuti_sakit: Number(r.cuti_sakit ?? 0)
      });
    } catch (err) {
      console.error('Gagal ambil summary:', err);
    }
  };

  const fetchRekap = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/api/rekap/rekap-bulanan?bulan=${bulan}&tahun=${tahun}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = (res.data || []).map((item, index) => ({ id: index + 1, ...item }));
      setData(result);
      await fetchSummary(token);
    } catch (err) {
      console.error('Gagal ambil rekap:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => { fetchRekap(); }, [bulan, tahun]);

  const disiplin = {
    alpha: summary.alpha ?? 0,
    tmk1: summary.telat_1_30 ?? 0,
    tmk2: summary.telat_31_60 ?? 0,
    tmk3: summary.telat_61_90 ?? 0,
    tmk4: summary.telat_91 ?? 0,
    psw1: summary.pulang_1_30 ?? 0,
    psw2: summary.pulang_31_60 ?? 0,
    psw3: summary.pulang_61_90 ?? 0,
    psw4: summary.pulang_91 ?? 0
  };

  return {
    bulan,
    setBulan,
    tahun,
    setTahun,
    search,
    setSearch,
    loading,
    rows,
    summary,
    disiplin,
    fetchRekap
  };
}