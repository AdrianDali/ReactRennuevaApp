import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { TodoContext } from "../../context";

const DonorRecolectionTable = () => {
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { updateDonorInfo, setUpdateDonorInfo } = useContext(TodoContext);
  
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-donors-recollection/`)
      .then((response) => {
        setClientes(response.data.ordenes);
        setUpdateDonorInfo(false);
      })
      .catch((error) => {
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
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 300, minHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {/* Añade aquí tus encabezados de tabla */}
              <TableCell>Id</TableCell>
              <TableCell>Donador</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Colonia</TableCell>
              <TableCell>Calle</TableCell>
              <TableCell>Codigo Postal</TableCell>
              <TableCell>Latitud</TableCell>
              <TableCell>Longitud</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((orden, index) => (
                <TableRow key={index}>
                  {/* Añade aquí tus celdas de datos */}
                  <TableCell>{orden.id}</TableCell>
                  <TableCell>{orden.donador}</TableCell>
                  <TableCell>{orden.fecha}</TableCell>
                  <TableCell>{orden.estado}</TableCell>
                  <TableCell>{orden.ciudad}</TableCell>
                  <TableCell>{orden.localidad}</TableCell>
                  <TableCell>{orden.calle}</TableCell>
                  <TableCell>{orden.codigo_postal}</TableCell>
                  <TableCell>{orden.latitud}</TableCell>
                  <TableCell>{orden.longitud}</TableCell>
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
};

export default DonorRecolectionTable;
