// material-ui
import Box from '@mui/material/Box';

// assets
import Logo from 'assets/images/logo.svg';

// ==============================|| AUTH BACKGROUND IMAGE ||============================== //

export default function AuthBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.08 // transparan biar tidak ganggu form
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="Logo Background"
        sx={{
          width: '60%',
          maxWidth: 500
        }}
      />
    </Box>
  );
}


