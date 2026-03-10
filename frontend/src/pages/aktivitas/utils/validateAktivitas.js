export default function validateAktivitas(form, enabled = true) {
  const errors = {};

  if (!enabled) {
    errors.global = 'Cek absen terlebih dahulu';
  }

  if (!form?.tanggal) {
    errors.tanggal = 'Tanggal wajib diisi';
  }

  if (!form?.lokasi) {
    errors.lokasi = 'Lokasi wajib dipilih';
  }

  if (!form?.kategori) {
    errors.kategori = 'Kategori wajib dipilih';
  }

  if (!form?.namaKegiatan) {
    errors.namaKegiatan = 'Nama kegiatan wajib diisi';
  }

  if (!form?.durasi) {
    errors.durasi = 'Durasi wajib diisi';
  }

  if (!form?.status) {
    errors.status = 'Status wajib dipilih';
  }

  if (!form?.linkBukti) {
    errors.linkBukti = 'Link bukti wajib diisi';
  }

  return {
    valid: Object.keys(errors).length === 0, // ✅ true jika tidak ada error
    errors
  };
}