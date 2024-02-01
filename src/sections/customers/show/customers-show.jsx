import 'dayjs/locale/es';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// import Backdrop from '@mui/material/Backdrop'
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import CircularProgress from '@mui/material/CircularProgress'

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';

import { getCustomerRequest } from 'src/services/customer/customerAPI';

import Iconify from 'src/components/iconify';

export default function CustomerShow() {

  const navigate = useNavigate();

  const params = useParams();

  const { setValue, control } = useForm({
    defaultValues: {
      document_type: "",
      document_number: "",
      first_name: "",
      last_name: "",
      address: "",
      phone: "", 
      email: "",
      notes: "" 
    },
  });

  // const [errors, setErrors] = useState({});

  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Description alert

  const [errorMessage, setErrorMessage] = useState('');

  // Load customer

  useEffect(() => {
    const loadCustomer = async () => {
      if (params.id) {
        try {
          setIsLoading(true); 
          const response = await getCustomerRequest(params.id);
          setValue('document_type', response.data.Data.document_type);
          setValue('document_number', response.data.Data.document_number);
          setValue('first_name', response.data.Data.first_name);
          setValue('last_name', response.data.Data.last_name);
          setValue('address', response.data.Data.address);
          setValue('phone', response.data.Data.phone);
          setValue('email', response.data.Data.email);
          setValue('notes', response.data.Data.notes);
        } catch (error) {
          const message = error.response.data.Message;
          setErrorMessage(message);
        } finally {
          setIsLoading(false); 
        }
      }
    };
  
    loadCustomer();
  }, [params.id, setValue]); 

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Detalles del cliente</Typography>

        <Stack direction="row" spacing={2} alignItems="center" mr={-1}>

          <Button 
          variant="contained"
          color="inherit" 
          startIcon={<Iconify icon="ph:list-fill" />}
          onClick={() => navigate("/clientes")}
          >
            Listado
          </Button>
        </Stack>
      </Stack>

      {errorMessage && (
        <DescriptionAlert severity="error" title="Error" description={errorMessage} />
      )}
      <LoadingBackdrop isLoading={isLoading} />

        <Card>       
          <Grid container p={3} spacing={2}>    
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                Datos del cliente
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="document_type"
                control={control}
                defaultValue="" 
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Tipo de documento del cliente"
                    id="document_type"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="document_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Número de documento del cliente"
                    id="document_number"
                  />
                )}
              />
            </Grid> 

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="first_name"
                control={control}
                defaultValue="" 
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Nombre"
                    id="first_name"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="last_name"
                control={control}
                defaultValue="" 
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Apellido"
                    id="last_name"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Controller
                disabled
                name="address"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Dirección"
                    id="address"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="phone"
                control={control}
                defaultValue="" 
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Teléfono"
                    id="phone"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Correo electrónico"
                    id="email"
                  />
                )}
              />
            </Grid> 

            <Grid item xs={12} sm={12} md={12}>
              <Controller
                disabled
                name="notes"
                control={control}
                defaultValue="" 
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Notas"
                    id="notes"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>               

          </Grid>        
        </Card>       
    </Container>
  );
}
