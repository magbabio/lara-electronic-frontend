import { Helmet } from 'react-helmet-async';

import UserShow from 'src/sections/users/show/users-show';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Usuarios | Lara Electrónica </title>
      </Helmet>

      <UserShow />
    </>
  );
}
