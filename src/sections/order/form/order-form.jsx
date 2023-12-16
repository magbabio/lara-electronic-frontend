// import { useState } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function OrderForm() {

  // const [selectedDate, setSelectedDate] = useState(null);

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
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

      <Card>
        <Grid container spacing={3} p={3}>
          <Grid item xs={12} md={6} sm={6}>
            <TextField
            required
            id="outlined-required"
            label="Número de orden"
            />
          </Grid>
          <Grid item xs={12} md={6} sm={6}>
            {/* Elementos del formulario para la segunda columna */}
          </Grid>
          {/* Agrega más elementos Grid para más columnas si es necesario */}
        </Grid>
      </Card>
    </Container>
  );
}
