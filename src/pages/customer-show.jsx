import { Helmet } from 'react-helmet-async';

import CustomerShow from 'src/sections/customers/show/customers-show';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Clientes | Lara Electrónica </title>
      </Helmet>

      <CustomerShow />
    </>
  );
}
