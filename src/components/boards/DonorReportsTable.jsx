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
    DialogContentText,
    TextField,
    TablePagination,
    Divider,
    Collapse
} from "@mui/material";
import { Add, Download, FilterList, Delete, Search, Visibility, Check, Edit, Draw, SaveAlt, Close, Favorite, Recycling, KeyboardArrowDown } from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect, useRef } from "react";
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
import CreateDonorReportModal from "../modals/CreateDonorReportModal";
import DonorSubtable from "./DonorSubtable";
import DonorReportsFiltersModal from "../modals/DonorReportsFiltersModal";
import DeleteDonorReportsModal from "../modals/DeleteDonorReportModal";




function Toolbar({ selected, setOpenFiltersModal, setObjectsToDelete, filtersApplied, filteredData, allData, setVisibleData }) {
    const [openModalCreateReport, setOpenModalCreateReport] = useState(false);
    const {
        setOpenModalDeleteReport,
    } = useContext(TodoContext);
    const [exportOptionsAchorEl, setExportOptionsAnchorEl] = useState(null);
    if (selected.length > 0) return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={2} bgcolor={theme.palette.primary.light}>
            <Typography variant="h4" component="div" color="secondary" sx={{ p: 2 }}>
                {`${selected.length} ${selected.length === 1 ? 'seleccionado' : 'seleccionados'}`}
            </Typography>
            <Box>

            </Box>
        </Box>
    )

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={2}>
            <Typography variant="h4" component="div" color="primary" sx={{ p: 2 }}>
                Reportes de donadores
            </Typography>
            <Box>
                <SearchField filteredData={filteredData} setVisibleData={setVisibleData} />
                <Badge color="error" overlap="circular" badgeContent=" " variant="dot" invisible={!filtersApplied}>
                    <Button variant="text" size="large" color="secondary" startIcon={<FilterList />} sx={{ m: 0, mx: 2 }} onClick={() => setOpenFiltersModal(true)}>Filtrar</Button>
                </Badge>
                <Button variant="contained" size="large" color="primary" startIcon={<Add />} sx={{ m: 2 }} onClick={() => { setOpenModalCreateReport(true) }}>Nuevo</Button>
            </Box>
            <CreateDonorReportModal isOpen={openModalCreateReport} setOpen={setOpenModalCreateReport} />
        </Box>
    )

}


function SearchField({ filteredData, setVisibleData }) {
    const [showSearch, setShowSearch] = useState(false);
    const searchInputRef = useRef();
    const searchButtonRef = useRef();
    const [searchValue, setSearchValue] = useState("");
    useEffect(() => {
        if (showSearch) {
            searchInputRef.current.focus();
        }
    }, [showSearch])

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            const search = searchValue.trim().toLowerCase();
            if (search === "") {
                setVisibleData(filteredData);
            } else {
                const newData = filteredData.filter((report) => {
                    return report.email.toLowerCase().includes(search) ||
                        report.first_name.toLowerCase().includes(search) ||
                        report.last_name.toLowerCase().includes(search) ||
                        report.phone.toLowerCase().includes(search)
                })
                setVisibleData(newData);
            }
        }
    }

    return (
        <>
            <ClickAwayListener onClickAway={(e) => {
                if (e.target !== searchButtonRef.current && searchValue === "") {
                    setShowSearch(false)
                    setVisibleData(filteredData)
                }
            }}>
                <TextField
                    color="info"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    id="search-field"
                    inputRef={searchInputRef}
                    label="Búscar"
                    variant="standard"
                    size="small"
                    sx={{ mt: 1, width: showSearch ? "25rem" : 0, transition: 'all 300ms ease-in' }}
                    placeholder="Nombre, Apellido, Correo electrónico, Teléfono"
                    onKeyUp={handleSearch}
                />

            </ClickAwayListener>
            <IconButton
                color={showSearch ? "error" : "info"}
                ref={searchButtonRef} onClick={(e) => {
                    e.stopPropagation()
                    if (!showSearch) return setShowSearch(true)
                    setSearchValue("")
                    setVisibleData(filteredData)
                    setShowSearch(false)
                }}>
                {showSearch ? <Close /> : <Search />}
            </IconButton>
        </>
    )
}


