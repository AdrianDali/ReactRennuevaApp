import React, { useState, useEffect ,useContext} from 'react';
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { TodoContext } from '../context/index.js';
const DriverTable = ({ datos }) => {
  const [clientes, setClientes] = useState([]);
  const {updateDriverInfo, setUpdateDriverInfo} = useContext(TodoContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-drivers/`)
      .then(response => {
        const data = response.data;
        setClientes(data);
        setUpdateDriverInfo(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, [updateDriverInfo]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 300, minHeight: 300 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
                <TableCell>Licencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cliente, index) => (
                <TableRow key={index}>
                  <TableCell>{cliente.first_name}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.phone}</TableCell>
                    <TableCell>{cliente.license}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={clientes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default DriverTable;
