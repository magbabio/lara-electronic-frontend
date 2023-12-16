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

import { orders } from 'src/_mock/order';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import OrderTableRow from '../order-table-row';
import OrderTableHead from '../order-table-head';
import TableEmptyRows from '../table-empty-rows';
import OrderTableToolbar from '../order-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function OrderPage() {

  const navigate = useNavigate()

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('number');

  const [filterNumber, setFilterNumber] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.number);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, number) => {
    const selectedIndex = selected.indexOf(number);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, number);
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

  const handleFilterByNumber = (event) => {
    setPage(0);
    setFilterNumber(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(order, orderBy),
    filterNumber,
  });

  const notFound = !dataFiltered.length && !!filterNumber;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
        <Typography variant="h4">Servicios</Typography>

        <Stack direction="row" spacing={1} alignItems="center" mr={-1}>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => navigate("/servicios/crear")}>
            Registrar
          </Button>

          <Button variant="contained" color="inherit" startIcon={<Iconify icon="ph:trash-fill" />}>
            Papelera
          </Button>
        </Stack>
      </Stack>

      <Card>
        <OrderTableToolbar
          numSelected={selected.length}
          filterNumber={filterNumber}
          onFilterNumber={handleFilterByNumber}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={order}
                orderBy={orderBy}
                rowCount={orders.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'number', label: 'Número de orden' },
                  { id: 'customer', label: 'Cliente' },
                  { id: 'receipt_date', label: 'Fecha de recepción' },
                  { id: 'received_by', label: 'Recibido por' },
                  { id: 'status', label: 'Estado' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      number={row.number}
                      customer={row.customer}
                      receipt_date={row.receipt_date}
                      received_by={row.received_by}
                      status={row.status}
                      company={row.company}
                      // avatarUrl={row.avatarUrl}
                      selected={selected.indexOf(row.number) !== -1}
                      handleClick={(event) => handleClick(event, row.number)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, orders.length)}
                />

                {notFound && <TableNoData query={filterNumber} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
