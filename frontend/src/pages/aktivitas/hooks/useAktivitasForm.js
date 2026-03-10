import { useState, useEffect } from 'react';

/* ================= DEFAULT FORM ================= */
const initialForm = {
  tanggal: '',
  lokasi: '',
  kategori: '',
  namaKegiatan: '',
  deskripsi: '',
  status: '',
  durasi: '',
  linkBukti: ''
};

export default function useAktivitasForm(open) {

  /* ================= STATE ================= */
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formEnabled, setFormEnabled] = useState(false);
  const [pesanAbsen, setPesanAbsen] = useState('');
  const [loadingCek, setLoadingCek] = useState(false);

  /* ================= RESET SAAT MODAL BUKA ================= */
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split('T')[0];

      setForm({
        ...initialForm,
        tanggal: today
      });

      setErrors({});
      setFormEnabled(false);
      setPesanAbsen('');
      setLoadingCek(false);
    }
  }, [open]);

  /* ================= RESET MANUAL ================= */
  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];

    setForm({
      ...initialForm,
      tanggal: today
    });

    setErrors({});
    setFormEnabled(false);
    setPesanAbsen('');
    setLoadingCek(false);
  };

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: ''
  }));
};

  /* ================= RETURN ================= */
  return {
    form,
    setForm,

    errors,
    setErrors,

    formEnabled,
    setFormEnabled,

    pesanAbsen,
    setPesanAbsen,

    loadingCek,
    setLoadingCek,

    handleChange,
    resetForm 
  };
}