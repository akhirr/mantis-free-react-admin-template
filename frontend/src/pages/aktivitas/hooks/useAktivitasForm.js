import { useState, useEffect } from "react";

/* ================= DEFAULT FORM ================= */
const initialForm = {
  tanggal: "",
  lokasi: "",
  kategori: "",
  namaKegiatan: "",
  deskripsi: "",
  status: "",
  durasi: "",
  linkBukti: ""
};

/* ================= GET TODAY LOCAL ================= */
const getToday = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() - offset);
  return d.toISOString().split("T")[0];
};

/* ================= GET MIN DATE (7 HARI KEBELAKANG) ================= */
const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);

  const offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() - offset);

  return d.toISOString().split("T")[0];
};

export default function useAktivitasForm(open) {

  /* ================= STATE ================= */
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formEnabled, setFormEnabled] = useState(false);
  const [pesanAbsen, setPesanAbsen] = useState("");
  const [loadingCek, setLoadingCek] = useState(false);

  const [maxDate, setMaxDate] = useState("");
  const [minDate, setMinDate] = useState("");

  /* ================= RESET SAAT MODAL BUKA ================= */
  useEffect(() => {
    if (open) {

      const today = getToday();
      const min = getMinDate();

      setForm({
        ...initialForm,
        tanggal: today
      });

      setMaxDate(today);
      setMinDate(min);

      setErrors({});
      setFormEnabled(false);
      setPesanAbsen("");
      setLoadingCek(false);
    }
  }, [open]);

  /* ================= RESET MANUAL ================= */
  const resetForm = () => {

    const today = getToday();
    const min = getMinDate();

    setForm({
      ...initialForm,
      tanggal: today
    });

    setMaxDate(today);
    setMinDate(min);

    setErrors({});
    setFormEnabled(false);
    setPesanAbsen("");
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
      [name]: ""
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

    maxDate,
    minDate,

    handleChange,
    resetForm
  };
}