export default function DonorReportsTable({ data }) {
    const [filteredData, setFilteredData] = useState(data);
    const [reportsToDelete, setReportsToDelete] = useState([]);
    const [reportToEdit, setReportToEdit] = useState({});
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [visibleData, setVisibleData] = useState(data);
    const [signType, setSignType] = useState("Generador");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showCompleteInfo, setShowCompleteInfo] = useState(null);

    //console.log(data)
    const {
        setTextOpenModalText,
        openModalEditReport,
        setOpenModalDeleteReport,
        setOpenModalEditReport,
        openModalText,
        textOpenModalText,
        setOpenModalText,
        setOpenModalEditResidueReport,
        setOpenModalEditFirma,
        setUpdateReportInfo,
    } = useContext(TodoContext);
    const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
    const [selected, setSelected] = useState([]);
    const [generalCheckboxStatus, setGeneralCheckboxStatus] = useState("unchecked");
    const [openFiltersModal, setOpenFiltersModal] = useState(false);
    const [dataForFilters, setDataForFilters] = useState({
            donador_signature: [],
            recollection_signature: [] 
        })

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    const handleSavePDF = async (report) => {
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
            generateReportPDF(report, data, qrImage);
        } else {
            setOpenModalText(true);
            setTextOpenModalText(
                "No se puede generar el reporte, aun no se han firmado todos los campos"
            );
        }
    }

    const onEditDonorSign = (id) => {
        setReportToEdit(id);
        setSignType("Donador");
        setOpenModalEditFirma(true);
    }

    const onEditReceiverSign = (id) => {
        setReportToEdit(id);
        setSignType("Recolector");
        setOpenModalEditFirma(true);
    }

    const handleShowCompleteInfo = (id) => {
        if (showCompleteInfo === id) {
            setShowCompleteInfo(null);
        } else {
            setShowCompleteInfo(id);
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
        setFilteredData(data);
        setVisibleData(data);
        if (data.length > 0) {
            const donador_signature = [...new Set(data.map((report) => report.donador_signature))];
            const recollection_signature = [...new Set(data.map((report) => report.recollection_signature))];

            
            setDataForFilters({
                donador_signature,
                recollection_signature 
            })
        }
    }, [data])


    return (
        <Box sx={{ width: '100%', mb: '3rem' }}>
            <Paper>
                <Toolbar selected={selected} allData={data} filteredData={filteredData} setOpenFiltersModal={setOpenFiltersModal} setObjectsToDelete={setReportsToDelete} filtersApplied={filtersApplied} setVisibleData={setVisibleData} />
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: theme.palette.background.default }}>
                            <TableRow>
                                <TableCell>
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
                                        <Typography variant="subtitle2">Donador</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Firma donador</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Firma receptor</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Talón</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Borrar</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleData.length === 0 ?
                                <TableRow key="NoReports">
                                    <TableCell colSpan={18}>
                                        <Typography variant="h6" color="textSecondary" align="center">
                                            No se encontraron reportes
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                : visibleData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((report, index) => (
                                        <>
                                            <TableRow
                                                hover
                                                key={report.id_report}
                                                sx={{ cursor: 'pointer',
                                                    bgcolor: showCompleteInfo === report.id_report && "primary.light",
                                                    transition: "all 0.3s"
                                                 }}
                                                onClick={(e)=>{
                                                    e.stopPropagation()
                                                    handleShowCompleteInfo(report.id_report)
                                                
                                                }}
                                            >
                                                <TableCell sx={{borderBottomWidth: showCompleteInfo === report.id_report? 0:1}}>
                                                    <IconButton color="secondary" onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleShowCompleteInfo(report.id_report)
                                                    }}>
                                                        <KeyboardArrowDown sx={{
                                                            transform: showCompleteInfo === report.id_report ? "rotate(180deg)" : "rotate(0deg)",
                                                            transition: "transform 0.3s"
                                                        }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={{borderBottomWidth: showCompleteInfo === report.id_report? 0:1}}>{report.id_report}</TableCell>
                                                <TableCell sx={{borderBottomWidth: showCompleteInfo === report.id_report? 0:1}}>{report.email}</TableCell>
                                                <TableCell sx={{borderBottomWidth: showCompleteInfo === report.id_report? 0:1}}>
                                                    <Button
                                                        startIcon={<Draw />}
                                                        variant="contained"
                                                        size="small"
                                                        color={report.donador_signature ? "success" : "warning"}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onEditDonorSign(report.id_report)
                                                        }}
                                                    >
                                                        Firmar
                                                    </Button>
                                                </TableCell>

                                                <TableCell sx={{borderBottomWidth: showCompleteInfo === report.id_report? 0:1}}>
                                                    <Button
                                                        startIcon={<Draw />}
                                                        variant="contained"
                                                        size="small"
                                                        color={report.recollection_signature ? "success" : "warning"}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onEditReceiverSign(report.id_report)
                                                        }}
                                                    >
                                                        Firmar
                                                    </Button>
                                                </TableCell>
                                                <TableCell sx={{borderBottomWidth: showCompleteInfo === report.id_report? 0:1}}>
                                                    <Button
                                                        startIcon={<SaveAlt />}
                                                        variant="contained"
                                                        size="small"
                                                        color={report.donador_signature && report.recollection_signature ? "success" : "warning"}
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            await handleSavePDF(report)
                                                        }}
                                                    >
                                                        Generar talón
                                                    </Button>
                                                </TableCell>
                                                <TableCell sx={{borderBottomWidth: showCompleteInfo === report.id_report? 0:1}}>
                                                    <IconButton color="error" onClick={(e) => {
                                                        e.stopPropagation()
                                                        setReportsToDelete([report.id_report])
                                                        setOpenModalDeleteReport(true)
                                                    }} >
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottomWidth: showCompleteInfo === report.id_report? 1:0}} colSpan={12}>
                                                    <Collapse in={showCompleteInfo === report.id_report} timeout="auto" unmountOnExit>
                                                        <DonorSubtable report={report} />
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={visibleData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <ModalFirmar type={signType} id={reportToEdit} />
            <ModalResidueReport report={reportToEdit} />
            <DeleteDonorReportsModal reports={reportsToDelete} />
            <DonorReportsFiltersModal isOpen={openFiltersModal} users={data} setOpen={setOpenFiltersModal} data={dataForFilters} setFilteredData={setFilteredData} objects={data} setFiltersApplied={setFiltersApplied} />
        </Box>
    );
}