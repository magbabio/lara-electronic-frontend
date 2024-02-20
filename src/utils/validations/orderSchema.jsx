export const valOrderNumber = (value) => {
  if (!value) {
    return 'Número de orden es requerido';
  }

  if (value.trim().length < 6) {
    return 'Número de orden debe tener exactamente 6 caracteres';
  }

  if (value.trim().length > 7) {
    return 'Número de orden debe tener exactamente 6 caracteres';
  }

  return null; // Agrega una instrucción de retorno adicional al final
};

export const valReceiptDate = (value) => {
  if (!value) {
    return {
      message: 'Fecha de recepción es requerida'
    };
  }

  return null;
};

export const valDescription = (value) => {
  
  if (!value) {
      return 'Nombre es requerido';
  }

  if (value.trim().length < 3) {
    return 'Nombre no es válido';
  }

  return null;

};

export const valBrand = (value) => {
  
  if (!value) {
      return 'Marca es requerida';
  }

  if (value.trim().length < 3) {
    return 'Marca no es válida';
  }

  return null;

};

export const valModel = (value) => {
  
  if (!value) {
      return 'Modelo es requerido';
    }

  if (value.trim().length < 3) {
      return 'Modelo no es válido';
  } 

  return null;

};

export const valSerial = (value) => {
  
  if (!value) {
      return 'Serial es requerido';
    }
  
  if (value.trim().length < 3) {
      return 'Serial no es válido';
  } 

  return null;

};

export const valRepairConcept = (value) => {
  
  if (!value) {
      return 'Concepto de reparación es requerido';
    }
  
  if (value.trim().length < 3) {
      return 'Concepto de reparación no es válido';
  } 

  return null;

};

export const valObservations = (value) => {
  
  if (!value) {
      return 'Observaciones son requeridas';
    }

  return null;

};