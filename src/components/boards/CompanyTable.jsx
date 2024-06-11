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
import { TodoContext } from '../../context';

const CompanyTable = () => {
    const [clientes, setClientes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { updateCompanyInfo,setUpdateCompanyInfo ,setUpdateCollectionCenterInfo } = useContext(TodoContext);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-all-companies/`)
            .then(response => {
                setClientes(response.data);
                console.log("sadlkasdasklajkfdsfjkgdsfljkasdhfladksjhfasdjklfhadskljfhasdlkfj");
                console.log(response.data);
                setUpdateCompanyInfo(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, [updateCompanyInfo]);
  
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
                <TableCell>Nombre</TableCell>
                <TableCell>Logo</TableCell>
                <TableCell>Color principal</TableCell>
                <TableCell>Color secundario</TableCell>
                <TableCell>Sitio principal</TableCell>
                <TableCell>Sitio secundario</TableCell>
                <TableCell>Fuente</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cliente, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{cliente.company_id}</TableCell>
                  <TableCell>{cliente.company_name}</TableCell>
                  <TableCell>{cliente.logo}</TableCell>
                  <TableCell>{cliente.main_color}</TableCell>
                  <TableCell>{cliente.secondary_color}</TableCell>
                  <TableCell>{cliente.main_web}</TableCell>
                  <TableCell>{cliente.second_web}</TableCell>
                  <TableCell>{cliente.font_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          lang='es'
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

export default CompanyTable;
