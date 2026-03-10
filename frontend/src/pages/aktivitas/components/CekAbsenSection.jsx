import {
  Button,
  CircularProgress
} from '@mui/material';

import { CheckCircleOutlined } from '@ant-design/icons';

export default function CekAbsenSection({
  form,
  loadingCek,
  setLoadingCek,
  setFormEnabled,
  setPesanAbsen,
  showNotify
}) {

  if (!form) return null;

  const handleCekAbsen = async () => {
    try {
      setLoadingCek(true);

      const token = localStorage.getItem('token');
      if (!token) {
        showNotify('Silakan login ulang', 'error');
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/aktivitas/cek-absen?tanggal=${form.tanggal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setFormEnabled(false);
        setPesanAbsen(result.message);
        showNotify(result.message, 'error');
        return;
      }

      if (result.allowed) {
        setFormEnabled(true);
        setPesanAbsen(`Status: ${result.status}`);
        showNotify(`Absen ${result.status} - Aktivitas bisa diinput`);
      } else {
        setFormEnabled(false);
        setPesanAbsen(`Status: ${result.status || 'Tidak Ada Data'}`);
        showNotify(
          `Tidak bisa input aktivitas (${result.status || 'Tidak Ada Data'})`,
          'warning'
        );
      }

    } catch (err) {
      console.error(err);
      showNotify('Gagal cek absen', 'error');
    } finally {
      setLoadingCek(false);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleCekAbsen}
      disabled={loadingCek}
      startIcon={
        loadingCek
          ? <CircularProgress size={18} color="inherit" />
          : <CheckCircleOutlined />
      }
      sx={{
        height: 44,
        minWidth: 140,
        fontWeight: 600,
        borderRadius: 2,
        textTransform: 'none',
        px: 3
      }}
    >
      {loadingCek ? 'Memeriksa...' : 'Cek Absen'}
    </Button>
  );
}