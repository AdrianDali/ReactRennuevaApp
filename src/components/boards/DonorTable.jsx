import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Edit } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
} from "@mui/material";
import { TodoContext } from "../../context";
import EditRecolectionModal from "./EditRecolectionModal";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  OptionButton,
  ActionButtonOrdersExcel,
} from "../../components/OptionButton";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [openCancelModal, setOpenCancelModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [recolectionToEdit, setRecolectionToEdit] = React.useState(null);
  const {
    updateDonorInfo,
    setUpdateDonorInfo,
    setOpenModalText,
    setTextOpenModalText,
  } = useContext(TodoContext);

  function createData(name, calories, fat, carbs, protein, price) {
    return {
      name,
      calories,
      fat,
      carbs,
      protein,
      price,
      history: [
        {
          date: "2020-01-05",
          customerId: "11091700",
          amount: 3,
        },
        {
          date: "2020-01-02",
          customerId: "Anonymous",
          amount: 1,
        },
      ],
    };
  }

  const handleClickOpen = (id) => {
    setOpenCancelModal(true);
  };

  const handleConfirmDelete = (user, id) => {
    console.log("Borrado confirmado");
    console.log(user);
    console.log(id);

    axios
      .put(`${process.env.REACT_APP_API_URL}/delete-django-user/`, {
        user: user,
      })
      .then((response) => {
        console.log(response);
        setOpen(false);
        setOpenModalText(true);
        setTextOpenModalText("Donador eliminado correctamente");
        setUpdateDonorInfo(true);
      })
      .catch((error) => {
        console.error(error);
        setOpen(false);
        setOpenModalText(true);
        setTextOpenModalText("Error al eliminar el donador");
      });

    handleClose();
  };

  const handleClose = () => {
    setOpenCancelModal(false);
  };

  const rows = [createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99)];

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.id_django}</TableCell>
        <TableCell>{row.first_name +" " + row.last_name }</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.direccion_completa}</TableCell>
        {/* <TableCell>
          <Button
            color={row.status === "solicitado" ? "primary" : "error"}
            onClick={() => {
              setRecolectionToEdit(row);
              setOpenEditModal(true);
            }}
          >
            <Edit />
          </Button>
        </TableCell> */}

        <TableCell>
          <IconButton aria-label="borrar" onClick={() => handleClickOpen(11)}>
            {" "}
            {/* Suponiendo que el ID del reporte es "1", aquí deberías pasar el ID real según tu lógica */}
            <DeleteIcon />
          </IconButton>
          <Dialog
            open={openCancelModal}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"¿Estás seguro de querer borrar el Donador?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Esta acción no se puede deshacer.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button
                onClick={() => handleConfirmDelete(row.email, row.id)}
                autoFocus
              >
                {" "}
                {/* Aquí no necesitas pasar el ID ya que se maneja a través del estado */}
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box bgcolor={"#f5f5f5"} sx={{ margin: 1, width: "100%" }}>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Datos del donador
                </Typography>

                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Telefono</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Ciudad</TableCell>
                      <TableCell>Colonia</TableCell>
                      <TableCell>Calle</TableCell>
                      <TableCell>Num. Ext</TableCell>
                      <TableCell>Num. Int</TableCell>
                      <TableCell>Codigo Postal</TableCell>
                      <TableCell>Referencias de dirección</TableCell>
                      <TableCell>Compañia</TableCell>
                        <TableCell>RFC</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={row.donador}>
                      <TableCell component="th" scope="row">
                        {row.first_name + " " + row.last_name}
                      </TableCell>
                      <TableCell>{row.phone}</TableCell>

                      <TableCell>{row.address_state}</TableCell>
                      <TableCell>{row.address_city}</TableCell>
                      <TableCell>{row.address_locality}</TableCell>
                      <TableCell>{row.address_street}</TableCell>
                      <TableCell>{row.address_num_ext}</TableCell>
                      <TableCell>{row.address_num_int}</TableCell>
                      <TableCell>{row.address_postal_code}</TableCell>
                      <TableCell>{row.address_references}</TableCell>
                      <TableCell>{row.company}</TableCell>
                      <TableCell>{row.rfc}</TableCell>

                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <EditRecolectionModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        recolection={recolectionToEdit}
        setMessage={setTextOpenModalText}
        setOpenMessageModal={setOpenModalText}
        update={updateDonorInfo}
        setUpdate={setUpdateDonorInfo}
      />
    </React.Fragment>
  );
}

const DonorRecolectionTable = () => {
  const [clientes, setClientes] = useState([]);
  const [correoCliente, setCorreoCliente] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const {
    updateDonorInfo,
    setUpdateDonorInfo,
    setOpenModalText,
    setTextOpenModalText,
  } = useContext(TodoContext);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [recolectionToEdit, setRecolectionToEdit] = useState(null);
  const [filterClient, setFilterClient] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-donors/`)
      .then((response) => {
        console.log("Donor recolection data");
        console.log(response.data);
        setClientes(response.data);

        setUpdateDonorInfo(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [updateDonorInfo]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-donor-email/`)
      .then((response) => {
        console.log("Donor recolection data");
        console.log(response.data);
        setCorreoCliente(response.data);

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
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Grid container spacing={2} justifyContent="center" margin="10px">
          <Grid item xs={4} sm={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo1"
              options={correoCliente}
              sx={{ width: "100%" }} // Usa el ancho completo del Grid item
              getOptionLabel={(option) => option.email}
              renderInput={(params) => (
                <TextField {...params} label="Filtrar por Donador" />
              )}
              onChange={(event, value) => {
                if (value) {
                  console.log(value);
                  console.log(value.email);
                  setFilterClient(value.email);
                  setClientes(
                    clientes.filter(
                      (cliente) => cliente.user === value.email
                    )
                  );
                } else {
                  axios
                    .get(
                      `${process.env.REACT_APP_API_URL}/get-all-donors/`
                    )
                    .then((response) => {
                      console.log("Donor recolection data");
                      console.log(response.data);
                      setClientes(response.data);
                      setFilterClient(null);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              }}
            />
          </Grid>
        </Grid>

        <TableContainer sx={{ maxHeight: 300, minHeight: 300 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {/* Añade aquí tus encabezados de tabla */}
                <TableCell></TableCell>
                <TableCell>Id</TableCell>
                <TableCell>Donador</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Direccion</TableCell>
                {/* <TableCell>Editar</TableCell> */}
                <TableCell>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((orden, index) => (
                  <Row key={index} row={orden} />
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
      <EditRecolectionModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        recolection={recolectionToEdit}
        setMessage={setTextOpenModalText}
        setOpenMessageModal={setOpenModalText}
        update={updateDonorInfo}
        setUpdate={setUpdateDonorInfo}
      />
    </>
  );
};

export default DonorRecolectionTable;
