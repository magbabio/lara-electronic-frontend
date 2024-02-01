import { Helmet } from 'react-helmet-async';

import OrderShow from 'src/sections/order/show/orders-show';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Servicios | Lara Electrónica </title>
      </Helmet>

      <OrderShow />
    </>
  );
}
