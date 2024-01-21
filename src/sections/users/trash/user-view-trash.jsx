import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getDeletedUsersRequest } from 'src/services/user/userAPI';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from 'src/sections/table-no-data';
import OrderTableHead from 'src/sections/table-head';
import TableEmptyRows from 'src/sections/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/sections/order/utils';

import UsersTableRowTrash from '../users-table-row-trash';
import UsersTableToolbar from '../users-table-toolbar';

// ----------------------------------------------------------------------

export default function UsersTrashPage() {

  const [users, setUsers] = useState([]);

  const navigate = useNavigate()

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [userBy, setUserBy] = useState('deleted_at');

  const [filterDocument, setFilterDocument] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getDeletedUsersRequest();
        const formattedUsers = response.data.Data.map((user) => ({
          ...user,
          deleted_at: formatDate(user.deleted_at), 
          updated_at: formatDate(user.updated_at),
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchUsers();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = userBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setUserBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.deleted_at);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, deleted_at) => {
    const selectedIndex = selected.indexOf(deleted_at);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, deleted_at);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByDocument = (event) => {
    setPage(0);
    setFilterDocument(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, userBy),
    filterDocument,
  });

  const notFound = !dataFiltered.length && !!filterDocument;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
        <Typography variant="h4">Usuarios eliminados</Typography>

        <Stack direction="row" spacing={1} alignItems="center" mr={-1}>
          <Button 
          variant="contained"
          color="inherit" 
          startIcon={<Iconify icon="ph:list-fill" />}
          onClick={() => navigate("/usuarios")}
          >
            Listado
          </Button>
        </Stack>
      </Stack>

      <Card>
        <UsersTableToolbar
          numSelected={selected.length}
          filterDocument={filterDocument}
          onFilterDocument={handleFilterByDocument}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={order}
                orderBy={userBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'deleted_at', label: 'Fecha de eliminación' },
                  { id: 'document_type', label: 'Documento' },
                  { id: 'first_name', label: 'Nombre' },
                  { id: 'last_name', label: 'Apellido' },
                  { id: 'email', label: 'Correo electrónico' },
                  { id: 'role', label: 'Rol' },
                  { id: 'role', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UsersTableRowTrash
                      key={row.id}
                      id={row.id}
                      deleted_at={row.deleted_at}
                      document_type={row.document_type}
                      document_number={row.document_number}
                      first_name={row.first_name}
                      last_name={row.last_name}
                      email={row.email}
                      role={row.role}
                      selected={selected.indexOf(row.deleted_at) !== -1}
                      handleClick={(event) => handleClick(event, row.deleted_at)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterDocument} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
