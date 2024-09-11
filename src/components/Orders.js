import React, { useState, useEffect , useContext} from 'react';
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
import Title from './Title';

const DonorTable = () => {
    const [clientes, setClientes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { updateDonorInfo, setUpdateDonorInfo } = useContext(TodoContext);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-all-users-with-group/`)
            .then(response => {
                console.log("Donors:", response.data);
                setClientes(response.data.users);
                setUpdateDonorInfo(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, [updateDonorInfo]);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Title>Historial de Usuarios</Title>
        <TableContainer sx={{ maxHeight: 300 , minHeight : 300 }}>
          
          <Table size="small" stickyHeader>
            
            <TableHead>
              
              <TableRow>
                {/* Añade aquí tus encabezados de tabla */}
                <TableCell>Grupo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Nombre Usuario</TableCell>
                <TableCell>RFC</TableCell>
                <TableCell>Compañia</TableCell>
                <TableCell>Direccion Estado</TableCell>
                <TableCell>Direccion Ciudad</TableCell>
                <TableCell>Dirección Colonia</TableCell>
                <TableCell>Dirección Calle</TableCell>
                <TableCell>Dirección Codigo Postal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log("Clientes", clientes)}
              {clientes &&
              clientes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cliente, index) => (
                  <TableRow key={index}>
                    {/* Añade aquí tus celdas de datos */}
                    <TableCell>{cliente.groups[0]}</TableCell>
                    <TableCell>{`${cliente.first_name} ${cliente.last_name}`}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.user}</TableCell>
                    <TableCell>{cliente.rfc}</TableCell>
                    <TableCell>{cliente.company}</TableCell>
                    <TableCell>{cliente.address_state}</TableCell>
                    <TableCell>{cliente.address_city}</TableCell>
                    <TableCell>{cliente.address_locality}</TableCell>
                    <TableCell>{cliente.address_street}</TableCell>
                    <TableCell>{cliente.address_postal_code}</TableCell>
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

export default DonorTable;
