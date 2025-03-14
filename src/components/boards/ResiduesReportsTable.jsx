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
    Collapse,
} from "@mui/material";
import {
    Add,
    Download,
    FilterList,
    Delete,
    Search,
    Visibility,
    Check,
    Edit,
    Close,
    MoreVert
} from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { generateExcelFromJson } from "../../services/Excel";
import { ModalReport } from "../../pages/ModalReport";
import { ModalResidueReport } from "../../pages/ModalResidueReport";
import DeleteReportsModal from "../modals/DeleteReportsModal";
import ShortenedReportsFiltersModal from "../modals/ShortenedReportsFiltersModal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ModalFinishReport } from "../../pages/ModalFinishReport";
import ShortenedReportInfo from "./ShortenedReportInfo";
import SearchingModal from "../modals/SearchingModal";
import sortData from "../../helpers/SortData";

function RowContextMenu({ anchorEl, setAnchorEl }) {
    const { setOpenModalEditReport, setOpenModalDeleteReport } =
        useContext(TodoContext);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setOpenModalEditReport(true);
        handleClose();
    };

    const handleDelete = () => {
        setOpenModalDeleteReport(true);
        handleClose();
    };

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
    );
}

function Toolbar({
    selected,
    setOpenFiltersModal,
    filtersApplied,
    filteredData,
    allData,
    setVisibleData,
}) {


    return (
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
                <SearchField
                    filteredData={filteredData}
                    setVisibleData={setVisibleData}
                />
                <Badge
                    color="error"
                    overlap="circular"
                    badgeContent=" "
                    variant="dot"
                    invisible={!filtersApplied}
                >
                    <Button
                        variant="text"
                        size="large"
                        color="secondary"
                        startIcon={<FilterList />}
                        sx={{ m: 0, mx: 2 }}
                        onClick={() => setOpenFiltersModal(true)}
                    >
                        Filtrar
                    </Button>
                </Badge>
            </Box>
        </Box>
    );
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
    }, [showSearch]);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            const search = searchValue.trim().toLowerCase();
            if (search === "") {
                setVisibleData(filteredData);
            } else {
                const newData = filteredData.filter((report) => {
                    return (
                        report.nombre_real_usuario.toLowerCase().includes(search) ||
                        report.apellido_usuario.toLowerCase().includes(search) ||
                        report.rfc_usuario.toLowerCase().includes(search) ||
                        report.email_usuario.toLowerCase().includes(search) ||
                        report.telefono_usuario.toLowerCase().includes(search) ||
                        report.calle_usuario.toLowerCase().includes(search) ||
                        report.colonia_usuario.toLowerCase().includes(search)
                        //report.grupo_usuario.toLowerCase().includes(search)
                    );
                });
                setVisibleData(newData);
            }
        }
    };

    return (
        <>
            <ClickAwayListener
                onClickAway={(e) => {
                    if (e.target !== searchButtonRef.current && searchValue === "") {
                        setShowSearch(false);
                        setVisibleData(filteredData);
                    }
                }}
            >
                <TextField
                    color="info"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    id="search-field"
                    inputRef={searchInputRef}
                    label="Buscar"
                    variant="standard"
                    size="small"
                    sx={{
                        width: showSearch ? "15rem" : 0,
                        transition: "all 300ms ease-in",
                        maxWidth: "100%",
                    }}
                    placeholder="Nombre, Apellido, Correo electrónico, RFC, Teléfono"
                    onKeyUp={handleSearch}
                />
            </ClickAwayListener>
            <IconButton
                color={showSearch ? "error" : "info"}
                ref={searchButtonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!showSearch) return setShowSearch(true);
                    setSearchValue("");
                    setVisibleData(filteredData);
                    setShowSearch(false);
                }}
            >
                {showSearch ? <Close /> : <Search />}
            </IconButton>
        </>
    );
}

