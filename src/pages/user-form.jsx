import { Helmet } from 'react-helmet-async';

import UserForm from 'src/sections/users/form/users-form';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Usuarios | Lara Electrónica </title>
      </Helmet>

      <UserForm />
    </>
  );
}
