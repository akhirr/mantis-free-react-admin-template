import { useState } from "react";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack
} from "@mui/material";

import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function HapusAktivitasMessage({ onConfirm, activityName }) {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  };

  return (
    <>
      {/* tombol hapus */}
      <Button
        size="small"
        variant="contained"
        color="error"
        onClick={handleOpen}
      >
        Hapus
      </Button>

      {/* modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Konfirmasi Hapus
        </DialogTitle>

        <DialogContent>

          <Stack direction="row" spacing={2} alignItems="center">

            <ExclamationCircleOutlined
              style={{
                fontSize: 26,
                color: "#faad14"
              }}
            />

            <Typography variant="body2">
              Apakah Anda yakin ingin menghapus aktivitas
              <strong> {activityName || "-"} </strong> ?
            </Typography>

          </Stack>

        </DialogContent>

        <DialogActions>

          <Button onClick={handleClose} variant="outlined">
            Batal
          </Button>
          
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
          >
            Hapus
          </Button>

        </DialogActions>

      </Dialog>
    </>
  );
}

HapusAktivitasMessage.propTypes = {
  onConfirm: PropTypes.func,
  activityName: PropTypes.string
};