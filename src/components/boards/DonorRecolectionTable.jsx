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
import {  ActionButtonOrdersExcel} from '../../components/OptionButton';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';




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

  const statusText = (status) => {
    switch (status) {
        case 'solicitado':
            return 'Solicitada'
        case 'pendienteRecoleccion':
            return 'Pendiente de recolección'
        case 'recolectada':
            return 'Recolectada'
        case 'cancelado':
            return 'Cancelada'
        case 'entregadaCentro':
            return 'Entregada al centro'
        default:
            return 'indefinido'
    }
}

const statusColor = (status) => {
    switch (status) {
        case 'solicitada':
            return '#0588d1'
        case 'pendienteRecoleccion':
            return '#ed6c03'
        case 'recolectada':
            return '#2e7d32'
        case 'cancelado':
            return 'error'
        case 'entregadaCentro':
            return '#2e7d32'
        default:
            return '#0588d1'
    }
}

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
          date: '2020-01-05',
          customerId: '11091700',
          amount: 3,
        },
        {
          date: '2020-01-02',
          customerId: 'Anonymous',
          amount: 1,
        },
      ],
    };
  }

  const handleClickOpen = (id) => {
    setOpenCancelModal(true);
  }

  const handleConfirmDelete = (user, id) => {
    console.log("Borrado confirmado");
    console.log(user);
    console.log(id);

    axios
    .post(`${process.env.REACT_APP_API_URL}/delete-donor-recollection/`, {
      user: user,
      id_order: id 
    })
    .then((response) => {
      console.log(response);
      setOpen(false);
      setOpenModalText(true);
      setTextOpenModalText("Donación eliminada correctamente");
      setUpdateDonorInfo(true);


    })
    .catch((error) => {
      console.error(error);
      setOpen(false);
      setOpenModalText(true);
      setTextOpenModalText("Error al eliminar la donación");
    });


    handleClose();
  };

  const handleClose = () => {
    setOpenCancelModal(false);
  };


