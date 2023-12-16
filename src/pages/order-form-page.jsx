import { Helmet } from 'react-helmet-async';

import OrderForm from 'src/sections/order/form/order-form';

// ----------------------------------------------------------------------

export default function OrderPage() {
  return (
    <>
      <Helmet>
        <title> Órdenes | Lara Electrónica </title>
      </Helmet>

      <OrderForm />
    </>
  );
}
