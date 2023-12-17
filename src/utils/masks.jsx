import React from 'react';
import InputMask from 'react-input-mask';

export const OnlyNumber = React.forwardRef((props, ref) => (
  <InputMask 
    mask="9999999" 
    maskChar="" 
    {...props}
  >
    {(inputProps) => <input {...inputProps} ref={ref} />}
  </InputMask>
));