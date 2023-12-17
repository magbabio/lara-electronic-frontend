export const valOrderNumber = (value) => {
  if (!value) {
    return 'El número de orden es requerido';
  }

  if (value.trim().length < 6) {
    return 'El número de orden debe tener al menos 6 caracteres';
  }

  if (value.trim().length > 7) {
    return 'El número de orden no debe tener más de 7 caracteres';
  }

  return null; // Agrega una instrucción de retorno adicional al final
};

export const valReceiptDate = (value) => {
  
  if (!value) {
      return 'La fecha en que fue recibido es requerido';
    }

};