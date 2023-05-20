import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routeNames from './routeNames';
import { useFormik } from 'formik';
import { LoginCredentials, loginSchema } from '../utils/validation-rules';
import { login } from '../api-service';
import { useMutation } from 'react-query';
import { Alert } from '@mui/material';

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const {mutate, error} = useMutation<
    void,
    { message: string },
    LoginCredentials
    >(({email, password}: LoginCredentials) => login(email, password))

  const handleSubmit = async ({ email, password }: LoginCredentials) => {
    mutate({ email, password }, {
      onSuccess: () => navigate(routeNames.main)
    })
  };

  const formik = useFormik<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      navigate(routeNames.main);
    }
  }, [navigate])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error">{error.message}</Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <FormControlLabel
            control={
              <Checkbox
                value={rememberMe}
                color={'primary'}
                onChange={(_, value) => setRememberMe(value)}
              />
            }
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent={'center'}>
            <Grid item>
              <Link href={'/register'} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
export default LoginForm;
