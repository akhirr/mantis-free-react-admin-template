// material-ui
import { useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // ================== Ambil waktu WIB (GMT+7) ==================
  const greeting = useMemo(() => {
    const now = new Date();

    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wibTime = new Date(utc + 7 * 60 * 60 * 1000);

    const hour = wibTime.getHours();

    if (hour >= 4 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }, []);

  return (
    <>
      {/* Search */}
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* Notification */}
      <Notification />

      {/* Greeting */}
      {!downLG && (
        <Box sx={{ mx: 2 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.primary"
            noWrap
          >
            {greeting} 👋
          </Typography>
        </Box>
      )}

      {/* Profile */}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}

