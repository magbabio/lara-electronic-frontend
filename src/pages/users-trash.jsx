import { Helmet } from 'react-helmet-async';

import { UsersTrashView } from 'src/sections/users/trash';

// ----------------------------------------------------------------------

export default function UsersPage() {
  return (
    <>
      <Helmet>
        <title> Usuarios | Lara Electrónica </title>
      </Helmet>

      <UsersTrashView />
    </>
  );
}
