import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';
import { valEmail } from 'src/utils/validations/userSchema';

import { bgGradient } from 'src/theme/css';
import { useAuth } from 'src/context/AuthContext';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const { signin, isAuthenticated } = useAuth();

  const [errors, setErrors] = useState({});

  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Description alert
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage('');
    setSuccessMessage(''); 
    const emailError = valEmail(data.email);
    if ( emailError ) {
      setErrors({
        email: emailError
      });
      return; 
    }
    try {
      setIsLoading(true);
      const response = await signin(data);
      console.log(response);
    } catch (error) {
      const message = error.response.data.Message;
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  });

  const renderForm = (
    <>    
      <form onSubmit={onSubmit} > 
      <LoadingBackdrop isLoading={isLoading} />        
      <Stack spacing={3}>
        <TextField 
          name="email" 
          label="Correo electrónico"
          {...register("email")} 
          error={!!errors.email} 
          helperText={errors.email} 
        />

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
          {...register("password")} 
        />
      </Stack>     

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        {/* <Link variant="subtitle2" underline="hover">
          Olvidó su contraseña?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
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
        minHeight: '100vh', // Cambia 'height' a 'minHeight'
        position: 'relative', // Añade position: 'relative' para que el DescriptionAlert esté contenido dentro del Box
        display: 'flex', // Añade display: 'flex' para centrar verticalmente el contenido
        justifyContent: 'center', // Centra verticalmente el contenido
        alignItems: 'center', 
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
            width: '100%',
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Iniciar sesión</Typography>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Bienvenido a Lara Electrónica
          </Typography>

          <Divider sx={{ my: 3 }}/>
        
          {renderForm}
                  {successMessage && (
        <DescriptionAlert severity="success" title="Éxito" description={successMessage} />
      )}
      {errorMessage && (
        <DescriptionAlert severity="error" title="Error" description={errorMessage} />
      )} 
        </Card>       
      </Stack>
    </Box>
  );
}
