import { Helmet } from 'react-helmet-async';

import { CustomersView } from 'src/sections/customers/view';

// ----------------------------------------------------------------------

export default function CustomersPage() {
  return (
    <>
      <Helmet>
        <title> Clientes | Lara Electrónica </title>
      </Helmet>

      <CustomersView />
    </>
  );
}
