import 'dayjs/locale/es';
import dayjs from 'dayjs';
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
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { OnlyNumber } from 'src/utils/masks';

import Iconify from 'src/components/iconify';
import AlertDialog from 'src/components/AlertDialog';

export default function OrderForm() {

  const navigate = useNavigate();

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      number: "",
      receipt_date: null,
      order_status: "1",
      received_by: "",
      document_type: "",
      document_number: "",
      customer_id: "",
      first_name: "",
      last_name: "",
      address: "",
      phone: "",     
    },
  });

  // Adding / deleting equipment methods

  const [equipment, setEquipment] = useState([]);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [selectedEquipmentIndex, setSelectedEquipmentIndex] = useState(null);
  const [selectedEquipmentDescription, setSelectedEquipmentDescription] = useState('');

  const handleClickOpen = (index, description) => {
    setSelectedEquipmentIndex(index);
    setSelectedEquipmentDescription(description);
    setOpenAlertDialog(true);
  }

  const handleAddEquipment = (e) => {
    const newEquipment = {
      key: equipment.length + 1,
      description: "",
      brand: "",
      model: "",
      serial: "",
      observations: ""
    };
    setEquipment([...equipment, newEquipment]);
  };

  const handleInputChange = (index, field, value) => {
    const newEquipment = [...equipment];
    newEquipment[index][field] = value;
    setEquipment(newEquipment);
  };

  const handleDeleteEquipment = (index) => {
    setOpenAlertDialog(false);
    const newEquipment = [...equipment];
    newEquipment.splice(index, 1);
    setEquipment(newEquipment);
  };

  // Submit data methods

  const onSubmit = handleSubmit((data) => {
    const formattedDate = dayjs(data.receipt_date).format("YYYY-MM-DD");
    console.log(data, formattedDate);
    data.equipment = equipment;
  });

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Registrar orden de servicio</Typography>

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
                  // InputLabelProps={{ shrink: !!field.value }}
                  InputProps={{
                    inputComponent: OnlyNumber
                  }}
                  onChange={(e) => field.onChange(e.target.value)}
                  {...register("number")}
                />
              )}
            />
            </Grid>        
            <Grid item xs={12} sm={6} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es" dateLibInstance={dayjs}>
                <Controller
                  name="receipt_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      slotProps={{ textField: { fullWidth: true } }}
                      disableFuture
                      label="Fecha de recepción"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                id="outlined-required"
                label="Recibido por"
                fullWidth
                {...register("received_by")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Controller
                control={control}
                name="order_status"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Estado"
                  >
                    <MenuItem value="1">Por reparar</MenuItem>
                    <MenuItem value="2">Falta de insumos</MenuItem>
                    <MenuItem value="3">Reparada</MenuItem>
                  </Select>
                )}
              />
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
                <Controller
                  control={control}
                  name="document_type"
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Tipo de documento del cliente"
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
            <Grid item xs={12} sm={5} md={5}>
              <Controller
                name="document_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Número de documento del cliente"
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
                id="first_name"
                label="Nombre"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                disabled
                required
                id="last_name"
                label="Apellido"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                disabled
                required
                id="address"
                label="Dirección"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                disabled
                required
                id="phone"
                label="Teléfono"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                3. Datos de los equipos
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={4} sx={{mb: 1}}>
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
              <Grid container px={3} py={1} spacing={2} key={index}>
                <Grid item xs={12} sm={6} md={6}>
                <TextField
                  required
                  label="Descripción"
                  fullWidth
                  value={item.description}
                  onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    label="Marca"
                    fullWidth
                    value={item.brand}
                    onChange={(e) => handleInputChange(index, 'brand', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    label="Modelo"
                    fullWidth
                    value={item.model}
                    onChange={(e) => handleInputChange(index, 'model', e.target.value)}                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    label="Serial"
                    fullWidth
                    value={item.serial}
                    onChange={(e) => handleInputChange(index, 'serial', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    required
                    label="Observaciones"
                    fullWidth
                    multiline
                    rows={4}
                    value={item.observations}
                    onChange={(e) => handleInputChange(index, 'observations', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  Aquí va el dropzone de la imagen
                </Grid>
                <Grid item xs={12} sm={2} md={4}>
                  <Grid container display="flex" justifyContent="center" alignItems="center">
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ width: "100%" }}
                    startIcon={<Iconify icon="eva:trash-fill" />}
                    onClick={() => handleClickOpen(index, item.description)}
                  >
                    Eliminar equipo
                  </Button>
                  </Grid>
                </Grid>
              </Grid>
            ))}

            <AlertDialog 
              openAlertDialog={openAlertDialog} 
              onClose={() => setOpenAlertDialog(false)} 
              onActionClick={() => handleDeleteEquipment(selectedEquipmentIndex)} 
              title="Eliminar equipo"
              description="¿Está seguro que desea eliminar el equipo?"
              name={selectedEquipmentDescription}
              action="Eliminar"                  
            />

            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>                  
            <Grid item xs={12} sm={12} md={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:plus-fill" />} type="submit">
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
