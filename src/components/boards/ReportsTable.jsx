import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Box,
    Typography,
    Button,
    Checkbox,
    TableSortLabel,
    IconButton,
    Menu,
    MenuItem,
    MenuList,
    ListItemIcon,
    ListItemText,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from "@mui/material";
import { Add, Download, FilterList, Delete, Search, Visibility, Check, Edit, Draw, SaveAlt } from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect, createContext } from "react";
import { ModalGenerator } from "../../pages/ModalGenerator";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import DeleteGeneratorModal from "../modals/DeleteGeneratorModal";
import { generateExcelFromJson } from "../../services/Excel";
import { ModalReport } from "../../pages/ModalReport";
import dateFormater from "../../services/dateFormater";
import { ModalFirmar } from "../../pages/ModalFirmar";
import { ModalResidueReport } from "../../pages/ModalResidueReport";
import validateReport from "../../services/validateReport";
import getReportInfo from "../../services/getReportInfo";
import generateReportPDF from "../../services/generateReportPDF";
import generateQR from "../../services/generateQR";
import DeleteReportsModal from "../modals/DeleteReportsModal";
import ReportsFiltersModal from "../modals/ReportsFiltersModal";




function RowContextMenu({ anchorEl, setAnchorEl }) {
    const {
        setOpenModalEditReport,
        setOpenModalDeleteReport
    } = useContext(TodoContext);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setOpenModalEditReport(true);
        handleClose();
    }

    const handleDelete = () => {
        setOpenModalDeleteReport(true);
        handleClose();
    }


    return (
        <Menu anchorEl={anchorEl} open={open}>
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <Edit />
                        </ListItemIcon>
                        <ListItemText primary="Editar" />
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <ListItemIcon>
                            <Delete color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Borrar" />
                    </MenuItem>
                </MenuList>
            </ClickAwayListener>
        </Menu>
    )
}


function ExportOptionsMenu({ anchorEl, setAnchorEl, allData, visibleData, selectedData }) {
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExportAll = () => {
        //console.log(allData)
        generateExcelFromJson(allData, "Reportes");
        handleClose();
    }

    const handleExportVisible = () => {
        //console.log(visibleData)
        generateExcelFromJson(visibleData, "Reportes");
        handleClose();
    }

    const handleExportSelected = () => {
        //console.log(selectedData)
        const dataToExport = allData.filter((report) => selectedData.includes(report.id_report));
        //console.log(dataToExport)
        generateExcelFromJson(dataToExport, "Reportes");
        handleClose();
    }

    return (
        <Menu anchorEl={anchorEl} open={open}>
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                    <MenuItem onClick={handleExportAll}>
                        <ListItemIcon>
                            <Download />
                        </ListItemIcon>
                        <ListItemText primary="Exportar todos" />
                    </MenuItem>
                    <MenuItem onClick={handleExportVisible}>
                        <ListItemIcon>
                            <Visibility />
                        </ListItemIcon>
                        <ListItemText primary="Exportar visibles" />
                    </MenuItem>
                    <MenuItem onClick={handleExportSelected}>
                        <ListItemIcon>
                            <Check />
                        </ListItemIcon>
                        <ListItemText primary="Exportar selección" />
                    </MenuItem>
                </MenuList>
            </ClickAwayListener>
        </Menu>
    )
}


