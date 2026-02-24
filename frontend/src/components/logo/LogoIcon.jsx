// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// assets
import Logo from '../../assets/images/logo.svg'; // path relatif

// ==============================|| LOGO ICON ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
    >
      <img
        src={Logo}
        alt="Logo BKPSDM Kota Padangsidimpuan"
        height={32}
      />

    </Box>
  );
}
