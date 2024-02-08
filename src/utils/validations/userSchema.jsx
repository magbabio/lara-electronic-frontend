export const valDocumentNumber = (value) => {
  
  if (!value) {
      return 'El número de documento es requerido';
    }

    if (value.trim().length < 7) {
      return 'El apellido debe tener al menos 7 caracteres';
  }

  if (value.trim().length > 9) {
      return 'El apellido no debe tener más de 9 caracteres';
  }


};

export const valFirstName = (value) => {
  if (!value) {
    return 'El nombre es requerido';
  }

  if (/\d/.test(value)) {
    return 'El nombre no puede contener números';
  }

  if (value.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
  }

  if (value.trim().length > 50) {
      return 'El nombre no debe tener más de 50 caracteres';
  }

  return '';
};

export const valLastName = (value) => {
  if (!value) {
    return 'El apellido es requerido';
  }

  if (/\d/.test(value)) {
    return 'El apellido no puede contener números';
  }

  if (value.trim().length < 3) {
      return 'El apellido debe tener al menos 3 caracteres';
  }

  if (value.trim().length > 50) {
      return 'El apellido no debe tener más de 50 caracteres';
  }

  return '';
};

export const valPhone = (value) => {
  
  if (value.length !== 0 && !/^[\d-]+$/.test(value)) {
    return 'El teléfono solo puede contener números y el carácter "-"';
  }

  if (value.length !== 0 && value.length !== 12) {
      return 'El teléfono debe tener exactamente 11 caracteres';
  }

  return '';
};

export const valEmail = (value) => {
  if (!value) {
    return 'El correo electrónico es requerido';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return 'El correo electrónico no tiene un formato válido';
  }

  return '';
};