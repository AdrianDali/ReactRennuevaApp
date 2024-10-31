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
import { TodoContext } from '../context/index';

const VehicleTable = ({vehicles}) => {
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
      <TableContainer sx={{ maxHeight: 300, minHeight : 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Modelo</TableCell>
              <TableCell>Placas</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Conductor</TableCell>
              <TableCell>Permiso</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((vehicle, index) => (
                <TableRow key={index}>
                  <TableCell>{vehicle.modelo}</TableCell>
                  <TableCell>{vehicle.placas}</TableCell>
                  <TableCell>{vehicle.capacidad}</TableCell>
                  <TableCell>{vehicle.conductor}</TableCell>
                  <TableCell>{vehicle.permiso}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={vehicles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default VehicleTable;
