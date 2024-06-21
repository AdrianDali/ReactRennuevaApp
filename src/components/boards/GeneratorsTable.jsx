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
    TablePagination
} from "@mui/material";
import { Add, Download, FilterList, Delete, Search, Visibility, Check, Edit, Close } from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect, useRef } from "react";
import GeneratorsFiltersModal from "../modals/GeneratorsFiltersModal";
import { ModalGenerator } from "../../pages/ModalGenerator";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import DeleteGeneratorModal from "../modals/DeleteGeneratorModal";
import { generateExcelFromJson } from "../../services/Excel";




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
                    return generador.first_name.toLowerCase().includes(search) ||
                        generador.last_name.toLowerCase().includes(search) ||
                        generador.user.toLowerCase().includes(search) ||
                        generador.rfc.toLowerCase().includes(search)
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
        setOpenModalCreateGenerator,
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
                Generadores
            </Typography>
            <Box>
                <SearchField filteredData={filteredData} setVisibleData={setVisibleData} />
                <Badge color="error" overlap="circular" badgeContent=" " variant="dot" invisible={!filtersApplied}>
                    <Button variant="text" size="large" color="secondary" startIcon={<FilterList />} sx={{ m: 0, mx: 2 }} onClick={() => setOpenFiltersModal(true)}>Filtrar</Button>
                </Badge>
                <Button variant="outlined" size="large" color="success" startIcon={<Download />} sx={{ m: 2 }} onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}>Exportar</Button>
                <Button variant="contained" size="large" color="primary" startIcon={<Add />} sx={{ m: 2 }} onClick={() => { setOpenModalCreateGenerator(true) }}>Nuevo</Button>
                <ExportOptionsMenu selectedData={selected} filteredData={filteredData} allData={allData} anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl} />
            </Box>
        </Box>
    )

}


export default function GeneratorsTable({ data }) {
    const [filteredData, setFilteredData] = useState(data);
    const [generatorsToDelete, setGeneratorsToDelete] = useState([]);
    const [userToEdit, setUserToEdit] = useState(null);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [visibleData, setVisibleData] = useState(data);
    const dataUser = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {
        openModalCreateGenerator,
        openModalEditGenerator,
        setOpenModalEditGenerator,
        openModalDeleteGenerator,
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
            setSelected(data.map((cliente) => cliente.user));
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
        setFilteredData(data);
        setVisibleData(data);
        if (data.length > 0) {
            const company = [...new Set(data.map((cliente) => cliente.company))];
            const address_postal_code = [...new Set(data.map((cliente) => cliente.address_postal_code))];
            const address_state = [...new Set(data.map((cliente) => cliente.address_state))];
            const address_city = [...new Set(data.map((cliente) => cliente.address_city))];
            const address_locality = [...new Set(data.map((cliente) => cliente.address_locality))];

            setDataForFilters({
                company,
                address_postal_code,
                address_state,
                address_city,
                address_locality
            })
        }
    }, [data])


    return (
        <Box sx={{ width: '100%', mb: '3rem' }}>
            <Paper>
                <Toolbar selected={selected} allData={data} filteredData={filteredData} setOpenFiltersModal={setOpenFiltersModal} setUsersToDelete={setGeneratorsToDelete} filtersApplied={filtersApplied} setVisibleData={setVisibleData} />
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
                                        <Typography variant="subtitle2">Nombre</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Apellido</Typography>
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
                                        <Typography variant="subtitle2">RFC</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Compañía</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Calle</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        <Typography variant="subtitle2">Número</Typography>
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
                                        <Typography variant="subtitle2">Ciudad</Typography>
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
                                        <Typography variant="subtitle2">Código postal</Typography>
                                    </TableSortLabel>
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
                            {visibleData.length === 0 ?
                                <TableRow>
                                    <TableCell colSpan={14}>
                                        <Typography variant="h6" color="textSecondary" align="center">
                                            No se encontraron generadores
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                : visibleData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((cliente, index) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        key={cliente.user}
                                        selected={isRowSelected(cliente.user)}
                                        sx={{ cursor: 'pointer' }}
                                        aria-checked={isRowSelected(cliente.user) ? true : false}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleSelected(cliente.user)
                                        }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setUserToEdit(cliente)
                                            setGeneratorsToDelete([cliente.email])
                                            setRowContextMenuAnchorEl(e.target);
                                        }}

                                    >
                                        <TableCell>
                                            <Checkbox
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleSelected(cliente.user)
                                                }}
                                                checked={isRowSelected(cliente.user)}
                                                inputProps={{
                                                    'aria-labelledby': cliente.user,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{cliente.first_name}</TableCell>
                                        <TableCell>{cliente.last_name}</TableCell>
                                        <TableCell>{cliente.user}</TableCell>
                                        <TableCell>{cliente.rfc}</TableCell>
                                        <TableCell>{cliente.company}</TableCell>
                                        <TableCell>{cliente.address_street}</TableCell>
                                        <TableCell>{cliente.address_number}</TableCell>
                                        <TableCell>{cliente.address_locality}</TableCell>
                                        <TableCell>{cliente.address_city}</TableCell>
                                        <TableCell>{cliente.address_state}</TableCell>
                                        <TableCell>{cliente.address_postal_code}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={(e) => {
                                                e.stopPropagation()
                                                setUserToEdit(cliente)
                                                setOpenModalEditGenerator(true)
                                            }}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="error" onClick={(e) => {
                                                e.stopPropagation()
                                                setGeneratorsToDelete([cliente.email])
                                                setOpenModalDeleteGenerator(true)
                                            }}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[ 5, 10, 25]}
                    component="div"
                    count={visibleData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <GeneratorsFiltersModal isOpen={openFiltersModal} setOpen={setOpenFiltersModal} data={dataForFilters} setFilteredData={setFilteredData} users={data} setFiltersApplied={setFiltersApplied} />
            <RowContextMenu anchorEl={rowContextMenuAnchorEl} setAnchorEl={setRowContextMenuAnchorEl} />
            {openModalCreateGenerator && <ModalGenerator mode={"CREAR"} creatorUser={dataUser.user} />}
            {openModalEditGenerator && <ModalGenerator mode={"EDITAR"} userToEdit={userToEdit} creatorUser={dataUser.user} />}
            <DeleteGeneratorModal generators={generatorsToDelete} />
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