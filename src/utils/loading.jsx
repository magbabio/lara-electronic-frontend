import React from 'react';
import PropTypes from 'prop-types';

import { Backdrop, CircularProgress } from '@mui/material';

const LoadingBackdrop = ({ isLoading }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={isLoading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

LoadingBackdrop.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default LoadingBackdrop;