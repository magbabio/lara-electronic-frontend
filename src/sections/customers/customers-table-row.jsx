import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';

import { deleteCustomerRequest } from 'src/services/customer/customerAPI';

import Iconify from 'src/components/iconify';
import AlertDialog from 'src/components/AlertDialog';

// ----------------------------------------------------------------------

export default function CustomersTableRow({
  selected,
  id,
  created_at,
  document_type,
  document_number,
  first_name,
  last_name,
  email,
  phone,
  handleClick,
}) {

  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  // Selected customer

  // const [selectedCustomerDocument, setSelectedCustomerDocument] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  // const [selectedCustomerEmail, setSelectedCustomerEmail] = useState('');
 
  // Messages

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Loader

  const [isLoading, setIsLoading] = useState(false);

  // Delete user

  const [openAlertDialog, setOpenAlertDialog] = useState(false);

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
    // setSelectedCustomerDocument(id);
    setSelectedCustomerName(`${first_name} ${last_name}`);
    // setSelectedCustomerEmail(email);
    setOpenAlertDialog(true);
  }

  const handleDelete = async () => {
    try {
      setOpenAlertDialog(false); 
      handleCloseMenu();
      setIsLoading(true);
      const response = await deleteCustomerRequest(id);
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

        <TableCell>{created_at}</TableCell>

        <TableCell>{document_type}{document_number}</TableCell>

        <TableCell>{first_name}</TableCell>

        <TableCell>{last_name}</TableCell>

        <TableCell>{phone}</TableCell>

        <TableCell>{email}</TableCell>
        
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
        description="¿Está seguro que desea eliminar el usuario?"
        name={selectedCustomerName}
        action="Eliminar"                  
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

CustomersTableRow.propTypes = {
  id: PropTypes.any,
  created_at: PropTypes.any,
  handleClick: PropTypes.func,
  document_type: PropTypes.string,
  document_number: PropTypes.string,
  first_name: PropTypes.string,
  selected: PropTypes.any,
  last_name: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string
};