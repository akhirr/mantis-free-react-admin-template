export const columns = [
  { field: 'id', headerName: 'No', width: 70, align: 'center', headerAlign: 'center' },
  { field: 'tanggal', headerName: 'Tanggal', width: 170, align: 'center', headerAlign: 'center' },
  { field: 'jam_absen_masuk', headerName: 'Jam Datang', width: 120, align: 'center', headerAlign: 'center' },
  { field: 'jam_absen_keluar', headerName: 'Jam Pulang', width: 120, align: 'center', headerAlign: 'center' },
  {
    field: 'terlambat_menit',
    headerName: 'Terlambat Datang',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const value = Number(params.row?.terlambat_menit ?? 0);
      return value > 0 ? `${value} menit` : '0 menit';
    }
  },
  {
    field: 'cepat_pulang_menit',
    headerName: 'Cepat Pulang',
    width: 130,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const value = Number(params.row?.cepat_pulang_menit ?? 0);
      return value > 0 ? `${value} menit` : '0 menit';
    }
  },
  { field: 'keterangan', headerName: 'Keterangan', width: 160, align: 'center', headerAlign: 'center' }
];