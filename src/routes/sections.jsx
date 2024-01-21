import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const OrderPage = lazy(() => import('src/pages/order'));
export const OrderForm = lazy(() => import('src/pages/order-form-page'));
export const CustomersPage = lazy(() => import('src/pages/customers'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const UserForm = lazy(() => import('src/pages/user-form'));
export const UserShow = lazy(() => import('src/pages/user-show'));
export const UserUpdate = lazy(() => import('src/pages/user-form'));
export const UsersTrash = lazy(() => import('src/pages/users-trash'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'servicios', element: <OrderPage /> },
        { path: 'servicios/crear', element: <OrderForm /> },
        { path: 'clientes', element: <CustomersPage /> },
        { path: 'usuarios', element: <UsersPage /> },
        { path: 'usuarios/crear', element: <UserForm /> },
        { path: 'usuarios/detalles/:id', element: <UserShow /> },
        { path: 'usuarios/editar/:id', element: <UserUpdate /> },
        { path: 'usuarios/papelera', element: <UsersTrash /> },

      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
