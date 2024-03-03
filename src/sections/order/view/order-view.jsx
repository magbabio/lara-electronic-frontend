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

import { getOrdersRequest } from 'src/services/order/orderAPI';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from 'src/sections/table-no-data';
import OrderTableHead from 'src/sections/table-head';
import TableEmptyRows from 'src/sections/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/sections/order/utils';

import OrdersTableRow from '../order-table-row';
import OrdersTableToolbar from '../order-table-toolbar';

// ----------------------------------------------------------------------

export default function OrdersPage() {

  const [orders, setOrders] = useState([]);

  const navigate = useNavigate()

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [customerBy, setCustomerBy] = useState('created_at');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchResults, setSearchResults] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrdersRequest();
        const formattedOrders = response.data.Data.map((orderItem) => ({
          ...orderItem,
          receipt_date: formatDate(orderItem.receipt_date),
          created_at: formatDate(orderItem.created_at), 
          updated_at: formatDate(orderItem.updated_at),
          order_status: getOrderStatusText(orderItem.order_status),
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchOrders();
  }, []);

  const getOrderStatusText = (orderStatus) => {
    switch (orderStatus) {
      case 1:
        return 'En proceso';
      case 2:
        return 'Completada';
      case 3:
        return 'Anulada';
      default:
        return '';
    }
  };

  const handleSort = (event, id) => {
    const isAsc = customerBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setCustomerBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.created_at);
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

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleSearchTerm = (value) => {
    setSearchTerm(value);
  };
  
  const notFound = searchResults.length === 0 && searchTerm !== '';

  let dataFiltered;

  if (searchResults.length > 0) {
    dataFiltered = searchResults;
  } else if (notFound) {
    dataFiltered = [];
  } else {
    dataFiltered = orders;
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
        <Typography variant="h4">Servicios</Typography>

        <Stack direction="row" spacing={1} alignItems="center" mr={-1}>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => navigate("/servicios/crear")}>
            Registrar
          </Button>

          <Button variant="contained" color="inherit" startIcon={<Iconify icon="ph:trash-fill" />} onClick={() => navigate("/servicios/papelera")}>
            Papelera
          </Button>
        </Stack>
      </Stack>

      <Card>
        <OrdersTableToolbar
          numSelected={selected.length}
          onSearchResults={handleSearchResults}
          onSearchTerm={handleSearchTerm}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={order}
                orderBy={customerBy}
                rowCount={orders.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'created_at', label: 'Fecha de creación' },
                  { id: 'number', label: 'Número' },
                  { id: 'customer_id', label: 'Cliente' },
                  { id: 'receipt_date', label: 'Fecha de recepción' },
                  { id: 'user_id', label: 'Recibido por' },
                  { id: 'order_status', label: 'Estatus' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <OrdersTableRow
                      key={row.id}
                      id={row.id}
                      created_at={row.created_at}
                      number={row.number}
                      customer_id={row.customer_id}
                      receipt_date={row.receipt_date}
                      user_id={row.user_id}
                      order_status={row.order_status}
                      selected={selected.indexOf(row.created_at) !== -1}
                      handleClick={(event) => handleClick(event, row.created_at)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, orders.length)}
                />

            {notFound && <TableNoData query={searchTerm} />}
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
