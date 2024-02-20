import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';

import { getUsersRequest } from 'src/services/user/userAPI';
import { activateOrderRequest } from 'src/services/order/orderAPI';
import { getCustomersRequest } from 'src/services/customer/customerAPI';

import Iconify from 'src/components/iconify';
import AlertDialog from 'src/components/AlertDialog';

// ----------------------------------------------------------------------

export default function OrdersTableRowTrash({
  selected,
  id,
  deleted_at,
  number,
  customer_id,
  receipt_date,
  user_id,
  order_status,
  handleClick,
}) {

  const [open, setOpen] = useState(null);

  
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');

  const [userFirstName, setUserFirstName] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customers = await getCustomersRequest(); // Obtén los datos de todos los clientes
        const customer = customers.data.Data.find((customer) => customer.id === customer_id); // Busca el cliente correspondiente por id
        if (customer) {
          setCustomerFirstName(customer.first_name);
          setCustomerLastName(customer.last_name);
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
        const user = users.data.Data.find((user) => user.id === user_id); // Busca el cliente correspondiente por id
        if (user) {
          setUserFirstName(user.first_name);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [user_id]);

  // Selected customer

  const [selectedOrderNumber, setSelectedOrderNumber] = useState('');
 
  // Messages

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Delete customer

  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenActivate = () => {
    setSelectedOrderNumber(number);
    setOpenAlertDialog(true);
  }

  const handleActivate = async () => {
    try {
      setOpenAlertDialog(false); 
      handleCloseMenu();
      setIsLoading(true);
      const response = await activateOrderRequest(id);
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

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{deleted_at}</TableCell>

        <TableCell>{number}</TableCell>

        <TableCell>{customerFirstName} {customerLastName}</TableCell>

        <TableCell>{receipt_date}</TableCell>

        <TableCell>{userFirstName}</TableCell>

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
        <MenuItem onClick={handleOpenActivate} sx={{ color: 'success.main' }}>
          <Iconify icon="eva:checkmark-circle-2-outline" sx={{ mr: 2 }} />
          Activar
        </MenuItem>
      </Popover>
      <AlertDialog 
        openAlertDialog={openAlertDialog} 
        onClose={() => setOpenAlertDialog(false)} 
        onActionClick={handleActivate} 
        title="Activar orden"
        description="¿Está seguro que desea activar la orden?"
        name={selectedOrderNumber}
        action="Activar"                  
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

OrdersTableRowTrash.propTypes = {
  id: PropTypes.any,
  deleted_at: PropTypes.any,
  handleClick: PropTypes.func,
  number: PropTypes.string,
  customer_id: PropTypes.string,
  user_id: PropTypes.string,
  receipt_date: PropTypes.string,
  order_status: PropTypes.any,
  selected: PropTypes.any,
};