import { useState } from 'react';
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

import { customers } from 'src/_mock/customers';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from 'src/sections/table-no-data';
import OrderTableHead from 'src/sections/table-head';
import TableEmptyRows from 'src/sections/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/sections/order/utils';

import CustomersTableRow from '../customers-table-row';
import CustomersTableToolbar from '../customers-table-toolbar';


// ----------------------------------------------------------------------

export default function CustomersPage() {

  const navigate = useNavigate()

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [customerBy, setCustomerBy] = useState('created_at');

  const [filterDocument, setFilterDocument] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = customerBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setCustomerBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = customers.map((n) => n.created_at);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, created_at) => {
    const selectedIndex = selected.indexOf(created_at);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, created_at);
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
    inputData: customers,
    comparator: getComparator(order, customerBy),
    filterDocument,
  });

  const notFound = !dataFiltered.length && !!filterDocument;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
        <Typography variant="h4">Clientes</Typography>

        <Stack direction="row" spacing={1} alignItems="center" mr={-1}>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => navigate("/clientes/crear")}>
            Registrar
          </Button>

          <Button variant="contained" color="inherit" startIcon={<Iconify icon="ph:trash-fill" />}>
            Papelera
          </Button>
        </Stack>
      </Stack>

      <Card>
        <CustomersTableToolbar
          numSelected={selected.length}
          filterDocument={filterDocument}
          onFilterDocument={handleFilterByDocument}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={order}
                orderBy={customerBy}
                rowCount={customers.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'created_at', label: 'Fecha de creación' },
                  { id: 'document_type', label: 'Tipo de documento' },
                  { id: 'document_number', label: 'Número de documento' },
                  { id: 'first_name', label: 'Nombre' },
                  { id: 'last_name', label: 'Apellido' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CustomersTableRow
                      key={row.id}
                      created_at={row.created_at}
                      document_type={row.document_type}
                      document_number={row.document_number}
                      first_name={row.first_name}
                      last_name={row.last_name}
                      selected={selected.indexOf(row.created_at) !== -1}
                      handleClick={(event) => handleClick(event, row.created_at)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, customers.length)}
                />

                {notFound && <TableNoData query={filterDocument} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={customers.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