function Toolbar({ selected, setOpenFiltersModal, setObjectsToDelete, filtersApplied, visibleData, allData }) {

    const {
        setOpenModalDeleteReport,
        setOpenModalCreateReport,
    } = useContext(TodoContext);
    const [exportOptionsAchorEl, setExportOptionsAnchorEl] = useState(null);
    if (selected.length > 0) return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={2} bgcolor={theme.palette.primary.light}>
            <Typography variant="h4" component="div" color="secondary" sx={{ p: 2 }}>
                {`${selected.length} ${selected.length === 1 ? 'seleccionado' : 'seleccionados'}`}
            </Typography>
            <Box>
                <Button variant="outlined" size="large" color="success" startIcon={<Download />} sx={{ m: 2 }} onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}>Exportar</Button>
                <Button variant="contained" size="large" color="error" startIcon={<Delete />} sx={{ m: 2 }} onClick={e => {
                    e.stopPropagation()
                    setOpenModalDeleteReport(true)
                    setObjectsToDelete(selected)
                }}>Borrar</Button>
            </Box>
            <ExportOptionsMenu selectedData={selected} visibleData={visibleData} allData={allData} anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl} />
        </Box>
    )

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={2}>
            <Typography variant="h4" component="div" color="primary" sx={{ p: 2 }}>
                Reportes
            </Typography>
            <Box>
                <IconButton color="info" ><Search /></IconButton>
                <Badge color="error" overlap="circular" badgeContent=" " variant="dot" invisible={!filtersApplied}>
                    <Button variant="text" size="large" color="secondary" startIcon={<FilterList />} sx={{ m: 0, mx: 2 }} onClick={() => setOpenFiltersModal(true)}>Filtrar</Button>
                </Badge>
                <Button variant="outlined" size="large" color="success" startIcon={<Download />} sx={{ m: 2 }} onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}>Exportar</Button>
                <Button variant="contained" size="large" color="primary" startIcon={<Add />} sx={{ m: 2 }} onClick={() => { setOpenModalCreateReport(true) }}>Nuevo</Button>
                <ExportOptionsMenu selectedData={selected} visibleData={visibleData} allData={allData} anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl} />
            </Box>
        </Box>
    )

}



