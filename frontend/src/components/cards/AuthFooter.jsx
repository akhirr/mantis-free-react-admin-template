// material-ui
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <Container maxWidth="xl">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, justifyContent: { xs: 'center', sm: 'space-between', textAlign: { xs: 'center', sm: 'inherit' } } }}
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
    </Container>
  );
}
