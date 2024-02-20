import 'dayjs/locale/es';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
// import Backdrop from '@mui/material/Backdrop'
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
// import CircularProgress from '@mui/material/CircularProgress'

import { OnlyNumber, Phone } from 'src/utils/masks';
import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';
import { valDocumentNumber, 
        valFirstName,
        valLastName,
        valPhone,
        valEmail } from 'src/utils/validations/userSchema';

import { getUserRequest, createUserRequest, updateUserRequest } from 'src/services/user/userAPI';

import Iconify from 'src/components/iconify';

export default function UserForm() {

  const navigate = useNavigate();

  const params = useParams();

  const { register, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      document_type: "",
      document_number: "",
      first_name: "",
      last_name: "",
      phone: "", 
      email: "",
      password: "",
      confirm_password: "",
      role: "",   
    },
  });

  // const [errors, setErrors] = useState({});

  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Description alert

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [errors, setErrors] = useState({});

  // Password methods

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  // Load user

  useEffect(() => {
    const loadUser = async () => {
      if (params.id) {
        try {
          setIsLoading(true); 
          const response = await getUserRequest(params.id);
          setValue('document_type', response.data.Data.document_type);
          setValue('document_number', response.data.Data.document_number);
          setValue('first_name', response.data.Data.first_name);
          setValue('last_name', response.data.Data.last_name);
          setValue('phone', response.data.Data.phone);
          setValue('email', response.data.Data.email);
          setValue('role', response.data.Data.role);
        } catch (error) {
          const message = error.response.data.Message;
          setErrorMessage(message);
        } finally {
          setIsLoading(false); 
        }
      }
    };
  
    loadUser();
  }, [params.id, setValue]); 

  // Submit data methods
  const onSubmit = handleSubmit(async (data) => {

    setErrorMessage('');
    setSuccessMessage('');  

    const documentNumberError = valDocumentNumber(data.document_number);
    const firstNameError = valFirstName(data.first_name);
    const lastNameError = valLastName(data.last_name);
    const phoneError = valPhone(data.phone);
    const emailError = valEmail(data.email);

    if ( documentNumberError, firstNameError, lastNameError, phoneError, emailError ) {
      setErrors({
        document_number: documentNumberError,
        first_name: firstNameError,
        last_name: lastNameError,
        phone: phoneError,
        email: emailError
      });
      return; 
    }

    if (params.id) {
      try {
        setIsLoading(true);
        const response = await updateUserRequest(params.id,data);
        const responseData = response.data;
        const message = responseData.Message;
        setSuccessMessage(message);
        setTimeout(() => {
          navigate('/usuarios');
        }, 2000);
      } catch (error) {
        const message = error.response.data.Message;
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await createUserRequest(data);
        const responseData = response.data;
        const message = responseData.Message;
    
        setSuccessMessage(message);
  
        setTimeout(() => {
          navigate('/usuarios');
        }, 2000);
    
      } catch (error) {
        const message = error.response.data.Message;
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{params.id ? "Editar usuario" : "Registrar usuario"}</Typography>

        <Stack direction="row" spacing={2} alignItems="center" mr={-1}>

          <Button 
          variant="contained"
          color="inherit" 
          startIcon={<Iconify icon="ph:list-fill" />}
          onClick={() => navigate("/usuarios")}
          >
            Listado
          </Button>
        </Stack>
      </Stack>

      {successMessage && (
        <DescriptionAlert severity="success" title="Éxito" description={successMessage} />
      )}
      {errorMessage && (
        <DescriptionAlert severity="error" title="Error" description={errorMessage} />
      )}
      <LoadingBackdrop isLoading={isLoading} />

      <form onSubmit={onSubmit} > 
        <Card>       
          <Grid container p={3} spacing={2}>    
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                Datos del usuario
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">Tipo de documento del usuario</InputLabel>
                <Controller
                  control={control}
                  name="document_type"
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Tipo de documento del usuario"
                    >
                      <MenuItem value="J">J</MenuItem>
                      <MenuItem value="V">V</MenuItem>
                      <MenuItem value="E">E</MenuItem>
                      <MenuItem value="G">G</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="document_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Número de documento del usuario"
                    id="document_number"
                    value={field.value || ''}
                    // InputLabelProps={{ shrink: !!field.value }}
                    InputProps={{
                      inputComponent: OnlyNumber
                    }}
                    onChange={(e) => field.onChange(e.target.value)}
                    {...register("document_number")}
                    error={!!errors.document_number} 
                    helperText={errors.document_number} 
                  />
                )}
              />
            </Grid>         
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="first_name"
                control={control}
                defaultValue="" // Agrega un valor por defecto para el campo de nombre
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Nombre"
                    id="first_name"
                    {...register("first_name")} 
                    error={!!errors.first_name} 
                    helperText={errors.first_name} 
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="last_name"
                control={control}
                defaultValue="" // Agrega un valor por defecto para el campo de apellido
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Apellido"
                    id="last_name"
                    {...register("last_name")} 
                    error={!!errors.last_name} 
                    helperText={errors.last_name} 
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="phone"
                control={control}
                defaultValue="" // Agrega un valor por defecto para el campo de teléfono
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Teléfono"
                    id="phone"
                    InputProps={{
                      inputComponent: Phone
                    }}
                    {...register("phone")} 
                    error={!!errors.phone} 
                    helperText={errors.phone} 
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="email"
                control={control}
                defaultValue="" // Agrega un valor por defecto para el campo de correo electrónico
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Correo electrónico"
                    id="email"
                    {...register("email")} 
                    error={!!errors.email} 
                    helperText={errors.email} 
                  />
                )}
              />
            </Grid> 
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="role">Rol</InputLabel>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="role"
                      id="role"
                      label="Rol"
                    >
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="User">User</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>    
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Contraseña"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility}>
                            {showPassword ? (
                              <Iconify icon="ic:baseline-visibility-off" />
                            ) : (
                              <Iconify icon="ic:baseline-visibility" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Repetir contraseña"
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? (
                              <Iconify icon="ic:baseline-visibility-off" />
                            ) : (
                              <Iconify icon="ic:baseline-visibility" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>                      
            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>               
            <Grid item xs={12} sm={12} md={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" startIcon={params.id ? <Iconify icon="eva:edit-fill" /> : <Iconify icon="eva:plus-fill" />} type="submit">
                {params.id ? "Editar usuario" : "Registrar usuario"}
                </Button>
              </Box>
            </Grid>         
          </Grid>        
        </Card>       
      </form>
    </Container>
  );
}