export default function ReportsTable({ data }) {
    const [visibleData, setVisibleData] = useState(data);
    const [reportsToDelete, setReportsToDelete] = useState([]);
    const [reportToEdit, setReportToEdit] = useState({});
    const [filtersApplied, setFiltersApplied] = useState(false);
    const dataUser = useAuth();
    const [signType, setSignType] = useState("Generador");
    console.log(data)
    const {
        setTextOpenModalText,
        openModalCreateReport,
        setOpenModalCreateReport,
        openModalEditReport,
        setOpenModalDeleteReport,
        setOpenModalEditReport,
        openModalText,
        textOpenModalText,
        setOpenModalText,
        setOpenModalCreateFirma,
        openModalEditFirma,
        setOpenModalEditResidueReport,
        setOpenModalEditFirma, 
        openModalDeleteFirma, 
        setOpenModalDeleteFirma,
        openModalCreateFirmaReceptor,
        setUpdateReportInfo,
        setOpenModalCreateFirmaReceptor,
        openModalEditFirmaReceptor,
        setOpenModalEditFirmaReceptor,
        openModalDeleteFirmaReceptor, 
        setOpenModalDeleteFirmaReceptor,
    } = useContext(TodoContext);
    const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
    const [selected, setSelected] = useState([]);
    const [generalCheckboxStatus, setGeneralCheckboxStatus] = useState("unchecked");
    const [openFiltersModal, setOpenFiltersModal] = useState(false);
    const [dataForFilters, setDataForFilters] = useState({
        colonia_usuario: [],
        ciudad_usuario: [],
        estado_usuario: [],
        cp_usuario: [],
        fecha_inicio_reporte: [],
        centro_recoleccion: [],
        centro_reciclaje: [],
        compania_usuario: [],
        firma_responsiva_generador: [],
        firma_responsiva_receptor: [],
        residuos_agregados: [],
        transportista: [],
        calle_reporte: [],
        colonia_reporte: [],
        ciudad_reporte: [],
        estado_reporte: [],
        cp_reporte: [],
        status_reporte: []
    });


    const handleGenaeralCheckboxClick = (e) => {
        e.stopPropagation()
        if (generalCheckboxStatus === "checked") {
            setGeneralCheckboxStatus("unchecked");
        } else {
            setGeneralCheckboxStatus("checked");
        }
    }

    const handleSavePDF = async (report) =>{
            const validate = await validateReport(
              report.id_report
            )
            if (validate == true) {
              const data = await getReportInfo(
                report.id_report
              );

              let key_centro = "";
              if (
                data[0].key_centro_reciclaje !=
                null
              ) {
                key_centro =
                  data[0].key_centro_reciclaje;
              }
              if (
                data[0].key_centro_recoleccion !=
                null
              ) {
                key_centro =
                  data[0].key_centro_recoleccion;
              }

              const folio_busqueda =
                data[0].key_grupo_usuario +
                "-" +
                key_centro +
                "-" +
                report.id_report;

              const qrImage = await generateQR(
                "https://rewards.rennueva.com/tracking-external/" +
                  folio_busqueda // Aquí deberías poner la URL correcta para el reporte
              );
              /*
              console.log("DATA de la funcion1");
              console.log(report);
              console.log(
                "######SDASDASD el reporte firmado"
              );
              console.log(data[0]);
              */
              generateReportPDF(report, data, qrImage);
            } else {
              setOpenModalText(true);
              setTextOpenModalText(
                "No se puede generar el reporte, aun no se han firmado todos los campos"
              );
            }
          }

    const onEditGeneratorSign = (id) => {
        setReportToEdit(id);
        setSignType("Generador");
        setOpenModalEditFirma(true);
    }

    const onEditReceiverSign = (id) => {
        setReportToEdit(id);
        setSignType("Receptor");
        setOpenModalEditFirma(true);
    }

    const handleEditResidues = (report) => {
        setReportToEdit(report);
        setOpenModalEditResidueReport(true);
    }

    const handleGeneralCheckboxChange = (e) => {
        if (e.target.checked) {
            setSelected(data.map((report) => report.id_report));
        } else if (e.target.indeterminate) {
            setSelected(selected);
        } else {
            setSelected([]);
        }
    }


    const isRowSelected = (id) => selected.indexOf(id) !== -1;

    const toggleSelected = (id) => {
        if (isRowSelected(id)) {
            setSelected(selected.filter((selectedId) => selectedId !== id));
        } else {
            setSelected([...selected, id]);
        }
    }


    useEffect(() => {
        if (selected.length === data.length && data.length !== 0) {
            setGeneralCheckboxStatus("checked");
        } else if (selected.length === 0) {
            setGeneralCheckboxStatus("unchecked");
        } else {
            setGeneralCheckboxStatus("indeterminate");
        }
    }, [selected]);



    useEffect(() => {
        setSelected([]);
        setVisibleData(data);
        if (data.length > 0) {
            const colonia_usuario = [...new Set(data.map((report) => report.colonia_usuario))];
            const ciudad_usuario = [...new Set(data.map((report) => report.ciudad_usuario))];
            const estado_usuario = [...new Set(data.map((report) => report.estado_usuario))];
            const cp_usuario = [...new Set(data.map((report) => report.cp_usuario))];
            const fecha_inicio_reporte = [...new Set(data.map((report) => new Date(report.fecha_inicio_reporte)))];
            const centro_recoleccion = [...new Set(data.map((report) => report.centro_recoleccion))];
            const centro_reciclaje = [...new Set(data.map((report) => report.centro_reciclaje))];
            const compania_usuario = [...new Set(data.map((report) => report.compania_usuario))];
            const firma_responsiva_generador = [...new Set(data.map((report) => report.firma_responsiva_generador))];
            const firma_responsiva_receptor = [...new Set(data.map((report) => report.firma_responsiva_receptor))];
            const residuos_agregados = [...new Set(data.map((report) => report.residuos_agregados))];
            const transportista = [...new Set(data.map((report) => report.transportista))];
            const calle_reporte = [...new Set(data.map((report) => report.calle_reporte))];
            const colonia_reporte = [...new Set(data.map((report) => report.colonia_reporte))];
            const ciudad_reporte = [...new Set(data.map((report) => report.ciudad_reporte))];
            const estado_reporte = [...new Set(data.map((report) => report.estado_reporte))];
            const cp_reporte = [...new Set(data.map((report) => report.cp_reporte))];
            const status_reporte = [...new Set(data.map((report) => report.status_reporte))];
            setDataForFilters({
                colonia_usuario,
                ciudad_usuario,
                estado_usuario,
                cp_usuario,
                fecha_inicio_reporte,
                centro_recoleccion,
                centro_reciclaje,
                compania_usuario,
                firma_responsiva_generador,
                firma_responsiva_receptor,
                residuos_agregados,
                transportista,
                calle_reporte,
                colonia_reporte,
                ciudad_reporte,
                estado_reporte,
                cp_reporte,
                status_reporte
            })
        }
    }, [data])


    return (
        <Box sx={{ width: '100%', mb: '3rem' }}>
            <Paper>
                <Toolbar selected={selected} allData={data} visibleData={visibleData} setOpenFiltersModal={setOpenFiltersModal} setObjectsToDelete={setReportsToDelete} filtersApplied={filtersApplied} />
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: theme.palette.background.default }}>
                            <TableRow>
                                <TableCell>
                                    <Checkbox
                                        checked={generalCheckboxStatus === "checked" ? true : false}
                                        onClick={handleGenaeralCheckboxClick}
                                        indeterminate={generalCheckboxStatus === "indeterminate" ? true : false}
                                        onChange={handleGeneralCheckboxChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">ID</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Nombre</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Apellidos</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">RFC</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Correo electrónico</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Teléfono</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Callle</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Colonia</Typography>
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Código Postal</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Estado</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Ciudad</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Fecha de inicio</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Firma generador</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Residuos</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Firma receptor</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">PDF</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Editar</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Borrar</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleData.map((report, index) => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    key={report.id_report}
                                    selected={isRowSelected(report.id_report)}
                                    sx={{ cursor: 'pointer' }}
                                    aria-checked={isRowSelected(report.id_report) ? true : false}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleSelected(report.id_report)
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setReportToEdit(report)
                                        setReportsToDelete([report.id_report])
                                        setRowContextMenuAnchorEl(e.target);
                                    }}

                                >
                                    <TableCell>
                                        <Checkbox
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleSelected(report.id_report)
                                            }}
                                            checked={isRowSelected(report.id_report)}
                                            inputProps={{
                                                'aria-labelledby': report.id_report,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{report.id_report}</TableCell>
                                    <TableCell>{report.nombre_real_usuario}</TableCell>
                                    <TableCell>{report.apellido_usuario}</TableCell>
                                    <TableCell>{report.rfc_usuario}</TableCell>
                                    <TableCell>{report.email_usuario}</TableCell>
                                    <TableCell>{report.telefono_usuario}</TableCell>
                                    <TableCell>{report.calle_usuario}</TableCell>
                                    <TableCell>{report.colonia_usuario}</TableCell>
                                    <TableCell>{report.cp_usuario}</TableCell>
                                    <TableCell>{report.ciudad_usuario}</TableCell>
                                    <TableCell>{report.estado_usuario}</TableCell>
                                    <TableCell>{dateFormater(report.fecha_inicio_reporte)}</TableCell>
                                    <TableCell>
                                        <Button 
                                            startIcon={<Draw/>} 
                                            variant="contained" 
                                            size="small" 
                                            color={report.firma_responsiva_generador ? "success" : "warning"}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onEditGeneratorSign(report.id_report)
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
                                            color={report.residuos_agregados ? "success" : "warning"}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditResidues(report)
                                            }}
                                            >
                                            Agregar
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            startIcon={<Draw />} 
                                            variant="contained" 
                                            size="small" 
                                            color={report.firma_responsiva_receptor ? "success" : "warning"}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onEditReceiverSign(report.id_report)
                                            }}
                                            >
                                            Firmar
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            startIcon={<SaveAlt/>} 
                                            variant="contained" 
                                            size="small" 
                                            color={report.firma_responsiva_generador && report.firma_responsiva_receptor && report.residuos_agregados? "success" : "warning"}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await handleSavePDF(report)
                                            }}
                                            >
                                            Descargar
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={(e) => {
                                            e.stopPropagation()
                                            setReportToEdit(report)
                                            setOpenModalEditReport(true)
                                        }}>
                                            <Edit />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="error" onClick={(e) => {
                                            e.stopPropagation()
                                            setReportsToDelete([report.id_report])
                                            setOpenModalDeleteReport(true)
                                        }} >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <ModalFirmar type={signType} id={reportToEdit}/>
            <ModalResidueReport report={reportToEdit}/>
            <DeleteReportsModal reports={reportsToDelete}/>
            <ReportsFiltersModal isOpen={openFiltersModal} setOpen={setOpenFiltersModal} data={dataForFilters} setVisibleData={setVisibleData} objects={data} setFiltersApplied={setFiltersApplied} />
            <RowContextMenu anchorEl={rowContextMenuAnchorEl} setAnchorEl={setRowContextMenuAnchorEl} />
            {openModalCreateReport && <ModalReport mode={"CREAR"} />}
            {openModalEditReport && <ModalReport mode={"EDITAR"} report={reportToEdit} />}
            {openModalText && (
                <Dialog
                    open={openModalText}
                    onClose={() => {
                        setOpenModalText(false)
                        setUpdateReportInfo(prev => !prev)}}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {textOpenModalText}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {textOpenModalText}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModalText(false)}>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
}