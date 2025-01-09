import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Add, Edit } from "@mui/icons-material";
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
  Chip,
  IconButton,
  Collapse,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import { TodoContext } from "../../context";
import EditRecolectionModal from "./EditRecolectionModal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ActionButtonOrdersExcel } from "../../components/OptionButton";
import { ModalFirmar } from "../../pages/ModalFirmar";
import { statusText, statusColor } from "../../helpers/statusModifiers";
import { ModalResidueRecollection } from "../../pages/ModalResidueRecollection";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const DriverCenterAssignedTable = () => {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const username = getCookie("user");

  const [clientes, setClientes] = useState([]);
  const [correoCliente, setCorreoCliente] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    updateDonorInfo,
    setUpdateDonorInfo,
    setOpenModalText,
    setTextOpenModalText,
  } = useContext(TodoContext);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [recolectionToEdit, setRecolectionToEdit] = useState(null);
  const [filterClient, setFilterClient] = useState(null);
  const [auxClientes, setAuxClientes] = useState([]);
  const [reportToEdit, setReportToEdit] = useState({});
  const [signType, setSignType] = useState("Recoleccion");

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-centers-orders-assigned-to-driver/`,
        {
          user: username,
          status: "pendienteRecoleccion",
        }
      )
      .then((response) => {
        console.log("Órdenes asignadas:", response.data);
        setClientes(response.data.ordenes);
        setAuxClientes(response.data.ordenes);
        const cli = response.data.ordenes.map((cliente) => {
          return { email: cliente.correo_donador };
        });
        setCorreoCliente(cli);
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
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id="combo-box-demo1"
              options={correoCliente}
              sx={{ width: "100%" }}
              getOptionLabel={(option) => option.email}
              renderInput={(params) => (
                <TextField {...params} label="Filtrar por Donador" />
              )}
              onChange={(event, value) => {
                if (value) {
                  setFilterClient(value.email);
                  setClientes(
                    auxClientes.filter(
                      (cliente) => cliente.correo_donador === value.email
                    )
                  );
                } else {
                  setFilterClient(null);
                  setClientes(auxClientes);
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={1}>
            <ActionButtonOrdersExcel text="Exportar a Excel" color="#28a745" />
          </Grid>
        </Grid>

        <TableContainer sx={{ maxHeight: 300, minHeight: 300 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Id</TableCell>
                <TableCell>Donador</TableCell>
                <TableCell>Fecha Solicitud</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Peso Estimado</TableCell>
                <TableCell>Firma Conductor</TableCell>
                <TableCell>Firma Donador</TableCell>
                <TableCell>Residuos</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((orden, index) => (
                  <Row
                    key={index}
                    row={orden}
                    setReportToEdit={setReportToEdit}
                    signType={signType}
                    setSignType={setSignType}
                  />
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
      <ModalResidueRecollection report={reportToEdit} />
      <ModalFirmar type={signType} id={reportToEdit} />
    </>
  );
};

const Row = (props) => {
  const { row, setReportToEdit, signType, setSignType } = props;
  const [open, setOpen] = useState(false);
  const [reportsState, setReportsState] = useState(
    row.reports.map((report) => ({ ...report, aprobado: false }))
  );

  const handleApprovalToggle = (index) => {
    const updatedReports = [...reportsState];
    updatedReports[index].aprobado = !updatedReports[index].aprobado;
    setReportsState(updatedReports);
    // Aquí puedes manejar lógica adicional, como actualizar el estado en el servidor
  };

  const handleStatusChange = (index, value) => {
    const updatedReports = [...reportsState];
    updatedReports[index].estado = value;
    setReportsState(updatedReports);
  };

  const handleCommentChange = (index, value) => {
    const updatedReports = [...reportsState];
    updatedReports[index].comentarios = value;
    setReportsState(updatedReports);
  };

  const [selectedStatus, setSelectedStatus] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleConfirmRecolectado = () => {
    const updatedStatus = { ...selectedStatus, [selectedOrder]: "Recolectado" };
    setSelectedStatus(updatedStatus);
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <TableRow>
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
        <TableCell>{row.nombre_donador}</TableCell>
        <TableCell>{row.fecha}</TableCell>
        <TableCell>{row.direccion_completa}</TableCell>
        <TableCell>{row.peso_estimado}</TableCell>
        <TableCell>
          <Button
            startIcon={<Add />}
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              //onEditReceiverSign(row.id);
            }}
          >
            Firmar
          </Button>
        </TableCell>
        <TableCell>
          <Button
            startIcon={<Add />}
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              //FonEditDonorSign(row.id);
            }}
          >
            Firmar
          </Button>
        </TableCell>
        <TableCell>
          <Button
            startIcon={<Add />}
            variant="contained"
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              //handleEditResidues(row);
              /*
                            await saveTalonPDF(row, () => {
                                console.log("No se puede generar el talón");
                            })
                            */
            }}
          >
            Agregar
          </Button>
        </TableCell>

        <TableCell>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              //setRecolectionToEdit(row);
              //setOpenEditModal(true);
            }}
          >
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>
          <Chip
            label={statusText(row.status)}
            color={statusColor(row.status)}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={7}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Reportes
              </Typography>
              {reportsState && reportsState.length > 0 ? (
                <Table size="small" aria-label="reports">
                  <TableHead>
                    <TableRow>
                      <TableCell>Folio</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Comentarios</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportsState.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell>{report.folio}</TableCell>
                        <TableCell>
                          <Select
                            sx={{ width: 300 }}
                            value={report.estado || ""}
                            onChange={(e) =>
                              handleStatusChange(index, e.target.value)
                            }
                            displayEmpty
                            renderValue={(selected) => (
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {selected === "success" && (
                                  <CheckCircleIcon color="success" />
                                )}
                                {selected === "error" && (
                                  <CancelIcon color="error" />
                                )}
                                {selected === "warning" && (
                                  <WarningAmberIcon color="warning" />
                                )}
                                <span style={{ marginLeft: 8 }}>
                                  {selected === "success"
                                    ? "Recolectado"
                                    : selected === "error"
                                    ? "No Recolectado"
                                    : selected === "warning"
                                    ? "Recolectado con problema"
                                    : ""}
                                </span>
                              </Box>
                            )}
                          >
                            <MenuItem value="success">
                              <CheckCircleIcon color="success" />
                              <span style={{ marginLeft: 8 }}>Recolectado</span>
                            </MenuItem>
                            <MenuItem value="error">
                              <CancelIcon color="error" />
                              <span style={{ marginLeft: 8 }}>
                                No Recolectado
                              </span>
                            </MenuItem>
                            <MenuItem value="warning">
                              <WarningAmberIcon color="warning" />
                              <span style={{ marginLeft: 8 }}>
                                Recolectado con problema
                              </span>
                            </MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={report.comentarios || ""}
                            onChange={(e) =>
                              handleCommentChange(index, e.target.value)
                            }
                            placeholder="Escribe un comentario"
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No hay reportes disponibles.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

{
  /* Modal */
}

export default DriverCenterAssignedTable;
