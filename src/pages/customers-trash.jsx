import { Helmet } from 'react-helmet-async';

import { CustomersTrashView } from 'src/sections/customers/trash';

// ----------------------------------------------------------------------

export default function UsersPage() {
  return (
    <>
      <Helmet>
        <title> Clientes | Lara Electrónica </title>
      </Helmet>

      <CustomersTrashView />
    </>
  );
}