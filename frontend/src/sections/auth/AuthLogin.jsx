import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// db
import axios from 'axios';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const navigate = useNavigate();

  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          nip: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          nip: Yup.string()
            .matches(/^[0-9]+$/, 'NIP harus berupa angka')
            .min(10, 'NIP minimal 10 digit')
            .max(20, 'NIP maksimal 20 digit')
            .required('NIP wajib diisi'),

          password: Yup.string()
            .required('Password wajib diisi')
            .test(
              'no-leading-trailing-whitespace',
              'Password tidak boleh diawali atau diakhiri spasi',
              (value) => value === value?.trim()
            )
            .max(50, 'Password maksimal 50 karakter')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            setSubmitting(true);

            // URL API (bisa dari .env kalau ada)
            const API_URL =
              import.meta.env.VITE_API_URL || 'http://localhost:5000';

            // Request ke backend
            const response = await axios.post(
              `${API_URL}/api/auth/login`,
              {
                nip: values.nip,
                password: values.password
              },
              {
                timeout: 10000,
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            // Validasi response
            if (!response.data?.token) {
              throw new Error('Token tidak ditemukan');
            }

            const { token, user } = response.data;

            // Simpan login
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set default header axios
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${token}`;

            // Redirect
            navigate('/dashboard/default');

          } catch (error) {
            console.error('Login Error:', error);

            let message = 'Login gagal. Periksa NIP dan Password.';

            // Error dari backend
            if (error.response?.data?.message) {
              message = error.response.data.message;
            }

            // Server mati / timeout
            if (error.code === 'ECONNABORTED') {
              message = 'Koneksi ke server timeout';
            }

            if (!error.response) {
              message = 'Server tidak terhubung';
            }

            setErrors({
              submit: message
            });

          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              {/* ================= NIP ================= */}
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="nip-login">NIP</InputLabel>

                  <OutlinedInput
                    id="nip-login"
                    type="text"
                    value={values.nip}
                    name="nip"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Masukkan NIP"
                    fullWidth
                    error={Boolean(touched.nip && errors.nip)}
                  />
                </Stack>

                {touched.nip && errors.nip && (
                  <FormHelperText error id="helper-text-nip-login">
                    {errors.nip}
                  </FormHelperText>
                )}
              </Grid>

              {/* ================= PASSWORD ================= */}
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>

                  <OutlinedInput
                    fullWidth
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.password && errors.password)}
                    placeholder="Masukkan Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Stack>

                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

               {/* ================= ERROR SUBMIT ================= */}
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>
                    {errors.submit}
                  </FormHelperText>
                </Grid>
              )}

              {/* ================= BUTTON ================= */}
              <Grid size={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </Button>
                </AnimateButton>
 
              </Grid>

            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = {
  isDemo: PropTypes.bool
};
