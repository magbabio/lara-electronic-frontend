import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import DescriptionAlert from 'src/utils/alert';
import LoadingBackdrop from 'src/utils/loading';

import { searchCustomerByName } from 'src/services/customer/customerAPI';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CustomersTableToolbar({ numSelected, onSearchResults, onSearchTerm }) {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  const handleSearch = async (event) => {
    setErrorMessage('');
    const { value } = event.target;
    setSearchTerm(value);
    onSearchTerm(value);
    try {
      setIsLoading(true);
        const response = await searchCustomerByName(value);
        const formattedCustomers = response.data.Data.map((customer) => ({
          ...customer,
          created_at: formatDate(customer.created_at), 
          updated_at: formatDate(customer.updated_at),
        }));
        setSearchResults(formattedCustomers);
        onSearchResults(formattedCustomers);
    } catch (error) {
      const message = error.response.data.Message;
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults([]); 
      onSearchResults([]);
    }
  }, [searchTerm, onSearchResults]);

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} seleccionados
        </Typography>
      ) : (
        <OutlinedInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar cliente..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}
      {errorMessage && (
        <DescriptionAlert severity="error" title="Error" description={errorMessage} />
      )}
      <LoadingBackdrop isLoading={isLoading} />
    </Toolbar>
  );
}

CustomersTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  onSearchResults: PropTypes.func,
  onSearchTerm: PropTypes.string
};
