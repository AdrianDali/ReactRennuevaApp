import React , {useState, useEffect, useContext }from 'react';
import '../styles/Table.css';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import { TodoContext } from '../context';


const UserTable = ({ datos }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Cambiar según tus necesidades
  const {updateUserInfo, setUpdateUserInfo} = useContext(TodoContext);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    const [clientes, setClientes] = useState([]);


    useEffect(() => {
        // Realiza una petición GET a una URL específica
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-all-users-with-group/`)
            .then(response => {
                const data = response.data;
                setClientes(data);
                setUpdateUserInfo(false);

            })
            .catch(error => {
                console.error(error);
            });
    }, [updateUserInfo]);

    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 300, minHeight : 300 }}> {/* Ajusta maxHeight según tus necesidades */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Nombre Usuario</TableCell>
                <TableCell>RFC</TableCell>
                <TableCell>Grupos</TableCell>
                <TableCell>Compañia</TableCell>
                <TableCell>Direccion Estado</TableCell>
                <TableCell>Direccion Ciudad</TableCell>
                <TableCell>Dirección Colonia</TableCell>
                <TableCell>Dirección Calle</TableCell>
                <TableCell>Dirección Codigo Postal</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cliente, index) => (

                  <TableRow key={index}>
                    <TableCell>{`${cliente.first_name} ${cliente.last_name}`}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.user}</TableCell>
                    <TableCell>{cliente.rfc}</TableCell>
                    <TableCell>{cliente.groups}</TableCell>
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

export default UserTable;
