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

import { getDeletedOrdersRequest } from 'src/services/order/orderAPI';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from 'src/sections/table-no-data';
import OrderTableHead from 'src/sections/table-head';
import TableEmptyRows from 'src/sections/table-empty-rows';
import { emptyRows, applyFilter, getComparator } from 'src/sections/order/utils';

import OrdersTableToolbar from '../order-table-toolbar';
import OrdersTableRowTrash from '../orders-table-row-trash';

// ----------------------------------------------------------------------

export default function OrdersTrashPage() {

  const [orders, setOrders] = useState([]);

  const navigate = useNavigate()

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [customerBy, setCustomerBy] = useState('deleted_at');

  const [filterDocument, setFilterDocument] = useState('');

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
        const response = await getDeletedOrdersRequest();
        const formattedOrders = response.data.Data.map((order) => ({
          ...order,
          receipt_date: formatDate(order.receipt_date),
          deleted_at: formatDate(order.deleted_at), 
          updated_at: formatDate(order.updated_at),
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchOrders();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = customerBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setCustomerBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.deleted_at);
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

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleSearchTerm = (value) => {
    setSearchTerm(value);
  };
  
  const notFound = searchResults.length === 0 && searchTerm !== '';

  const dataFiltered = searchResults.length > 0 ? searchResults : (notFound ? [] : orders);


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
        <Typography variant="h4">Servicios eliminados</Typography>

        <Stack direction="row" spacing={1} alignItems="center" mr={-1}>
          <Button 
          variant="contained"
          color="inherit" 
          startIcon={<Iconify icon="ph:list-fill" />}
          onClick={() => navigate("/servicios")}
          >
            Listado
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
                  { id: 'deleted_at', label: 'Fecha de eliminación' },
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
                    <OrdersTableRowTrash
                      key={row.id}
                      id={row.id}
                      deleted_at={row.deleted_at}
                      number={row.number}
                      customer_id={row.customer_id}
                      receipt_date={row.receipt_date}
                      user_id={row.user_id}
                      order_status={row.order_status}
                      selected={selected.indexOf(row.deleted_at) !== -1}
                      handleClick={(event) => handleClick(event, row.deleted_at)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, orders.length)}
                />

                {notFound && <TableNoData query={filterDocument} />}
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