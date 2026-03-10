import { Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

export default function useNotify() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const showNotify = (msg, type = 'success') => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const NotifyComponent = (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );

  return { showNotify, NotifyComponent };
}