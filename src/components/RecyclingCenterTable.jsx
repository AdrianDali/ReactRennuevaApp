import React, { useState, useEffect ,useContext} from 'react';
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
    const { updateRecyclingCenterInfo, setUpdateRecyclingCenterInfo } = useContext(TodoContext);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-all-recycling-center/`)
            .then(response => {
                setClientes(response.data);
                console.log("sadlkasdasklajkfdsfjkgdsfljkasdhfladksjhfasdjklfhadskljfhasdlkfj");
                console.log(response.data);
                setUpdateRecyclingCenterInfo(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, [updateRecyclingCenterInfo]);
  
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
                <TableCell>ID</TableCell>
                <TableCell>Nombre del Centro de Reciclaje</TableCell>
                <TableCell>Razón Social</TableCell>
                <TableCell>RFC</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Calle</TableCell>
                <TableCell>Num Interior</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Código Postal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cliente, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{cliente.RecyclingCenterId}</TableCell>
                  <TableCell>{cliente.RecyclingCenterName}</TableCell>
                  <TableCell>{cliente.RecyclingCenterRazonSocial}</TableCell>
                  <TableCell>{cliente.RecyclingCenterRfc}</TableCell>
                  <TableCell>{cliente.RecyclingCenterPhone}</TableCell>
                  <TableCell>{cliente.RecyclingCenterEmail}</TableCell>
                  <TableCell>{cliente.AddressStreet}</TableCell>
                  <TableCell>{cliente.AddressNumInt}</TableCell>
                  <TableCell>{cliente.AddressLocality}</TableCell>
                  <TableCell>{cliente.AddressCity}</TableCell>
                  <TableCell>{cliente.AddressState}</TableCell>
                  <TableCell>{cliente.AddressPostalCode}</TableCell>
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
