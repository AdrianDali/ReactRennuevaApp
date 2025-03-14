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
    Chip,
    Collapse
} from "@mui/material";
import { Add, Download, FilterList, Delete, Search, Visibility, Check, Edit, Close, KeyboardArrowDown, EmojiPeople, Warehouse } from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { generateExcelFromJson } from "../../services/Excel";
import { statusColor, statusText } from "../../helpers/statusModifiers";
import DonorRecollectionInfo from "./DonorRecollectionInfo";
import EditRecolectionModal from "./EditRecolectionModal";
import DeleteDonorRecollectionsModal from "../modals/DeleteDonorRecollectionsModal";
import DonorRecolecctionsFiltersModal from "../modals/DonorRecollectionsFiltersModal";
import sortData from "../../helpers/SortData";





function RowContextMenu({ anchorEl, setAnchorEl }) {
    const {
        setOpenModalEditGenerator,
        setOpenModalDeleteGenerator,
    } = useContext(TodoContext);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setOpenModalEditGenerator(true);
        handleClose();
    }

    const handleDelete = () => {
        setOpenModalDeleteGenerator(true);
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


function ExportOptionsMenu({ anchorEl, setAnchorEl, allData, filteredData, selectedData }) {
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExportAll = () => {
        //console.log(allData)
        generateExcelFromJson(allData, "Generadores");
        handleClose();
    }

    const handleExportVisible = () => {
        //console.log(filteredData)
        generateExcelFromJson(filteredData, "Generadores");
        handleClose();
    }

    const handleExportSelected = () => {
        //console.log(selectedData)
        const dataToExport = allData.filter((generador) => selectedData.includes(generador.user));
        //console.log(dataToExport)
        generateExcelFromJson(dataToExport, "Generadores");
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
                const newData = filteredData.filter((generador) => {
                    return generador.nombre.toLowerCase().includes(search) ||
                        generador.telefono.toLowerCase().includes(search) ||
                        generador.donador.toLowerCase().includes(search) ||
                        generador.calle.toLowerCase().includes(search)
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
                    sx={{ mt: 1, width: showSearch ? "25rem" : 0, transition: 'all 300ms ease-in' }}
                    placeholder="Nombre, Apellido, Correo electrónico, RFC, Teléfono"
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

function Toolbar({ selected, setOpenFiltersModal, setUsersToDelete, filtersApplied, filteredData, allData, setVisibleData }) {
    const {
        setOpenModalCreateDonor,
        setOpenModalDeleteGenerator,
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
                    setOpenModalDeleteGenerator(true)
                    setUsersToDelete(selected)

                }}>Borrar</Button>
            </Box>
            <ExportOptionsMenu selectedData={selected} filteredData={filteredData} allData={allData} anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl} />
        </Box>
    )

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={2}>
            <Typography variant="h4" component="div" color="primary" sx={{ p: 2 }}>
                Ordenes de recolección
            </Typography>
            <Box>
                <SearchField filteredData={filteredData} setVisibleData={setVisibleData} />
                <Badge color="error" overlap="circular" badgeContent=" " variant="dot" invisible={!filtersApplied}>
                    <Button variant="text" size="large" color="secondary" startIcon={<FilterList />} sx={{ m: 0, mx: 2 }} onClick={() => setOpenFiltersModal(true)}>Filtrar</Button>
                </Badge>
                <Button variant="outlined" size="large" color="success" startIcon={<Download />} sx={{ m: 2 }} onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}>Exportar</Button>
                <ExportOptionsMenu selectedData={selected} filteredData={filteredData} allData={allData} anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl} />
            </Box>
        </Box>
    )

}


