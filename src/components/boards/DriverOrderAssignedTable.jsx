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
} from "@mui/material";
import { TodoContext } from "../../context";
import EditRecolectionModal from "./EditRecolectionModal";
import { IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { OptionButton, ActionButtonOrdersExcel } from '../../components/OptionButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { ModalFirmar } from "../../pages/ModalFirmar";

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
        setOpenModalEditFirma
    } = useContext(TodoContext);
    const [reportToEdit, setReportToEdit] = useState();
    const [signType, setSignType] = useState("Recoleccion");
 
    

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

    ];

    const onEditDonorSign = (id) => {
        setReportToEdit(id);
        
        setSignType("Donador");
        setOpenModalEditFirma(true);
    }

    const onEditReceiverSign = (id) => {
        console.log("Editando firma de receptor");
        console.log(id);
        
        setReportToEdit(id);
        setSignType("Recolector");
        setOpenModalEditFirma(true);
    }

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
                        startIcon={<Add />}
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEditDonorSign(row.id)


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
                            e.stopPropagation()
                            onEditReceiverSign(row.id)


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
                            e.stopPropagation()
                            onEditDonorSign(row.id)

                        }}
                    >
                        Agregar
                    </Button>
                </TableCell>


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
                        <Box bgcolor={"#f5f5f5"} sx={{ margin: 1, width: "100%" }}>
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
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.hora_preferente_recoleccion === "00:00:00" ? "No especificado" : row.hora_preferente_recoleccion}
                                            </TableCell>
                                            <TableCell>{row.peso_estimado}</TableCell>

                                        </TableRow>

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
                                            <TableCell>{row.numero_ext}</TableCell>
                                            <TableCell>{row.numero_int}</TableCell>
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
            <ModalFirmar type={signType} id={reportToEdit} />
        </React.Fragment>
    );
}


const DriverOrderAssignedTable = ({ data }) => {

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const refreshToken = getCookie('refresh');
    const username = getCookie('user');
    const accessToken = getCookie('access');
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
    const [signType, setSignType] = useState("Generador");
    const [reportToEdit, setReportToEdit] = useState({});


    useEffect(() => {
        axios
            .post(`${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-pickup-orders-assigned-to-driver/`, {
                user: username,
                status: "pendienteRecoleccion"
            })
            .then((response) => {
                console.log("Donor recolection data");
                console.log(response.data);
                setClientes(response.data);
                setAuxClientes(response.data);
                const cli = response.data.map((cliente) => { return { email: cliente.donador } });
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
                                    console.log(value.email);
                                    setFilterClient(value.email);
                                    setClientes(auxClientes.filter((cliente) => cliente.donador === value.email));


                                } else {
                                    setFilterClient(null);
                                    setClientes(auxClientes);
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
                                <TableCell>Firma Conductor</TableCell>
                                <TableCell>Firma Donador</TableCell>
                                <TableCell>Imprimir Talon</TableCell>
                                <TableCell>Editar</TableCell>

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

export default DriverOrderAssignedTable;
