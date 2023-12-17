// import { useState } from 'react';
import React, { useState } from 'react';
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
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { OnlyNumber } from 'src/utils/masks';

import Iconify from 'src/components/iconify';



// ----------------------------------------------------------------------

export default function OrderForm() {

  const { handleSubmit, control } = useForm();

  // const [selectedDate, setSelectedDate] = useState(null);

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  // Customer document type methods

  const [documentType, setDocumentType] = React.useState('');

  const handleChange = (event) => {
    setDocumentType(event.target.value);
  };

  // Order status methods

  const [orderStatus, setOrderStatus] = React.useState('');

  const handleChangeOrderStatus = (event) => {
    setOrderStatus(event.target.value);
  };

  // Submit data methods

  const onSubmit = handleSubmit( (e) => {
    e.preventDefault();
    console.log(e.target)
  })

  // Equipment methods

  const [equipment, setEquipment] = useState([
    { description: '', brand: '', model: '', serial: '', observations: '', image: null },
  ]);

  const handleAddEquipment = (e) => {
    const newEquipment = {
      key: equipment.length + 1,
      description: '',
      brand: '',
      model: '',
      serial: '',
      observations: '',
    };
    setEquipment([...equipment, newEquipment]);
  };
  
  const handleDeleteEquipment = (index) => {
    const newEquipment = [...equipment];
    newEquipment.splice(index, 1);
    setEquipment(newEquipment);
  };

  // const handleImageUpload = (file, index) => {
  //   const updatedEquipment = [...equipment];
  //   updatedEquipment[index].image = file;
  //   setEquipment(updatedEquipment);
  // };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Registrar orden de servicio</Typography>

        <Stack direction="row" spacing={2} alignItems="center" mr={-1}>

          <Button variant="contained" color="inherit" startIcon={<Iconify icon="ph:list-fill" />}>
            Listado
          </Button>
        </Stack>
      </Stack>

      <form onSubmit={onSubmit} > 
        <Card>       
          <Grid container p={3} spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                1. Datos de la orden
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Número de orden"
                  id="number"
                  value={field.value || ''}
                  InputLabelProps={{ shrink: !!field.value }}
                  InputProps={{
                    inputComponent: OnlyNumber
                  }}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            </Grid>        
            <Grid item xs={12} sm={6} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker 
                  label="Fecha de recepción" 
                  fullWidth 
                  disableFuture
                  />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                  name="received_by"
                  control={control}
                  render={({ field }) => (              
                    <TextField
                    {...field}
                    required
                    fullWidth
                    label="Recibido por"
                    id="received_by"
                    defaultValue=""
                    InputLabelProps={{ shrink: field.value }}                                                    
                    />
                  )}
              /> 
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={orderStatus}
                  label="Estado"
                  onChange={handleChangeOrderStatus}
                >
                  <MenuItem value="1">Por reparar</MenuItem>
                  <MenuItem value="2">Falta de insumos</MenuItem>
                  <MenuItem value="3">Reparada</MenuItem>                     
      
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                2. Datos del cliente
              </Typography>
            </Grid>
            <Grid item xs={12} sm={5} md={5}>
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">Tipo de documento del cliente</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={documentType}
                  label="Tipo de documento del cliente"
                  onChange={handleChange}
                >
                  <MenuItem value="J">J</MenuItem>
                  <MenuItem value="V">V</MenuItem>
                  <MenuItem value="E">E</MenuItem>                     
                  <MenuItem value="G">G</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5} md={5}>
              <TextField
                required
                id="outlined-required"
                label="Número de documento del cliente"
                fullWidth
              />
            </Grid>         
            <Grid item xs={12} sm={2} md={2}>
              <Grid container display="flex" justifyContent="center" alignItems="center">
                <Button variant="contained" sx={{ width: "100%" }} startIcon={<Iconify icon="eva:search-fill" />}>
                  Buscar cliente
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                disabled
                required
                id="outlined-required"
                label="Nombre"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                disabled
                required
                id="outlined-required"
                label="Apellido"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                disabled
                required
                id="outlined-required"
                label="Dirección"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                disabled
                required
                id="outlined-required"
                label="Teléfono"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                3. Datos del equipo
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Button 
                variant="contained" 
                sx={{ width: "100%" }} 
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleAddEquipment}
                >
                  Agregar equipo
              </Button>
            </Grid>

            {equipment.map((item, index) => (
              <Grid container p={3} spacing={2} key={index}>   
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    id="outlined-disabled"
                    label="Descripción"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    id="outlined-disabled"
                    label="Marca"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    id="outlined-disabled"
                    label="Modelo"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    id="outlined-disabled"
                    label="Serial"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    required
                    id="outlined-disabled"
                    label="Observaciones"
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  yo
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Grid container display="flex" justifyContent="center" alignItems="center">
                    <Button 
                      variant="contained" 
                      sx={{ width: "100%" }} 
                      startIcon={<Iconify icon="eva:trash-fill" />}
                      onClick={() => handleDeleteEquipment(index)}
                      >
                      Eliminar equipo
                    </Button>
                  </Grid>
                </Grid>                                                                       
              </Grid>
              ))}    
            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>                  
            <Grid item xs={12} sm={12} md={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} type="submit">
                  Registrar orden
                </Button>
              </Box>
            </Grid>         
          </Grid>
        </Card>
      </form>
    </Container>
  );
}
