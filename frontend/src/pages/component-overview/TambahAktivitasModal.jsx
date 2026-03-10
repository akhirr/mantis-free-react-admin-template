import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  CalendarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

export default function TambahAktivitasModal({ open, onClose, onSubmit }) {

  /* ================= STATE ================= */
  const [formEnabled, setFormEnabled] = useState(false);
  const [pesanAbsen, setPesanAbsen] = useState('');
  const [loadingCek, setLoadingCek] = useState(false);

  const [notify, setNotify] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [form, setForm] = useState({
    tanggal: '',
    lokasi: '',
    kategori: '',
    namaKegiatan: '',
    deskripsi: '',
    status: '',
    durasi: '',
    linkBukti: ''
  });

  const showNotify = (message, severity = 'success') => {
    setNotify({ open: true, message, severity });
  };

  /* ================= AUTO RESET ================= */
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split('T')[0];

      setForm({
        tanggal: today,
        lokasi: '',
        kategori: '',
        namaKegiatan: '',
        deskripsi: '',
        status: '',
        durasi: '',
        linkBukti: ''
      });

      setFormEnabled(false);
      setPesanAbsen('');
    }
  }, [open]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'tanggal') {
      setFormEnabled(false);
      setPesanAbsen('');
    }
  };

  /* ================= CEK ABSEN ================= */
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
          headers: { Authorization: `Bearer ${token}` }
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
        showNotify(`Absen ${result.status} - Aktivitas bisa diinput`, 'success');
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

  /* ================= VALIDASI ================= */
  const validate = () => {
    if (!formEnabled) return 'Silakan cek absen terlebih dahulu';
    if (!form.tanggal) return 'Tanggal wajib diisi';
    if (!form.lokasi) return 'Lokasi wajib dipilih';
    if (!form.kategori) return 'Kategori wajib dipilih';
    if (!form.namaKegiatan) return 'Nama kegiatan wajib diisi';
    if (!form.durasi) return 'Durasi wajib dipilih';
    if (!form.status) return 'Status wajib dipilih';
    if (!form.linkBukti) return 'Link bukti wajib diisi';
    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      showNotify(error, 'error');
      return;
    }

    try {
      await onSubmit(form);
      showNotify('Aktivitas berhasil disimpan', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      showNotify('Gagal menyimpan data', 'error');
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            Tambah Aktivitas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lengkapi aktivitas harian Anda
          </Typography>
        </DialogTitle>

        <Divider />

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2.5} mt={1}>

              {/* TANGGAL */}
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Tanggal"
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarOutlined />
                      </InputAdornment>
                    )
                  }}
                />



                <Button
                  variant="contained"
                  onClick={handleCekAbsen}
                  disabled={loadingCek}
                  startIcon={
                    loadingCek ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <CheckCircleOutlined />
                    )
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
              </Stack>

              {pesanAbsen && (
                <Alert
                  severity={formEnabled ? 'success' : 'warning'}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  {pesanAbsen}
                </Alert>
              )}

              {/* FIELD TERKUNCI SAMPAI LOLOS CEK */}
              <FormControl required disabled={!formEnabled}>
                <Typography fontWeight={600}>Lokasi Kerja</Typography>
                <RadioGroup row name="lokasi" value={form.lokasi} onChange={handleChange}>
                  <FormControlLabel value="Kantor/WFO" control={<Radio />} label="Kantor / WFO" />
                  <FormControlLabel value="Dinas Luar/WFA" control={<Radio />} label="Dinas Luar / WFA" />
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth required disabled={!formEnabled}>
                <InputLabel>Kategori</InputLabel>
                <Select name="kategori" value={form.kategori} label="Kategori" onChange={handleChange}>
                  <MenuItem value="Administrasi">Administrasi</MenuItem>
                  <MenuItem value="Teknis">Teknis</MenuItem>
                  <MenuItem value="Lapangan">Lapangan</MenuItem>
                  <MenuItem value="Koordinasi">Koordinasi</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Nama Kegiatan"
                name="namaKegiatan"
                value={form.namaKegiatan}
                onChange={handleChange}
                fullWidth
                required
                disabled={!formEnabled}
              />

              <TextField
                label="Deskripsi"
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                disabled={!formEnabled}
              />

              <FormControl fullWidth required disabled={!formEnabled}>
                <InputLabel>Durasi</InputLabel>
                <Select name="durasi" value={form.durasi} label="Durasi" onChange={handleChange}>
                  {[1,2,3,4,5,6].map((i) => (
                    <MenuItem key={i} value={i}>{i} Jam</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required disabled={!formEnabled}>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={form.status} label="Status" onChange={handleChange}>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Final">Final</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Link Bukti"
                name="linkBukti"
                value={form.linkBukti}
                onChange={handleChange}
                type="url"
                fullWidth
                required
                disabled={!formEnabled}
              />

            </Stack>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
              disabled={!formEnabled}
            >
              Simpan Data
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* NOTIFICATION */}
      <Snackbar
        open={notify.open}
        autoHideDuration={3000}
        onClose={() => setNotify({ ...notify, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={notify.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notify.message}
        </Alert>
      </Snackbar>
    </>
  );
}