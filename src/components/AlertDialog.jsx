import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export default function AlertDialog({ openAlertDialog, onClose, onActionClick, title, description, name, action }) {
  const handleClose = () => {
    onClose();
  };

  return (
      <Dialog
        open={openAlertDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
        <DialogContentText id="alert-dialog-name" sx={{ fontWeight: 'bold' }}>
          {name}
        </DialogContentText>
      </DialogContent>
      <Divider />
      <Grid sx={{ p: 1 }}>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={onActionClick} autoFocus>
            {action}
          </Button>
        </DialogActions>
      </Grid>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  openAlertDialog: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onActionClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};