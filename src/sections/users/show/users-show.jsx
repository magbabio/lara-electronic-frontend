import 'dayjs/locale/es';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';

import { getUserRequest } from 'src/services/user/userAPI';

import Iconify from 'src/components/iconify';

export default function UserShow() {

  const navigate = useNavigate();

  const params = useParams();

  const { setValue, control } = useForm({
    defaultValues: {
      document_type: "",
      document_number: "",
      first_name: "",
      last_name: "",
      phone: "", 
      email: "",
      role: "",   
    },
  });

  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Messages

  const [errorMessage, setErrorMessage] = useState('');

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
      } else {
        setErrorMessage('Ha ocurrido un error');
      }
    };
  
    loadUser();
  }, [params.id, setValue]); 

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Detalles del usuario</Typography>

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

      {errorMessage && (
        <DescriptionAlert severity="error" title="Error" description={errorMessage} />
      )}
       
      <LoadingBackdrop isLoading={isLoading} />

        <Card>       
          <Grid container p={3} spacing={2}>    
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                Datos del usuario
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="document_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Tipo de documento del usuario"
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
                    label="Número de documento del usuario"
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
                defaultValue="" // Agrega un valor por defecto para el campo de nombre
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
                defaultValue="" // Agrega un valor por defecto para el campo de apellido
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

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
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
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
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
                  />
                )}
              />
            </Grid> 
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Rol"
                    id="role"
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
