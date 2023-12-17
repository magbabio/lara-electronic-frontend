export const valOrderNumber = (value) => {
  if (!value) {
    return 'Número de orden es requerido';
  }

  if (value.trim().length < 6) {
    return 'Número de orden debe tener al menos 6 caracteres';
  }

  if (value.trim().length > 7) {
    return 'Número de orden no debe tener más de 7 caracteres';
  }

  return null; // Agrega una instrucción de retorno adicional al final
};

export const valReceiptDate = (value) => {
  
  if (!value) {
      return 'Fecha de recepción es requerida';
    }

  return null;

};

export const valReceivedBy = (value) => {
  
  if (!value) {
      return 'Recibido por es requerido';
    }

  return null;

};

export const valDescription = (value) => {
  
  if (!value) {
      return 'Descripción es requerida';
    }

  return null;

};

export const valBrand = (value) => {
  
  if (!value) {
      return 'Marca es requerida';
    }

  return null;

};

export const valModel = (value) => {
  
  if (!value) {
      return 'Modelo es requerido';
    }

  return null;

};

export const valSerial = (value) => {
  
  if (!value) {
      return 'Serial es requerido';
    }

  return null;

};

export const valObservations = (value) => {
  
  if (!value) {
      return 'Observaciones son requeridas';
    }

  return null;

};