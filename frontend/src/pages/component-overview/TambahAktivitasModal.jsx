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
  Typography
} from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  CalendarOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

export default function TambahAktivitasModal({ open, onClose, onSubmit }) {

  // ================= STATE =================
  const [form, setForm] = useState({
    tanggal: '',
    lokasi: '',        // ⬅️ STRING (radio)
    kategori: '',
    namaKegiatan: '',
    deskripsi: '',
    status: '',
    durasi: '',
    linkBukti: ''
  });

  // ================= AUTO TANGGAL =================
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    setForm((prev) => ({
      ...prev,
      tanggal: today
    }));
  }, []);


  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  // ================= CEK ABSEN =================
  const handleCekAbsen = () => {
    alert(`Absen ${form.tanggal} : HADIR ✅`);
  };


  // ================= VALIDASI =================
  const validate = () => {

    if (!form.tanggal) return 'Tanggal wajib diisi';
    if (!form.lokasi) return 'Lokasi wajib dipilih';
    if (!form.kategori) return 'Kategori wajib dipilih';
    if (!form.namaKegiatan) return 'Nama kegiatan wajib diisi';
    if (!form.durasi) return 'Durasi wajib dipilih';
    if (!form.status) return 'Status wajib dipilih';
    if (!form.linkBukti) return 'Link bukti wajib diisi';

    return null;
  };


  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (error) {
      alert(error);
      return;
    }

    console.log('DATA DIKIRIM:', form); // DEBUG

    try {

      await onSubmit(form);

      // reset
      setForm({
        tanggal: new Date().toISOString().split('T')[0],
        lokasi: '',
        kategori: '',
        namaKegiatan: '',
        deskripsi: '',
        status: '',
        durasi: '',
        linkBukti: ''
      });

      onClose();

    } catch (err) {

      console.error(err);
      alert('Gagal menyimpan data');

    }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >

      {/* HEADER */}
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

        {/* CONTENT */}
        <DialogContent>

          <Stack spacing={2.5} mt={1}>

            {/* TANGGAL */}
            <Stack direction="row" spacing={2}>

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
                fullWidth
                variant="contained"
                onClick={handleCekAbsen}
                startIcon={<CheckCircleOutlined />}
                sx={{
                  height: 40,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Cek Absen
              </Button>

            </Stack>


            {/* LOKASI */}
            <FormControl required>

              <Typography fontWeight={600}>
                Lokasi Kerja
              </Typography>

              <RadioGroup
                row
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
              >

                <FormControlLabel
                  value="Kantor/WFO"
                  control={<Radio />}
                  label="Kantor / WFO"
                />

                <FormControlLabel
                  value="Dinas Luar/WFA"
                  control={<Radio />}
                  label="Dinas Luar / WFA"
                />

              </RadioGroup>

            </FormControl>


            {/* KATEGORI */}
            <FormControl fullWidth required>

              <InputLabel>Kategori</InputLabel>

              <Select
                name="kategori"
                value={form.kategori}
                label="Kategori"
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <AppstoreOutlined />
                  </InputAdornment>
                }
              >
                <MenuItem value="Administrasi">Administrasi</MenuItem>
                <MenuItem value="Teknis">Teknis</MenuItem>
                <MenuItem value="Lapangan">Lapangan</MenuItem>
                <MenuItem value="Koordinasi">Koordinasi</MenuItem>
              </Select>

            </FormControl>


            {/* NAMA */}
            <TextField
              label="Nama Kegiatan"
              name="namaKegiatan"
              value={form.namaKegiatan}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FileTextOutlined />
                  </InputAdornment>
                )
              }}
            />


            {/* DESKRIPSI */}
            <TextField
              label="Deskripsi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />


            {/* DURASI */}
            <FormControl fullWidth required>

              <InputLabel>Durasi</InputLabel>

              <Select
                name="durasi"
                value={form.durasi}
                label="Durasi"
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <ClockCircleOutlined />
                  </InputAdornment>
                }
              >
                {[1,2,3,4,5,6].map((i) => (
                  <MenuItem key={i} value={i}>
                    {i} Jam
                  </MenuItem>
                ))}
              </Select>

            </FormControl>


            {/* STATUS */}
            <FormControl fullWidth required>

              <InputLabel>Status</InputLabel>

              <Select
                name="status"
                value={form.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Final">Final</MenuItem>
                <MenuItem value="Revisi">Revisi</MenuItem>
              </Select>

            </FormControl>


            {/* LINK */}
            <TextField
              label="Link Bukti"
              name="linkBukti"
              value={form.linkBukti}
              onChange={handleChange}
              type="url"
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkOutlined />
                  </InputAdornment>
                )
              }}
            />

          </Stack>

        </DialogContent>


        <Divider />


        {/* FOOTER */}
        <DialogActions sx={{ p: 2 }}>

          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Batal
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Simpan Data
          </Button>

        </DialogActions>

      </form>

    </Dialog>
  );
}