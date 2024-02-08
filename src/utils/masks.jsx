import React from 'react';
import InputMask from 'react-input-mask';

export const OrderNumber = React.forwardRef((props, ref) => (
  <InputMask 
    mask="999999" 
    maskChar="" 
    {...props}
  >
    {(inputProps) => <input {...inputProps} ref={ref} />}
  </InputMask>
));

export const DocumentNumber = React.forwardRef((props, ref) => (
  <InputMask 
    mask="999999999" 
    maskChar="" 
    {...props}
  >
    {(inputProps) => <input {...inputProps} ref={ref} />}
  </InputMask>
));

export const OnlyNumber = React.forwardRef((props, ref) => (
  <InputMask 
    mask="999999999" 
    maskChar="" 
    {...props}
  >
    {(inputProps) => <input {...inputProps} ref={ref} />}
  </InputMask>
));

export const Phone = React.forwardRef((props, ref) => (
  <InputMask 
    mask="9999-9999999"  
    maskChar="" 
    {...props}
  >
    {(inputProps) => <input {...inputProps} ref={ref} />}
  </InputMask>
));