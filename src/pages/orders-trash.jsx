import { Helmet } from 'react-helmet-async';

import { OrdersTrashView } from 'src/sections/order/trash';

// ----------------------------------------------------------------------

export default function UsersPage() {
  return (
    <>
      <Helmet>
        <title> Servicios | Lara Electrónica </title>
      </Helmet>

      <OrdersTrashView />
    </>
  );
}