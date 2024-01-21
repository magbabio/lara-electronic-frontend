import Swal from 'sweetalert2';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function DescriptionAlert({ severity, title, description }) {
  useEffect(() => {
    Swal.fire({
      title,
      text: description,
      icon: severity === 'error' ? 'error' : 'success',
      timer: 2000,
      timerProgressBar: true,
      confirmButtonColor: '#fe696a',
      focusConfirm: false,
    });
  }, [severity, title, description]); 

  return null; 
}

DescriptionAlert.propTypes = {
  severity: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};