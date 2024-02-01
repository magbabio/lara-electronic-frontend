import { Helmet } from 'react-helmet-async';

import { OrderView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderPage() {
  return (
    <>
      <Helmet>
        <title> Servicios | Lara Electrónica </title>
      </Helmet>

      <OrderView />
    </>
  );
}
