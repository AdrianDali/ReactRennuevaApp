import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination 
} from '@mui/material';
import { TodoContext } from '../context';

const RecyclingCenterTable = () => {
    const [clientes, setClientes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { updateCarrierInfo, setUpdateCarrierInfo  } = useContext(TodoContext);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-all-carrier/`)
            .then(response => {
                setClientes(response.data);
                console.log("sadlkasdasklajkfdsfjkgdsfljkasdhfladksjhfasdjklfhadskljfhasdlkfj");
                setUpdateCarrierInfo(false);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [updateCarrierInfo]);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 300, minHeight : 300 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Compañía</TableCell>
                <TableCell>RFC</TableCell>
                <TableCell>Comentarios</TableCell>
          
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cliente, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{cliente.first_name} {cliente.last_name}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.phone}</TableCell>
                  <TableCell>{cliente.company_name}</TableCell>
                  <TableCell>{cliente.rfc}</TableCell>
                  <TableCell>{cliente.comments}</TableCell>
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

export default RecyclingCenterTable;
