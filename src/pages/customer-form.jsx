import { Helmet } from 'react-helmet-async';

import CustomerForm from 'src/sections/customers/form/customer-form';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Clientes | Lara Electrónica </title>
      </Helmet>

      <CustomerForm />
    </>
  );
}