const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  
];

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.id}</TableCell>
                    <TableCell>{row.donador}</TableCell>
                    <TableCell>{row.fecha}</TableCell>
                    <TableCell>{row.direccion_completa}</TableCell>
                    <TableCell>{row.peso_estimado}</TableCell>
                    <TableCell>
                      <Button
                        color={
                          row.status === "solicitado" ? "primary" : "error" 
                        }
                        onClick={() => {
                          setRecolectionToEdit(row);
                          setOpenEditModal(true);
                        }}
                      >
                        <Edit />
                      </Button>
                    </TableCell>

                    <TableCell>
                      <IconButton
                        aria-label="borrar"
                        onClick={() => handleClickOpen(11)}
                      >
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
                          {"¿Estás seguro de querer borrar?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Esta acción no se puede deshacer.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancelar</Button>
                          <Button onClick={ () => handleConfirmDelete(row.donador, row.id) } autoFocus>
                            {" "}
                            {/* Aquí no necesitas pasar el ID ya que se maneja a través del estado */}
                            Confirmar
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                    <TableCell
                      bgcolor={
                        statusColor(row.status)
                      }
                      sx={{
                        borderRadius: "10px", // Adjust the radius to your preference
                        padding: "1px", // Example of adjusting padding
                        marginRight: "10px", // Example of adjusting margin
                        marginTop: "15px", // Example of adjusting margin  
                        display: "flex", // Center the content horizontally and vertically
                        justifyContent: "center", // Center the content horizontally
                        width: "100px", // Adjust the width to your preference
                        alignItems: "center", // Center the content horizontally and vertically
                        color: "white", // Change the text color
                        
                        // Add more styles here
                      }}
                    >
                      {statusText(row.status)}
                    </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box bgcolor={"#f5f5f5"} sx={{ margin: 1, width : "100%" }}>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Datos de la recoleccion
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Horario preferente </TableCell>
                    <TableCell>Peso estimado</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((historyRow) => (
                    <TableRow key={historyRow.name}>
                      <TableCell component="th" scope="row">
                        {row.hora_preferente_recoleccion === "00:00:00" ? "No especificado" : row.hora_preferente_recoleccion} 
                      </TableCell>
                      <TableCell>{row.peso_estimado}</TableCell>
                    
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
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


                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.donador}>
                    <TableCell component="th" scope="row">
                      {row.nombre}
                    </TableCell>
                    <TableCell>{row.telefono}</TableCell>
                    
                    <TableCell>{row.estado}</TableCell>
                    <TableCell>{row.ciudad}</TableCell>
                    <TableCell>{row.localidad}</TableCell>
                    <TableCell>{row.calle}</TableCell>
                    <TableCell>{row.num_ext}</TableCell>
                    <TableCell>{row.num_int}</TableCell>
                    <TableCell>{row.codigo_postal}</TableCell>

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
  const [auxClientes, setAuxClientes] = useState(null);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-donors-recollection/`)
      .then((response) => {
        console.log("Donor recolection data");
        console.log(response.data.ordenes);
        setClientes(response.data.ordenes);
        setAuxClientes(response.data.ordenes);
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

  const datoss = [
    { title: 'Solicitado' },
    { title: 'Pendiente Recoleccion' },
    { title: 'Cancelada' },

  ];

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
                console.log (value.email);
                setFilterClient(value.email);
                setClientes(auxClientes.filter((cliente) => cliente.donador === value.email) );
                
                  
              } else {
                axios
                  .get(`${process.env.REACT_APP_API_URL}/get-all-donors-recollection/`)
                  .then((response) => {
                    console.log("Donor recolection data");
                    console.log(response.data.ordenes);
                    setClientes(response.data.ordenes);
                    setAuxClientes(response.data.ordenes);
                    setFilterClient(null);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            }
            }
          />
          
        </Grid>
        <Grid item xs={4} sm={5}>
          <Autocomplete
            disablePortal
            id="combo-box-demo2" // Cambia el ID para que sea único
            options={datoss}
            sx={{ width: "50%" }} // Usa el ancho completo del Grid item
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Filtrar por Status" />
            )}
            onChange={(event, value) => {
              if (value) {
                console.log(value);
                let status = ""
                if (value.title === "Solicitado") {
                  status = "solicitado";
                  console.log(status);
                }
                if (value.title === "Pendiente Recoleccion") {
                  status = "pendienteRecoleccion";
                  console.log(status);
                }
                if (value.title === "Cancelada") {
                  status = "cancelada";
                  console.log(status);
                }

                let requestData = {
                  status: status
              };
          
              // Añadir la propiedad cliente solo si no es nulo
              console.log(filterClient);  
              if (filterClient !== null) {
                  requestData.user = filterClient;
              }

                axios
                  .post(
                    `${process.env.REACT_APP_API_URL}/get-all-donor-recollection-filter-status/`,
                    requestData
                  )
                  .then((response) => {
                    console.log("Donor recolection data");
                    console.log(response.data);
                    setClientes(response.data);
                  })
                  .catch((error) => {
                    console.error(error);
                  });


              } else {
                axios
                  .get(`${process.env.REACT_APP_API_URL}/get-all-donors-recollection/`)
                  .then((response) => {
                    console.log("Donor recolection data");
                    console.log(response.data.ordenes);
                    setClientes(response.data.ordenes);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            }
            }
          />            
        </Grid>
        <Grid item xs={4} sm={1}>
        <ActionButtonOrdersExcel text="Exportar a Excel" color="#28a745" />
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
                <TableCell>Fecha Solicitud</TableCell>
                <TableCell>Direccion</TableCell>
                <TableCell>Peso Estimado</TableCell> 
                <TableCell>Editar</TableCell>
                <TableCell>Eliminar</TableCell>
                <TableCell>Status</TableCell>
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