export default function DonorRecollectionsTable({ data }) {
    const [filteredData, setFilteredData] = useState(data);
    const [recollectionsToDelete, setRecollectionsToDelete] = useState([]);
    const [recollectionToEdit, setRecollectionToEdit] = useState(null);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [visibleData, setVisibleData] = useState(data);
    const dataUser = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showCompleteInfo, setShowCompleteInfo] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [orderBy, setOrderBy] = useState("id");
    const [order, setOrder] = useState("desc");
    const [sortedData, setSortedData] = useState([]);

    const {
        setUpdateDonorInfo,
        updateDonorInfo,
        setTextOpenModalText,
        setOpenModalDeleteGenerator,
        openModalText,
        textOpenModalText,
        setOpenModalText
    } = useContext(TodoContext);

    const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
    const [selected, setSelected] = useState([]);
    const [generalCheckboxStatus, setGeneralCheckboxStatus] = useState("unchecked");
    const [openFiltersModal, setOpenFiltersModal] = useState(false);
    const [dataForFilters, setDataForFilters] = useState({
        company: [],
        address_postal_code: [],
        address_state: [],
        address_city: [],
        address_locality: [],
    });


    const handleShowCompleteInfo = (id) => {
        if (showCompleteInfo === id) {
            setShowCompleteInfo(null);
        } else {
            setShowCompleteInfo(id);
        }

    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleGenaeralCheckboxClick = (e) => {
        e.stopPropagation()
        if (generalCheckboxStatus === "checked") {
            setGeneralCheckboxStatus("unchecked");
        } else {
            setGeneralCheckboxStatus("checked");
        }
    }

    const handleGeneralCheckboxChange = (e) => {
        if (e.target.checked) {
            setSelected(data.map((request) => request));
        } else if (e.target.indeterminate) {
            setSelected(selected);
        } else {
            setSelected([]);
        }
    }


    const isRowSelected = (id) => selected.filter((selectedReq) => selectedReq.id === id).length > 0;

    const toggleSelected = (req) => {
        if (isRowSelected(req.id)) {
            setSelected(selected.filter((selectedReq) => selectedReq.id !== req.id));
        } else {
            setSelected([...selected, req]);
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
            const conductor_asignado = [...new Set(data.map((req) => req.conductor_asignado))];
            const codigo_postal = [...new Set(data.map((req) => req.codigo_postal))];
            const fecha = [...new Set(data.map((req) => req.fecha))];
            const ciudad = [...new Set(data.map((req) => req.ciudad))];
            const estado = [...new Set(data.map((req) => req.estado))];
            const fecha_estimada_recoleccion = [...new Set(data.map((req) => req.fecha_estimada_recoleccion))];
            const hora_preferencte_recoleccion = [...new Set(data.map((req) => req.fecha_preferente_recoleccion))];
            const peso = [...new Set(data.map((req) => req.peso))];
            const peso_estimado = [...new Set(data.map((req) => req.peso_estimado))];
            const status = [...new Set(data.map((req) => req.status))];



            setDataForFilters({
                conductor_asignado,
                codigo_postal,
                fecha,
                ciudad,
                estado,
                fecha_estimada_recoleccion,
                hora_preferencte_recoleccion,
                peso,
                peso_estimado,
                status
            })
        }
    }, [data])

    useEffect(() => {
        setSortedData(sortData(visibleData, orderBy, order));
    }, [visibleData, order, orderBy])

    return (
        <Box sx={{ width: '100%', mb: '3rem' }}>
            <Paper>
                <Toolbar selected={selected} allData={data} filteredData={filteredData} setOpenFiltersModal={setOpenFiltersModal} setUsersToDelete={setRecollectionsToDelete} filtersApplied={filtersApplied} setVisibleData={setVisibleData} />
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: theme.palette.background.default }}>
                            <TableRow>
                                <TableCell>
                                </TableCell>
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
                                        direction={order}
                                        onClick={() => {
                                            setOrderBy("id")
                                            setOrder(order === "asc" ? "desc" : "asc")
                                        }}
                                        active={orderBy === "id" ? true : false}
                                    >
                                        <Typography variant="subtitle2">ID</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={order}
                                        onClick={() => {
                                            setOrderBy("donador")
                                            setOrder(order === "asc" ? "desc" : "asc")
                                        }}
                                        active={orderBy === "donador" ? true : false}
                                    >
                                        <Typography variant="subtitle2">Correo electrónico asociado</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={order}
                                        onClick={() => {
                                            setOrderBy("nombre_centro")
                                            setOrder(order === "asc" ? "desc" : "asc")
                                        }}
                                        active={orderBy === "nombre_centro" ? true : false}
                                    >
                                        <Typography variant="subtitle2">Centro de recolección</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Fecha de solicitud</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={order}
                                        onClick={() => {
                                            setOrderBy("direccion_completa")
                                            setOrder(order === "asc" ? "desc" : "asc")
                                        }}
                                        active={orderBy === "direccion_completa" ? true : false}
                                    >
                                        <Typography variant="subtitle2">Dirección</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Peso estimado</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={order}
                                        onClick={() => {
                                            setOrderBy("status")
                                            setOrder(order === "asc" ? "desc" : "asc")
                                        }}
                                        active={orderBy === "status" ? true : false}
                                    >
                                        <Typography variant="subtitle2">Estado</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                {dataUser && !(dataUser.groups[0] === "Comunicacion" || dataUser.groups[0] === "Registro") &&
                                    <>
                                        <TableCell>
                                            <Typography variant="subtitle2">Editar</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2">Borrar</Typography>
                                        </TableCell>
                                    </>
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.length === 0 ?
                                <TableRow>
                                    <TableCell colSpan={14}>
                                        <Typography variant="h6" color="textSecondary" align="center">
                                            No se encontraron solicitudes de recolección
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                : sortedData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((request, index) => (
                                        <React.Fragment key={`${request.id}-${index}`}>
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                key={request.id}
                                                selected={isRowSelected(request.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    bgcolor: showCompleteInfo === request.id && "primary.light",
                                                    transition: "all 0.3s"
                                                }}
                                                aria-checked={isRowSelected(request.id) ? true : false}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleShowCompleteInfo(request.id)
                                                }}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    setRecollectionToEdit(request)
                                                    setRecollectionsToDelete([request.id])
                                                    setRowContextMenuAnchorEl(e.target);
                                                }}

                                            >
                                                <TableCell sx={{ borderBottomWidth: showCompleteInfo === request.id ? 0 : 1 }}>
                                                    <IconButton color="secondary" onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleShowCompleteInfo(request.id)
                                                    }}>
                                                        <KeyboardArrowDown sx={{
                                                            transform: showCompleteInfo === request.id ? "rotate(180deg)" : "rotate(0deg)",
                                                            transition: "transform 0.3s"
                                                        }} />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleSelected(request)
                                                        }}
                                                        checked={isRowSelected(request.id)}
                                                        inputProps={{
                                                            'aria-labelledby': request.id,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{request.id}</TableCell>
                                                <TableCell>
                                                    <Box margin={0} padding={0} sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: "0.5rem"
                                                    }}>
                                                        <span >
                                                            {request.recoleccion_para_centro === "No" ? <EmojiPeople color="info" /> : <Warehouse color="primary"/>}
                                                        </span>
                                                        <span>{request.donador}</span>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{request.nombre_centro == 'NO APLICA'? 'Donador': request.nombre_centro}</TableCell>
                                                <TableCell>{request.fecha}</TableCell>
                                                <TableCell>{request.direccion_completa}</TableCell>
                                                <TableCell>{request.peso_estimado}</TableCell>
                                                <TableCell>
                                                    <Chip label={statusText(request.status)} color={statusColor(request.status)} />
                                                </TableCell>
                                                {dataUser && !(dataUser.groups[0] === "Comunicacion" || dataUser.groups[0] === "Registro") &&
                                                    <>
                                                        <TableCell>
                                                            <IconButton
                                                                disabled={(request.status === "cancelado" )}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setRecollectionToEdit(request)
                                                                    setOpenEditModal(true)
                                                                }}>
                                                                <Edit />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton color="error" onClick={(e) => {
                                                                e.stopPropagation()
                                                                setRecollectionsToDelete([request])
                                                                setOpenModalDeleteGenerator(true)
                                                            }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>

                                                    </>
                                                }
                                            </TableRow>
                                            <TableRow >
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottomWidth: showCompleteInfo === request.id ? 1 : 0 }} colSpan={10}>
                                                    <Collapse in={showCompleteInfo === request.id} timeout="auto" unmountOnExit>
                                                        <DonorRecollectionInfo request={request} />
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
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
            <DonorRecolecctionsFiltersModal isOpen={openFiltersModal} setOpen={setOpenFiltersModal} data={dataForFilters} setFilteredData={setFilteredData} objects={data} setFiltersApplied={setFiltersApplied} />
            <RowContextMenu anchorEl={rowContextMenuAnchorEl} setAnchorEl={setRowContextMenuAnchorEl} />
            {openEditModal && <EditRecolectionModal
                open={openEditModal}
                setOpen={setOpenEditModal}
                recolection={recollectionToEdit}
                setMessage={setTextOpenModalText}
                setOpenMessageModal={setOpenModalText}
                update={updateDonorInfo}
                setUpdate={setUpdateDonorInfo}
            />}
            <DeleteDonorRecollectionsModal recollections={recollectionsToDelete} />
            {openModalText && (
                <Dialog
                    open={openModalText}
                    onClose={() => setOpenModalText(false)}
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