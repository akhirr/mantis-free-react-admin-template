import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Stack,
  Typography,
  Chip,
  Box,
  Link
} from '@mui/material';

/* ===== STATUS BADGE ===== */
function StatusBadge({ value }) {
  const statusMap = {
    SELESAI: { label: 'Selesai', color: 'success' },
    PROSES: { label: 'Proses', color: 'warning' },
    PENDING: { label: 'Pending', color: 'default' }
  };

  const status = statusMap[value] || { label: value || '-', color: 'default' };
  return <Chip label={status.label} color={status.color} size="small" />;
}

StatusBadge.propTypes = { value: PropTypes.string };

/* ===== INFO ITEM ===== */
function InfoItem({ label, value, bold }) {
  return (
    <Stack spacing={0.2} sx={{ minWidth: 140 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={bold ? 600 : 500}>{value || '-'}</Typography>
    </Stack>
  );
}

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  bold: PropTypes.bool
};

/* ===== MAIN COMPONENT ===== */
export default function DetailAktivitasModal({ open, onClose, data }) {
  const isImage = data?.link_bukti && /\.(jpg|jpeg|png|webp)$/i.test(data.link_bukti);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* ===== HEADER ===== */}
      <DialogTitle sx={{ fontWeight: 600, fontSize: 18 }}>
        Detail Aktivitas
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50', pt: 1 }}>
        {!data ? (
          <Typography variant="body2" color="text.secondary">
            Tidak ada data tersedia
          </Typography>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <Stack spacing={2.5}>
              {/* ===== SUB HEADER ===== */}
              <Stack spacing={0.5}>
                <Typography variant="h6" fontWeight={700}>
                  Informasi Aktivitas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detail lengkap aktivitas yang dipilih
                </Typography>
              </Stack>

              {/* ===== INFO UTAMA ===== */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                <InfoItem label="Nama Aktivitas" value={data.nama} bold />
                <InfoItem label="Kategori" value={data.kategori} />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                <InfoItem label="Lokasi" value={data.lokasiKerja} />
                <InfoItem label="Durasi" value={data.durasi ? `${data.durasi} Jam` : '-'} />
              </Stack>

              {/* ===== STATUS ===== */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary">Status</Typography>
                <StatusBadge value={data.status} />
              </Stack>

              {/* ===== KETERANGAN ===== */}
              <Stack spacing={0.5}>
                <Typography color="text.secondary">Keterangan</Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    borderStyle: 'dashed'
                  }}
                >
                  <Typography variant="body2">{data.keterangan || '-'}</Typography>
                </Paper>
              </Stack>

              {/* ===== BUKTI ===== */}
              <Stack spacing={1}>
                <Typography color="text.secondary">Bukti</Typography>

                {!data.link_bukti ? (
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada bukti
                  </Typography>
                ) : (
                  <Stack spacing={1.2}>
                    {isImage && (
                      <Box
                        component="img"
                        src={data.link_bukti}
                        alt="bukti"
                        sx={{
                          width: '100%',
                          maxWidth: 200,
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                    )}

                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Link
                        href={data.link_bukti}
                        target="_blank"
                        underline="hover"
                        sx={{ fontSize: 13, wordBreak: 'break-all' }}
                      >
                        {data.link_bukti}
                      </Link>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Paper>
        )}
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DetailAktivitasModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object
};