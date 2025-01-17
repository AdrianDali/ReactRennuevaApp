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
    TableSortLabel,
    IconButton,
    Badge,
    TextField,
    TablePagination,
    Collapse,
    Menu,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText

} from "@mui/material";
import { Add, FilterList, Delete, Search, Draw, SaveAlt, Close, KeyboardArrowDown, MoreVert } from "@mui/icons-material";
import SearchingModal from "../modals/SearchingModal";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect, useRef } from "react";
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { ModalFirmar } from "../../pages/ModalFirmar";
import { ModalResidueReport } from "../../pages/ModalResidueReport";
import getReportInfo from "../../services/getReportInfo";
import generateQR from "../../services/generateQR";
import CreateDonorReportModal from "../modals/CreateDonorReportModal";
import DonorSubtable from "./DonorSubtable";
import DonorReportsFiltersModal from "../modals/DonorReportsFiltersModal";
import DeleteDonorReportsModal from "../modals/DeleteDonorReportModal";
import generateDonorReportPDF from "../../services/generateDonorReportPDF";
import generateDonorTalonPDF from "../../services/DonorTalonReportPDF";
import sortData from "../../helpers/SortData";
import saveTalonPDF from "../../services/saveTalonPDF";




function Toolbar({ selected, setOpenFiltersModal, filtersApplied, filteredData, setVisibleData }) {
    const [openModalCreateReport, setOpenModalCreateReport] = useState(false);
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
            <Typography variant="h4" component="div" color="primary" sx={{ p: 2, flexGrow: 0, flexShrink: 1 }}>
                Reportes de donadores 
            </Typography>
            <Box sx={{ flexShrink: 0, flexGrow: 1, display: "flex", flexDirection: "row", justifyContent: "end" }}>
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

function MobileToolbar({
    selected,
    setOpenFiltersModal,
    filtersApplied,
    filteredData,
    allData,
    setVisibleData,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openSearchModal, setOpenSearchModal] = useState(false)
    const [openModalCreateReport, setOpenModalCreateReport] = useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilter = (e) => {
        setOpenFiltersModal(true);
        handleClose();
    }

    const handleSearch = (e) => {
        setOpenSearchModal(true);
        handleClose();
    }

    return (
        <>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                py={2}
            >
                <Typography variant="h4" component="div" color="primary" sx={{ p: 2, flexShrink: 2 }}>
                    Responsivas en proceso
                </Typography>
                <Box sx={{ flexGrow: 1, flexShrink: 0, display: "flex", flexDirection: "row", justifyContent: "end" }}>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '15ch',
                                },
                            },
                        }}
                    >
                        <MenuList>
                            <MenuItem onClick={handleFilter} color="info">
                                <ListItemIcon >
                                    <Add />
                                </ListItemIcon>
                                <ListItemText primary="Nuevo" />
                            </MenuItem>
                            <Badge
                                color="error"
                                overlap="circular"
                                badgeContent=" "
                                variant="dot"
                                invisible={!filtersApplied}
                            >

                                <MenuItem onClick={handleFilter} color="info">
                                    <ListItemIcon >
                                        <FilterList />
                                    </ListItemIcon>
                                    <ListItemText primary="Filtrar" />
                                </MenuItem>
                            </Badge>
                            <MenuItem onClick={handleSearch}>
                                <ListItemIcon>
                                    <Search />
                                </ListItemIcon>
                                <ListItemText primary="Buscar" />
                            </MenuItem>
                        </MenuList>

                    </Menu>
                </Box>
            </Box>
            <SearchingModal isOpen={openSearchModal} setOpen={setOpenSearchModal} filteredData={filteredData} setVisibleData={setVisibleData} />
            <CreateDonorReportModal isOpen={openModalCreateReport} setOpen={setOpenModalCreateReport} />
        </>
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
                    return report.email_usuario.toLowerCase().includes(search) ||
                        report.nombre_real_usuario.toLowerCase().includes(search) ||
                        report.apellido_usuario.toLowerCase().includes(search) ||
                        report.telefono_usuario.toLowerCase().includes(search)
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
                    label="Buscar"
                    variant="standard"
                    size="small"
                    sx={{ mt: 1, width: showSearch ? "15rem" : 0, transition: 'all 300ms ease-in' }}
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
    const [orderBy, setOrderBy] = useState("id_report");
    const [order, setOrder] = useState("desc");
    const [sortedData, setSortedData] = useState([]);

    const {
        setTextOpenModalText,
        setOpenModalDeleteReport,
        setOpenModalText,
        setOpenModalEditFirma,
    } = useContext(TodoContext);
    const [selected, setSelected] = useState([]);
    const [openFiltersModal, setOpenFiltersModal] = useState(false);
    const [dataForFilters, setDataForFilters] = useState({
        donador_signature: [],
        recollection_signature: []
    })

    const [desktop, setDesktop] = useState(window.innerWidth > 940);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 940) {
                setDesktop(true);
            } else {
                setDesktop(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
        setSelected([]);
        setFilteredData(data);
        setVisibleData(data);
        if (data.length > 0) {
            const firma_responsiva_generador = [...new Set(data.map((report) => report.firma_responsiva_generador))];
            const firma_responsiva_receptor = [...new Set(data.map((report) => report.firma_responsiva_receptor))];


            setDataForFilters({
                firma_responsiva_generador,
                firma_responsiva_receptor
            })
        }
    }, [data])

    useEffect(() => {
        setSortedData(sortData(visibleData, orderBy, order));
    }, [visibleData, order, orderBy])


    return (
        <Box sx={{ width: '100%', mb: '3rem' }}>
            <Paper>
                {desktop ? (
                    <Toolbar
                        selected={selected}
                        allData={data}
                        filteredData={filteredData}
                        setOpenFiltersModal={setOpenFiltersModal}
                        setObjectsToDelete={setReportsToDelete}
                        filtersApplied={filtersApplied}
                        setVisibleData={setVisibleData}
                    />
                ) : (
                    <MobileToolbar
                        selected={selected}
                        allData={data}
                        filteredData={filteredData}
                        setOpenFiltersModal={setOpenFiltersModal}
                        setObjectsToDelete={setReportsToDelete}
                        filtersApplied={filtersApplied}
                        setVisibleData={setVisibleData}
                    />
                )}
                <TableContainer sx={{ minHeight: "calc(100vh - 350px)" }}>
                    <Table>
                        <TableHead sx={{ bgcolor: theme.palette.background.default }}>
                            <TableRow>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={order}
                                        onClick={() => {
                                            setOrderBy("id_report")
                                            setOrder(order === "asc" ? "desc" : "asc")
                                        }}
                                        active={orderBy === "id_report" ? true : false}
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
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Fecha</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Centro Acopio</Typography>
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
                            {sortedData.length === 0 ?
                                <TableRow key="NoReports">
                                    <TableCell colSpan={18}>
                                        <Typography variant="h6" color="textSecondary" align="center">
                                            No se encontraron reportes
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                : sortedData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((report, index) => (
                                        <>
                                            <TableRow
                                                hover
                                                key={report.id_report}
                                                sx={{
                                                    cursor: 'pointer',
                                                    bgcolor: showCompleteInfo === report.id_report && "primary.light",
                                                    transition: "all 0.3s"
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleShowCompleteInfo(report.id_report)

                                                }}
                                            >
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>
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
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>{report.id_report}</TableCell>
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>{report.nombre_usuario}</TableCell>
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>{new Date(report.fecha_inicio_reporte).toLocaleDateString("es-MX", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric"
                                                })}</TableCell>
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>{report.centro_recoleccion}</TableCell>
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>
                                                    <Button
                                                        startIcon={<Draw />}
                                                        variant="contained"
                                                        size="small"
                                                        color={report.firma_responsiva_generador ? "success" : "warning"}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onEditDonorSign(report.id_report)
                                                        }}
                                                    >
                                                        Firmar
                                                    </Button>
                                                </TableCell>

                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>
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
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>
                                                    <Button
                                                        startIcon={<SaveAlt />}
                                                        variant="contained"
                                                        size="small"
                                                        color={report.firma_responsiva_generador && report.firma_responsiva_receptor ? "success" : "warning"}
                                                        onClick={async (e) => {
                                                            console.log(report)
                                                            e.stopPropagation();
                                                            await saveTalonPDF(report, () => {
                                                                setOpenModalText(true);
                                                                setTextOpenModalText(
                                                                    "No se puede generar el reporte, aun no se han firmado todos los campos"
                                                                );
                                                            })
                                                            //await handleSaveTalonPDF(report)
                                                        }}
                                                    >
                                                        Generar Talón
                                                    </Button>
                                                </TableCell>
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === report.id_report ? 0 : 1 }}>
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
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottomWidth: showCompleteInfo === report.id_report ? 1 : 0 }} colSpan={12}>
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
                    count={sortedData.length}
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