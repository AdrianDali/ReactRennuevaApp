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

const CollectionCenterTable = () => {
    const [clientes, setClientes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { updateCollectionCenterInfo, setUpdateCollectionCenterInfo } = useContext(TodoContext);
    useEffect(() => {
        axios
            .get('https://api.rennueva.com/Rennueva/get-all-collection-center/')
            .then(response => {
                setClientes(response.data);
                console.log("sadlkasdasklajkfdsfjkgdsfljkasdhfladksjhfasdjklfhadskljfhasdlkfj");
                console.log(response.data);
                setUpdateCollectionCenterInfo(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, [updateCollectionCenterInfo]);
  
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
                <TableCell>Nombre del Centro de Recoleccion</TableCell>
                <TableCell>Razon Social</TableCell>
                <TableCell>RFC</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Calle</TableCell>
                <TableCell>Num Interio</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Codigo Postal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cliente, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{cliente.CollectionCenterId}</TableCell>
                  <TableCell>{cliente.CollectionCenterName}</TableCell>
                  <TableCell>{cliente.CollectionCenterRazonSocial}</TableCell>
                  <TableCell>{cliente.CollectionCenterRfc}</TableCell>
                  <TableCell>{cliente.CollectionCenterPhone}</TableCell>
                  <TableCell>{cliente.CollectionCenterEmail}</TableCell>
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

export default CollectionCenterTable;
