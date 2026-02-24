// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between', p: '24px 16px 0px', mt: 'auto' }}
    >
      <Typography variant="caption">
        &copy; {new Date().getFullYear()} All rights reserved{' '}
        <Link
          href="https://bkpsdm.padangsidimpuankota.go.id/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          BKPSDM Kota Padangsidimpuan
        </Link>
      </Typography>

     
    </Stack>
  );
}