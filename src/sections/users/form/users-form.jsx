import 'dayjs/locale/es';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment';

import { OnlyNumber } from 'src/utils/masks';

import Iconify from 'src/components/iconify';

export default function UserForm() {

  const navigate = useNavigate();

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      document_type: "",
      document_number: "",
      customer_id: "",
      first_name: "",
      last_name: "",
      phone: "", 
      email: "",
      password: "",
      role: "",   
    },
  });

  // const [errors, setErrors] = useState({});

  // Password methods

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  // Submit data methods

  const onSubmit = handleSubmit((data) => {
    console.log(data);

    // const orderNumberError = valOrderNumber(data.number);
    // const receiptDateError = valReceiptDate(data.receipt_date);

    // if ( orderNumberError ) {
    //   setErrors({
    //     number: orderNumberError,
    //     receipt_date: receiptDateError,
    //   });
    //   return; 
    // }

    // const formattedDate = dayjs(data.receipt_date).format("YYYY-MM-DD");
    // console.log(data, formattedDate);
  
    // const formData = new FormData();
    // formData.append("file", acceptedFiles[0]); 
    // formData.append("data", JSON.stringify(data));
  });

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Registrar usuario</Typography>

        <Stack direction="row" spacing={2} alignItems="center" mr={-1}>

          <Button 
          variant="contained"
          color="inherit" 
          startIcon={<Iconify icon="ph:list-fill" />}
          onClick={() => navigate("/servicios")}
          >
            Listado
          </Button>
        </Stack>
      </Stack>

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
                  />
                )}
              />
            </Grid>         
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                id="first_name"
                label="Nombre"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                id="last_name"
                label="Apellido"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                id="address"
                label="Dirección"
                fullWidth
              />
            </Grid>          
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                id="phone"
                label="Teléfono"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                id="email"
                label="Correo electrónico"
                fullWidth
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
                      <MenuItem value="1">Admin</MenuItem>
                      <MenuItem value="2">User</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>    
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                id="password"
                label="Contraseña"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <Iconify icon="ic:baseline-visibility-off" /> : <Iconify icon="ic:baseline-visibility" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                id="confirm_password"
                label="Repetir contraseña"
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? <Iconify icon="ic:baseline-visibility-off" /> : <Iconify icon="ic:baseline-visibility" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>                     
            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>               
            <Grid item xs={12} sm={12} md={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:plus-fill" />} type="submit">
                  Registrar usuario
                </Button>
              </Box>
            </Grid>         
          </Grid>        
        </Card>
      </form>
    </Container>
  );
}
