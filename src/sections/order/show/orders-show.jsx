import 'dayjs/locale/es';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect, useCallback } from 'react';

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

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';

import { getOrderRequest } from 'src/services/order/orderAPI';

import Iconify from 'src/components/iconify';
import AlertDialog from 'src/components/AlertDialog';

export default function OrderShow() {

  const navigate = useNavigate();

  const params = useParams();

  const { register, setValue, control } = useForm({});
  
  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Description alert

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      repair_concept: "",
      equipment_status: 1,
      observations: "",
      arrived_image: null
    };
    setEquipment([...equipment, newEquipment]);
  };

  const handleInputChange = (index, field, value) => {
    if (field === 'arrived_image') {
      const newEquipment = [...equipment];
      newEquipment[index][field] = value[0];
      setEquipment(newEquipment);
    } else {
      const newEquipment = [...equipment];
      newEquipment[index][field] = value;
      setEquipment(newEquipment);
    }
  };

  const handleDeleteEquipment = (index) => {
    setOpenAlertDialog(false);
    const newEquipment = [...equipment];
    newEquipment.splice(index, 1);
    setEquipment(newEquipment);
  };

    // Load order

    const getOrderStatusText = (order_status) => {
      switch (order_status) {
        case 1:
          return 'En proceso';
        case 2:
          return 'Completada';
        case 3:
          return 'Anulada';
        default:
          return '';
      }
    };

    const getEquipmentStatusText = (equipment_status) => {
      switch (equipment_status) {
        case 1:
          return 'Por reparar';
        case 2:
          return 'Falta de insumos';
        case 3:
          return 'Reparado';
        default:
          return '';
      }
    };

    useEffect(() => {
      const loadOrder = async () => {
        if (params.id) {
          try {
            setIsLoading(true); 
            const response = await getOrderRequest(params.id);
            setValue('number', response.data.Data.number);
            const formattedDate = dayjs(response.data.Data.receipt_date).format("DD-MM-YYYY");
            setValue('receipt_date', formattedDate);
            setValue('received_by', response.data.Data.User.first_name);
            const order_status = getOrderStatusText(response.data.Data.order_status)
            setValue('order_status', order_status);
            setValue('observations', response.data.Data.observations);
            setValue('document_type', response.data.Data.Customer.document_type);
            setValue('document_number', response.data.Data.Customer.document_number);
            setValue('first_name', response.data.Data.Customer.first_name);
            setValue('last_name', response.data.Data.Customer.last_name);
            setValue('address', response.data.Data.Customer.address);
            setValue('phone', response.data.Data.Customer.phone);
            const equipmentData = response.data.Data.Equipment;
            const newEquipment = equipmentData.map((item, index) => {
              return {
                key: index + 1,
                description: item.description,
                brand: item.brand,
                model: item.model,
                serial: item.serial,
                repair_concept: item.repair_concept,
                equipment_status: getEquipmentStatusText(item.equipment_status),
                observations: item.observations,
                arrived_image: null
              };
            });
            setEquipment(newEquipment);
          } catch (error) {
            const message = error.response.data.Message;
            setErrorMessage(message);
          } finally {
            setIsLoading(false); 
          }
        }
      };
    
      loadOrder();
    }, [params.id, setValue]); 

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Detalles de orden de servicio</Typography>

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

      {successMessage && (
        <DescriptionAlert severity="success" title="Éxito" description={successMessage} />
      )}
      {errorMessage && (
        <DescriptionAlert severity="error" title="Error" description={errorMessage} />
      )}
      <LoadingBackdrop isLoading={isLoading} />      

        <Card>       
          <Grid container p={3} spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                1. Datos de la orden
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Controller
              disabled
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
                  {...register("number")}    
                />
              )}
            />
            </Grid>   

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="receipt_date"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Fecha de recepción"
                    id="receipt_date"
                    {...register("receipt_date")}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="received_by"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Recibido por"
                    id="received_by"
                    {...register("received_by")}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="order_status"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Estado de la orden"
                    id="order_status"
                    {...register("order_status")}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                2. Datos del cliente
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
                    {...register("document_type")}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <Controller
                disabled
                name="document_number"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Número de documento del cliente"
                    id="document_number"
                    {...register("document_number")}
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
                    {...register("first_name")}
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
                    {...register("last_name")}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
                    {...register("address")}
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
                    {...register("phone")}
                  />
                )}
              />
            </Grid>
            <Grid item xs={0} sm={0} md={0}>
              <Controller
                name="customer_id"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id="customer_id"
                    {...register("customer_id")}
                    hidden 
                    style={{ display: 'none' }} 
                  />
                )}
              />
            </Grid>


            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>
            
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                3. Datos del servicio
              </Typography>
            </Grid>

            {equipment.map((item, index) => (
              <Grid container px={2} py={2} spacing={2} key={index}>
                <Grid item xs={12} sm={6} md={6}>
                <TextField
                  disabled
                  required
                  label="Nombre"
                  fullWidth
                  value={item.description}
                  onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    required
                    label="Marca"
                    fullWidth
                    value={item.brand}
                    onChange={(e) => handleInputChange(index, 'brand', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    required
                    label="Modelo"
                    fullWidth
                    value={item.model}
                    onChange={(e) => handleInputChange(index, 'model', e.target.value)}                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    required
                    label="Serial"
                    fullWidth
                    value={item.serial}
                    onChange={(e) => handleInputChange(index, 'serial', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    required
                    label="Concepto de reparación"
                    fullWidth
                    value={item.repair_concept}
                    onChange={(e) => handleInputChange(index, 'repair_concept', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
                    required
                    label="Estado del equipo"
                    fullWidth
                    value={item.equipment_status}
                    onChange={(e) => handleInputChange(index, 'equipment_status', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    disabled
                    required
                    label="Observaciones"
                    fullWidth
                    multiline
                    rows={4}
                    value={item.observations}
                    onChange={(e) => handleInputChange(index, 'observations', e.target.value)}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'light', color: "#778591" }}>
                    Imagen del equipo
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                <div {...getRootProps()}
                  style={{
                    background: "transparent", 
                    padding: "20px",
                    border: "2px dashed #ccc", 
                    borderRadius: "8px", 
                    marginBottom: "16px"
                  }}
                >
                  <input {...getInputProps()} onChange={(e) => handleInputChange(index, 'arrived_image', e.target.files)} /> 
                  {isDragActive ? (
                    <p>Suelta la imagen aquí...</p>
                  ) : (
                    <p>Arrastra y suelta la imagen aquí, o haz click para seleccionar la imagen</p>
                  )}
                </div>
                {equipment[index].arrived_image && (
                  <img src={URL.createObjectURL(equipment[index].arrived_image)} alt="" 
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto", 
                      height: "auto",
                    }}
                  />
                )}
                </Grid> */}
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
              <Controller
                disabled
                multiline
                rows={4}
                name="observations"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={4}
                    required
                    fullWidth
                    label="Observaciones de la orden"
                    id="observations"
                  />
                )}
              />
            </Grid>

          </Grid>        
        </Card>
    </Container>
  );
}