export default function ResiduesReportsTable({ data }) {
    const [filteredData, setFilteredData] = useState(data);
    const [reportsToDelete, setReportsToDelete] = useState([]);
    const [reportToEdit, setReportToEdit] = useState({});
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [visibleData, setVisibleData] = useState(data);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState("id_report");
    const [order, setOrder] = useState("desc");
    const [sortedData, setSortedData] = useState([]);

    const dataUser = useAuth();

    //console.log(data);
    const {
        openModalCreateReport,
        openModalEditReport,
        openModalText,
        textOpenModalText,
        setOpenModalText,
        setOpenModalEditResidueReport,
        setUpdateReportInfo,
        openModalFinishReport,
    } = useContext(TodoContext);
    const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
    const [selected, setSelected] = useState([]);
    const [openFiltersModal, setOpenFiltersModal] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [desktop, setDesktop] = useState(window.innerWidth > 899);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 899) {
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
    const handleExpandClick = (id) => {
        setExpandedRow((prev) => (prev === id ? null : id));
    };

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
        status_reporte: [],
        grupo_usuario: [],
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditResidues = (report) => {
        setReportToEdit(report);
        setOpenModalEditResidueReport(true);
    };


    useEffect(() => {
        setSelected([]);
        setFilteredData(data);
        setVisibleData(data);
        if (data.length > 0) {
            const colonia_usuario = [
                ...new Set(data.map((report) => report.colonia_usuario)),
            ];
            const ciudad_usuario = [
                ...new Set(data.map((report) => report.ciudad_usuario)),
            ];
            const estado_usuario = [
                ...new Set(data.map((report) => report.estado_usuario)),
            ];
            const cp_usuario = [...new Set(data.map((report) => report.cp_usuario))];
            const fecha_inicio_reporte = [
                ...new Set(data.map((report) => new Date(report.fecha_inicio_reporte))),
            ];
            const centro_recoleccion = [
                ...new Set(data.map((report) => report.centro_recoleccion)),
            ];
            const centro_reciclaje = [
                ...new Set(data.map((report) => report.centro_reciclaje)),
            ];
            const compania_usuario = [
                ...new Set(data.map((report) => report.compania_usuario)),
            ];
            const firma_responsiva_generador = [
                ...new Set(data.map((report) => report.firma_responsiva_generador)),
            ];
            const firma_responsiva_receptor = [
                ...new Set(data.map((report) => report.firma_responsiva_receptor)),
            ];
            const residuos_agregados = [
                ...new Set(data.map((report) => report.residuos_agregados)),
            ];
            const transportista = [
                ...new Set(data.map((report) => report.transportista)),
            ];
            const calle_reporte = [
                ...new Set(data.map((report) => report.calle_reporte)),
            ];
            const colonia_reporte = [
                ...new Set(data.map((report) => report.colonia_reporte)),
            ];
            const ciudad_reporte = [
                ...new Set(data.map((report) => report.ciudad_reporte)),
            ];
            const estado_reporte = [
                ...new Set(data.map((report) => report.estado_reporte)),
            ];
            const cp_reporte = [...new Set(data.map((report) => report.cp_reporte))];
            const status_reporte = [
                ...new Set(data.map((report) => report.status_reporte)),
            ];
            const grupo_usuario = [
                ...new Set(data.map((report) => report.grupo_usuario)),
            ];

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
                status_reporte,
                grupo_usuario,
            });
        }
    }, [data]);

    useEffect(() => {
        setSortedData(sortData(visibleData, orderBy, order));
    }, [visibleData, order, orderBy])

    return (
        <Box sx={{ width: "100%", mb: "3rem" }}>
            <Paper
                sx={{
                    height: "80%",
                    overflow: "auto",
                    padding: 2,
                }}
            >
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
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead sx={{ bgcolor: theme.palette.background.default }}>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2"> </Typography>
                                    </TableSortLabel>
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
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2">Nombre</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2">Apellidos</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2">Correo electrónico</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2">Teléfono</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Residuos</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={18}>
                                        <Typography
                                            variant="h6"
                                            color="textSecondary"
                                            align="center"
                                        >
                                            No se encontraron reportes
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((report, index) => (
                                        <>
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                key={report.id_report}
                                                sx={{ cursor: "pointer" }}

                                            >
                                                <TableCell>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleExpandClick(report.id_report);
                                                        }}
                                                    >
                                                        {expandedRow === report.id_report ? (
                                                            <KeyboardArrowUpIcon />
                                                        ) : (
                                                            <KeyboardArrowDownIcon />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>{report.id_report}</TableCell>
                                                <TableCell>{report.nombre_real_usuario}</TableCell>
                                                <TableCell>{report.apellido_usuario}</TableCell>
                                                <TableCell>{report.email_usuario}</TableCell>
                                                <TableCell>{report.telefono_usuario}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        startIcon={<Add />}
                                                        variant="contained"
                                                        size="small"
                                                        color={
                                                            report.residuos_agregados ? "success" : "warning"
                                                        }
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditResidues(report);
                                                        }}
                                                    >
                                                        Agregar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    style={{ paddingBottom: 0, paddingTop: 0 }}
                                                    colSpan={18}
                                                >
                                                    <Collapse
                                                        in={expandedRow === report.id_report}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        <ShortenedReportInfo request={report} />
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))
                            )}
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

            <ModalResidueReport report={reportToEdit} />
            {/* <ModalFinishReport report={reportToEdit} /> */}
            <DeleteReportsModal reports={reportsToDelete} />
            <ShortenedReportsFiltersModal
                isOpen={openFiltersModal}
                setOpen={setOpenFiltersModal}
                data={dataForFilters}
                setFilteredData={setFilteredData}
                objects={data}
                setFiltersApplied={setFiltersApplied}
            />
            <RowContextMenu
                anchorEl={rowContextMenuAnchorEl}
                setAnchorEl={setRowContextMenuAnchorEl}
            />
            {openModalFinishReport && <ModalFinishReport report={reportToEdit} />}
            {openModalCreateReport && (
                <ModalReport mode={"CREAR"} creatorUser={dataUser.user} />
            )}
            {openModalEditReport && (
                <ModalReport
                    mode={"EDITAR"}
                    report={reportToEdit}
                    creatorUser={dataUser.user}
                />
            )}
            {openModalText && (
                <Dialog
                    open={openModalText}
                    onClose={() => {
                        setOpenModalText(false);
                        setUpdateReportInfo((prev) => !prev);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{textOpenModalText}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {textOpenModalText}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModalText(false)}>Aceptar</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
}