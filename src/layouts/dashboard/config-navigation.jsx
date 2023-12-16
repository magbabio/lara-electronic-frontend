import Iconify from 'src/components/iconify';

// ---------------------------------------------------------------------
const navConfig = [
  {
    title: 'inicio',
    path: '/',
    icon: <Iconify icon="ic:round-analytics" />,
  },
  {
    title: 'Servicios',
    path: '/servicios',
    icon: <Iconify icon="material-symbols:orders-rounded" />,
  },
  {
    title: 'clientes',
    path: '/products',
    icon: <Iconify icon="ph:shopping-cart-fill" />,
  },
  {
    title: 'usuarios',
    path: '/blog',
    icon:  <Iconify icon="majesticons:users" />,
  },
];

export default navConfig;
