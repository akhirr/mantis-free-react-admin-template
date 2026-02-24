
import React from 'react';
import { Box, Typography } from '@mui/material';
import Logo from '../../assets/images/logo.svg'; // path relatif


export default function LogoMain() {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <img
        src={Logo}
        alt="Logo BKPSDM Kota Padangsidimpuan"
        height={32}
      />
      <Typography
        variant="subtitle1"
        fontWeight={600}
        color="text.primary"
        noWrap
      >
        e-Kinerja
      </Typography>
    </Box>
  );
}


