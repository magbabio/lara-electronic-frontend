// import { useState } from 'react';
import React from 'react';

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

import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function OrderForm() {

  // const [selectedDate, setSelectedDate] = useState(null);

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  const [documentType, setDocumentType] = React.useState('');

  const handleChange = (event) => {
    setDocumentType(event.target.value);
  };

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

      <Card>       
        <Grid container p={3} spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="subtitle1">
              1. Datos de la orden
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              required
              id="outlined-required"
              label="Número de orden"
              fullWidth
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
              id="outlined-disabled"
              label="Nombre"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              disabled
              required
              id="outlined-disabled"
              label="Apellido"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              disabled
              required
              id="outlined-disabled"
              label="Dirección"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              disabled
              required
              id="outlined-disabled"
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
            <Button variant="contained" sx={{ width: "100%" }} startIcon={<Iconify icon="eva:plus-fill" />}>
                Agregar equipo
            </Button>
          </Grid>
          {/* Agrega más elementos Grid para más columnas si es necesario */}
        </Grid>
      </Card>
    </Container>
  );
}
