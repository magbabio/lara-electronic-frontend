import 'dayjs/locale/es';
import dayjs from 'dayjs';
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
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';
import { OrderNumber, DocumentNumber } from 'src/utils/masks';
import { 
        valReceiptDate
} from 'src/utils/validations/orderSchema';

import { getUsersRequest } from 'src/services/user/userAPI';
import { getCustomerByDocumentRequest } from 'src/services/customer/customerAPI';
import { getOrderRequest, createOrderRequest, updateOrderRequest } from 'src/services/order/orderAPI';

import Iconify from 'src/components/iconify';
import AlertDialog from 'src/components/AlertDialog';

export default function OrderForm() {

  const navigate = useNavigate();

  const params = useParams();

  const { register, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      order_status: 1,
      user_id: 1,
    },
  });
  
  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Description alert

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

    // Load order

  useEffect(() => {
    const loadOrder = async () => {
      if (params.id) {
        try {
          setIsLoading(true); 
          const response = await getOrderRequest(params.id);
          const convertedDate = dayjs(response.data.Data.receipt_date).format('DD/MM/YYYY');
          setValue('receipt_date',convertedDate)
          setValue('number', response.data.Data.number);
          setValue('user_id', response.data.Data.User.id);
          setValue('order_status', response.data.Data.order_status);
          setValue('observations', response.data.Data.observations);
          setDocumentType(response.data.Data.Customer.document_type);
          setDocumentNumber(response.data.Data.Customer.document_number);
          setValue('first_name', response.data.Data.Customer.first_name);
          setValue('last_name', response.data.Data.Customer.last_name);
          setValue('address', response.data.Data.Customer.address);
          setValue('phone', response.data.Data.Customer.phone);
          setValue('email', response.data.Data.Customer.email);
          const equipmentData = response.data.Data.Equipment;
          const newEquipment = equipmentData.map((item, index) => ({
            key: index + 1,
            description: item.description,
            brand: item.brand,
            model: item.model,
            serial: item.serial,
            repair_concept: item.repair_concept,
            equipment_status: item.equipment_status,
            observations: item.observations,
            arrived_image: null
          }));
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

  // Show list of users for 'Received by'

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true); 
        const response = await getUsersRequest();
        setUsers(response.data.Data);
      } catch (error) {
        const message = error.response.data.Message;
        setErrorMessage(message);
      } finally {
        setIsLoading(false); 
      }
    };

    getUsers();
  }, []);

  // Search customer

  const [document_type, setDocumentType] = useState('');
  const [document_number, setDocumentNumber] = useState('');
  const [showCustomerFields, setShowCustomerFields] = useState(false);

  const handleSearchClick = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage(''); 
    try {
      const response = await getCustomerByDocumentRequest(document_type, document_number);
      setValue('customer_id', response.data.Data.id);
      setValue('first_name', response.data.Data.first_name);
      setValue('last_name', response.data.Data.last_name);
      setValue('address', response.data.Data.address);
      setValue('phone', response.data.Data.phone);
      setValue('email', response.data.Data.email);
      setShowCustomerFields(true);
    } catch (error) {
      const message = error.response.data.Message;
      setErrorMessage(message);
    } finally {
        setIsLoading(false);
    }
  };

  // Errors

  const [errors, setErrors] = useState({});

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

  // Dropzone methods

  // const onDrop = useCallback(acceptedFiles => {
  //   console.log(acceptedFiles[0]);
  //   // Do something with the files
  // }, [])
  // const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({onDrop})


  // Submit data methods

  const onSubmit = handleSubmit(async (data) => {

    setErrorMessage('');
    setSuccessMessage(''); 

    // const orderNumberError = valOrderNumber(data.number);
    // const receiptDateError = valReceiptDate(data.receipt_date);
    // const documentNumberError = valDocumentNumber(data.document_number);

    // if ( orderNumberError, 
    //   receiptDateError, 
    //   documentNumberError 
    //   ) {
    //   setErrors({
    //     number: orderNumberError,
    //     receipt_date: receiptDateError,
    //     document_number: documentNumberError
    //   });
    //   return; 
    // }

    data.equipment = equipment;
    data.company_id = 1; // Esto hay que cambiarlo después idk

    if (params.id) {
      const formattedDate = dayjs(data.receipt_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      data.receipt_date = formattedDate;
      try {
        setIsLoading(true);
        const response = await updateOrderRequest(params.id,data);
        const responseData = response.data;
        const message = responseData.Message;
        setSuccessMessage(message);
        setTimeout(() => {
          navigate('/servicios');
        }, 2000);
      } catch (error) {
        const message = error.response.data.Message;
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    } else {
      const formattedDate = dayjs(data.receipt_date).format("YYYY-MM-DD");
      data.receipt_date = formattedDate;
      try {
        setIsLoading(true);
        const response = await createOrderRequest(data);
        const responseData = response.data;
        const message = responseData.Message;
        setSuccessMessage(message);
        setTimeout(() => {
          navigate('/servicios');
        }, 2000);
      } catch (error) {
        console.log(error);
        const message = error.response.data.Message;
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }
  
    // const formData = new FormData();
    // formData.append("file", acceptedFiles[0]); 
    // formData.append("data", JSON.stringify(data));
  });

  useEffect(() => {
    setShowCustomerFields(false);
  }, [document_type, document_number])

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{params.id ? "Editar orden de servicio" : "Registrar orden de servicio"}</Typography>

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

      <form onSubmit={onSubmit} > 
        <Card>       
          <Grid container p={3} spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                1. Datos de la orden
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es" dateLibInstance={dayjs}>
                <Controller
                  name="receipt_date"
                  control={control}
                  defaultValue={null}
                  rules={{ validate: valReceiptDate }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      slotProps={{ textField: { fullWidth: true } }}
                      disableFuture
                      label="Fecha de recepción"
                      value={params.id ? dayjs(field.value || null, "DD/MM/YYYY") : field.value || null}
                      onChange={(date) => field.onChange(date)}
                      format="DD/MM/YYYY"
                      inputFormat="DD/MM/YYYY"
                      renderInput={(inputParams) => <TextField {...inputParams} />} // Asignar el valor convertido al campo de entrada                    
                      error={!!errors.receipt_date}
                      helperText={errors.receipt_date?.message}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Recibido por</InputLabel>
              <Controller
                control={control}
                name="user_id"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Recibido por"
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.first_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Estado de la orden</InputLabel>
              <Controller
                control={control}
                name="order_status"
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Estado de la orden"
                  >
                    <MenuItem value={1}>En proceso</MenuItem>
                    <MenuItem value={2}>Completada</MenuItem>
                    <MenuItem value={3}>Anulada</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Controller
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
                      {...register("document_type")}
                      value={document_type} 
                      onChange={(e) => setDocumentType(e.target.value)}
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
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Número de documento del cliente"
                    id="document_number"
                    value={document_number}
                    InputProps={{
                      inputComponent: DocumentNumber
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setDocumentNumber(e.target.value);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={2} md={2}>
              <Grid container display="flex" justifyContent="center" alignItems="center">
                <Button 
                  variant="contained" 
                  sx={{ width: "100%" }} 
                  startIcon={<Iconify icon="eva:search-fill" />}
                  onClick={handleSearchClick}
                >
                  Buscar cliente
                </Button>
              </Grid>
            </Grid>

            {showCustomerFields && (
            <>
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
            <Grid item xs={12} sm={12} md={12}>
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
                    {...register("email")}
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
            </>
            )}

            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1">
                3. Datos del servicio
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
                  label="Equipo"
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
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    label="Falla del equipo"
                    fullWidth
                    value={item.repair_concept}
                    onChange={(e) => handleInputChange(index, 'repair_concept', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id={`demo-simple-select-label-${index}`}>Estado del equipo</InputLabel>
                    <Select
                      labelId={`demo-simple-select-label-${index}`}
                      id={`demo-simple-select-${index}`}
                      label="Estado del equipo"
                      value={item.equipment_status}
                      onChange={(e) => handleInputChange(index, 'equipment_status', e.target.value)}
                    >
                      <MenuItem value={1}>Por reparar</MenuItem>
                      <MenuItem value={2}>Falta de insumos</MenuItem>  {/* Disponible sólo al editar (que exista params.id) */}
                      <MenuItem value={3}>Reparada</MenuItem> {/* Disponible sólo al editar (que exista params.id) */}
                    </Select>
                  </FormControl>
                </Grid>

                {/* {params.id && (
                <>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    label="Costo de reparación"
                    fullWidth
                    value={item.repair_cost}
                    onChange={(e) => handleInputChange(index, 'repair_cost', e.target.value)}
                  />
                </Grid>    
                        
                </>
                )} */}

                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    required
                    label="Observaciones del equipo"
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

            <Grid item xs={12} sm={12} md={12}>
              <Divider/>
            </Grid> 

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
                <Button variant="contained" color="primary" startIcon={params.id ? <Iconify icon="eva:edit-fill" /> : <Iconify icon="eva:plus-fill" />} type="submit">
                {params.id ? "Editar orden de servicio" : "Registrar orden de servicio"}
                </Button>
              </Box>
            </Grid>         
          </Grid>        
        </Card>
      </form>
    </Container>
  );
}
