import { useEffect, useState } from 'react';
import Cookies from "js-cookie";

import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import { loginRequest, verifyTokenRequest } from 'src/services/authAPI';

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  
  const { register, handleSubmit, setValue, control } = useForm();

  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Description alert
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Is authenticated

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get('token');
      const isAuthenticated = Boolean(token);
  
      if (isAuthenticated) {
        try {
          const res = await verifyTokenRequest(token);
          setIsAuthenticated(Boolean(res.data.Data));
          navigate('/servicios')
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
  
    checkLogin();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage('');
    setSuccessMessage(''); 
    try {
      setIsLoading(true);
      const response = await loginRequest(data);
      const responseData = response.data;
      const message = responseData.Message;
      setSuccessMessage(message);
    } catch (error) {
      const message = error.response.data.Message;
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  });

  const handleClick = () => {
    router.push('/dashboard');
  };

  const renderForm = (
    <>
      <form onSubmit={onSubmit} > 
      <Stack spacing={3}>
        <TextField name="email" label="Correo electrónico" />

        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Olvidó su contraseña?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Iniciar sesión
      </LoadingButton>
      </form>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Iniciar sesión</Typography>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Bienvenido a Lara Electrónica
          </Typography>

          <Divider sx={{ my: 3 }}/>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
