import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

// project imports
import MainCard from 'components/MainCard';

// icons
import FundOutlined from '@ant-design/icons/FundOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import UpOutlined from '@ant-design/icons/UpOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';

/* ==============================|| SMALL ITEM ||============================== */
function ListItem({ text }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <CheckOutlined style={{ color: '#2e7d32', fontSize: 13 }} />
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}

ListItem.propTypes = {
  text: PropTypes.string.isRequired
};

/* ==============================|| PROGRESS BLOCK ||============================== */
function ProgressBlock({ title, value, color, tooltip, children }) {
  return (
    <Stack spacing={1}>
      <Tooltip title={tooltip} arrow>
        <Box>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" fontWeight={600}>
              {title}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {value}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={value}
            color={color}
            sx={{ height: 6, borderRadius: 5 }}
          />
        </Box>
      </Tooltip>

      {children}
    </Stack>
  );
}

ProgressBlock.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['success', 'info', 'primary']),
  tooltip: PropTypes.string.isRequired,
  children: PropTypes.node
};

/* ==============================|| MAIN KPI CARD ||============================== */
export default function TPPKPIExpandable() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const trendUp = true; // ← nanti dari API

  return (
    <MainCard
      sx={{ cursor: 'pointer' }}
      onClick={() => setOpen((prev) => !prev)}
    >
      <Stack spacing={1.5}>
        {/* ================= HEADER ================= */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <FundOutlined style={{ color: theme.palette.primary.main }} />
            <Typography variant="subtitle2" color="text.secondary">
              Estimasi TPP
            </Typography>
          </Stack>

          <IconButton size="small">
            {open ? <UpOutlined /> : <DownOutlined />}
          </IconButton>
        </Stack>

        {/* ================= VALUE ================= */}
        <Typography variant="h4" fontWeight={700}>
          Rp. 890.000,-
        </Typography>

        {/* ================= TREND ================= */}
        <Stack direction="row" spacing={1} alignItems="center">
          {trendUp ? (
            <RiseOutlined style={{ color: theme.palette.success.main }} />
          ) : (
            <FallOutlined style={{ color: theme.palette.error.main }} />
          )}
          <Typography
            variant="body2"
            color={trendUp ? 'success.main' : 'error.main'}
            fontWeight={600}
          >
            {trendUp ? '+12%' : '-8%'} dibanding bulan lalu
          </Typography>
        </Stack>

        {/* ================= TOTAL PROGRESS ================= */}
        <Tooltip title="Akumulasi kehadiran dan kinerja" arrow>
          <Box>
            <LinearProgress
              variant="determinate"
              value={88}
              sx={{
                height: 7,
                borderRadius: 5,
                bgcolor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.primary.main
                }
              }}
            />
          </Box>
        </Tooltip>

        {/* ================= EXPANDABLE ================= */}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 1.5 }} />

          <Stack spacing={2}>
            {/* Kehadiran */}
            <ProgressBlock
              title="Kehadiran (40%)"
              value={85}
              color="success"
              tooltip="20 dari 23 hari kerja. 2 kali telat / tidak absen."
            >
              <ListItem text="Hari Kerja : 20 / 23" />
              <ListItem text="Telat / tidak absen : 2" />
              <Typography variant="caption" color="success.main">
                Kontribusi ke TPP : 34%
              </Typography>
            </ProgressBlock>

            {/* Kinerja */}
            <ProgressBlock
              title="Kinerja (60%)"
              value={90}
              color="info"
              tooltip="18 hari memiliki aktivitas valid."
            >
              <ListItem text="Hari dengan aktivitas : 18 / 23" />
              <ListItem text="Hari tanpa aktivitas : 5" />
              <Typography variant="caption" color="success.main">
                Kontribusi ke TPP : 54%
              </Typography>
            </ProgressBlock>
          </Stack>
        </Collapse>
      </Stack>
    </MainCard>
  );
}
