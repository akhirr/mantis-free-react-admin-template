import { useState } from 'react';
import { Snackbar, Alert, Button, Stack } from '@mui/material';

/* ===== MAIN COMPONENT ===== */
export default function HapusAktivitasMessage({ onConfirm, activityName }) {
  const [open, setOpen] = useState(false);

  const handleDeleteClick = () => {
    setOpen(true); // tampilkan pesan konfirmasi
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm(); // panggil fungsi hapus dari parent
    setOpen(false);
  };

  return (
    <Stack direction="row" spacing={1}>
      <Button variant="contained" color="error" onClick={handleDeleteClick}>
        Hapus
      </Button>

      {/* Snackbar konfirmasi */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={handleConfirm}>
              YA
            </Button>
          }
          sx={{ width: '100%' }}
        >
          Hapus aktivitas <strong>{activityName || '-'}</strong>?
        </Alert>
      </Snackbar>
    </Stack>
  );
}