import { Chip } from '@mui/material';

export default function StatusBadge({ status }) {
  if (!status) return null;

  // Normalisasi (aman kalau backend/frontend beda format)
  const value = String(status).toLowerCase();

  const isFinal = value === 'final';

  // Label untuk UI
  const label = isFinal ? 'Final' : 'Draft';

  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        borderRadius: 1,
        color: isFinal ? 'success.main' : 'warning.main',
        borderColor: isFinal ? 'success.main' : 'warning.main',
        backgroundColor: isFinal
          ? 'rgba(76,175,80,0.1)'
          : 'rgba(255,152,0,0.1)'
      }}
    />
  );
}

