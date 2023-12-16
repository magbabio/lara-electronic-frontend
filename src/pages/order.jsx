import { Helmet } from 'react-helmet-async';

import { OrderView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderPage() {
  return (
    <>
      <Helmet>
        <title> Órdenes | Lara Electrónica </title>
      </Helmet>

      <OrderView />
    </>
  );
}
