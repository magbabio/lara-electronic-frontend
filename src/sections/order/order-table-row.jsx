import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';

import { getCustomersRequest } from 'src/services/customer/customerAPI';
import { getUsersRequest } from 'src/services/user/userAPI';
import { deleteOrderRequest, sendOrderEmailRequest, generateOrderDocumentRequest } from 'src/services/order/orderAPI';

import Label from 'src/components/label/label';
import Iconify from 'src/components/iconify';
import AlertDialog from 'src/components/AlertDialog';

// ----------------------------------------------------------------------

export default function OrdersTableRow({
  selected,
  id,
  created_at,
  number,
  customer_id,
  receipt_date,
  user_id,
  order_status,
  handleClick,
}) {

  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');

  const [userFirstName, setUserFirstName] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customers = await getCustomersRequest(); // Obtén los datos de todos los clientes
        const foundCustomer = customers.data.Data.find((customer) => customer.id === customer_id); // Busca el cliente correspondiente por id
        if (foundCustomer) {
          setCustomerFirstName(foundCustomer.first_name);
          setCustomerLastName(foundCustomer.last_name);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomers();
  }, [customer_id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsersRequest(); // Obtén los datos de todos los clientes
        const foundUser = users.data.Data.find((user) => user.id === user_id); // Busca el cliente correspondiente por id
        if (foundUser) {
          setUserFirstName(foundUser.first_name);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [user_id]);

  const [selectedOrderNumber, setSelectedOrderNumber] = useState('');
 
  // Messages

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Delete user

  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openSendAlertDialog, setOpenSendAlertDialog] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDetails = () => {
    navigate(`detalles/${id}`);
  }

  const handleUpdate = () => {
    navigate(`editar/${id}`);
  }

  const handleOpenDelete = () => {
    setSelectedOrderNumber(number);
    setOpenAlertDialog(true);
  }

  const handleDelete = async () => {
    try {
      setOpenAlertDialog(false); 
      handleCloseMenu();
      setIsLoading(true);
      const response = await deleteOrderRequest(id);
      const message = response.data.Message;
      setSuccessMessage(message);
    } catch (error) {
      const message = error.response.data.Message;
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);  
  }

  const handleOrderDocument = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await generateOrderDocumentRequest(id);
      console.log('QUE PASSOOO', response);
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.click();
    } catch (error) {
      console.log('AAAAAAAAAAAAA',error.response);
      const message = error.response.statusText;
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendClick = async () => {
    setErrorMessage('');
    setSuccessMessage(''); 
    try {
      setOpenSendAlertDialog(false); 
      setIsLoading(true);
      const response = await sendOrderEmailRequest(id);
      const message = response.data.Message;
      setSuccessMessage(message);
    } catch (error) {
      const message = error.response.data.Message;
      setErrorMessage(message);   
    } finally {
      setIsLoading(false);
    }
  }

  const handleClickOpenSend = () => {
    setSelectedOrderNumber(number);
    setOpenSendAlertDialog(true);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{created_at}</TableCell>

        <TableCell>{number}</TableCell>

        <TableCell>{customerFirstName} {customerLastName}</TableCell>

        <TableCell>{receipt_date}</TableCell>

        <TableCell>{userFirstName}</TableCell>

        <TableCell>
          <Label color={(order_status === 'success' && 'error') || 'warning'}>{order_status}</Label>
        </TableCell>

        <TableCell>
          <Tooltip title="Imprimir orden" placement="top">
            <IconButton onClick={() => handleOrderDocument()} style={{ cursor: 'pointer' }}>
              <Iconify icon="material-symbols:print-outline-rounded"/>
            </IconButton>
          </Tooltip>
        </TableCell>
        
        <TableCell>
          <Tooltip title="Enviar a cliente" placement="top">
            <IconButton onClick={() => handleClickOpenSend()} style={{ cursor: 'pointer' }}>
              <Iconify icon="material-symbols:stacked-email-outline-rounded"/>
            </IconButton>
          </Tooltip>
        </TableCell>
        
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >

        <MenuItem onClick={handleDetails}>
          <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
          Detalles
        </MenuItem>

        <MenuItem onClick={handleUpdate}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={handleOpenDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Popover>

      <AlertDialog 
        openAlertDialog={openAlertDialog} 
        onClose={() => setOpenAlertDialog(false)} 
        onActionClick={handleDelete} 
        title="Eliminar usuario"
        description="¿Está seguro que desea eliminar la orden?"
        name={selectedOrderNumber}
        action="Eliminar"                  
      />
      <AlertDialog
        openAlertDialog={openSendAlertDialog}
        onClose={() => setOpenSendAlertDialog(false)}
        onActionClick={handleSendClick} 
        title="Enviar a cliente"
        description="¿Está seguro que desea enviar la orden de servicio al cliente?"
        name={`Orden de servicio N° ${selectedOrderNumber} del cliente ${customerFirstName} ${customerLastName}`}
        action="Enviar"
      />      
      {successMessage && (
        <DescriptionAlert severity="success" title="Éxito" description={successMessage} />
      )}
      {errorMessage && (
        <DescriptionAlert severity="error" title="Error" description={errorMessage} />
      )}
      <LoadingBackdrop isLoading={isLoading} />      
    </>
  );
}

OrdersTableRow.propTypes = {
  id: PropTypes.any,
  selected: PropTypes.any,
  created_at: PropTypes.any,
  handleClick: PropTypes.func,
  number: PropTypes.string,
  user_id: PropTypes.any,
  customer_id: PropTypes.string,
  receipt_date: PropTypes.string,
  order_status: PropTypes.any,
};