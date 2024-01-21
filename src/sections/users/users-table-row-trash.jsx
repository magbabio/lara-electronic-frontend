import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import AlertDialog from 'src/components/AlertDialog';
import LoadingBackdrop from 'src/utils/loading';
import { activateUserRequest } from 'src/services/user/userAPI';
import DescriptionAlert from 'src/utils/alert';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UsersTableRowTrash({
  selected,
  id,
  deleted_at,
  document_type,
  document_number,
  first_name,
  last_name,
  email,
  role,
  handleClick,
}) {

  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  // Selected user

  const [selectedUserDocument, setSelectedUserDocument] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
 
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

  const handleOpenActivate = () => {
    setSelectedUserDocument(id);
    setSelectedUserName(`${first_name} ${last_name}`);
    setSelectedUserEmail(email);
    setOpenAlertDialog(true);
  }

  const handleActivate = async () => {
    try {
      setOpenAlertDialog(false); 
      handleCloseMenu();
      setIsLoading(true);
      const response = await activateUserRequest(id);
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

        <TableCell>{document_type}{document_number}</TableCell>

        <TableCell>{first_name}</TableCell>

        <TableCell>{last_name}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{role}</TableCell>

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
        title="Activar usuario"
        description="¿Está seguro que desea activar el usuario?"
        name={selectedUserName}
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

UsersTableRowTrash.propTypes = {
  id: PropTypes.any,
  deleted_at: PropTypes.any,
  handleClick: PropTypes.func,
  document_type: PropTypes.string,
  document_number: PropTypes.string,
  first_name: PropTypes.string,
  selected: PropTypes.any,
  last_name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string
};