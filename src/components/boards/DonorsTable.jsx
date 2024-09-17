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
import ModalDonor from "../../pages/ModalDonor";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import DeleteGeneratorModal from "../modals/DeleteGeneratorModal";
import { generateExcelFromJson } from "../../services/Excel";
import DeleteDonorModal from "../modals/DeleteDonorModal";




function RowContextMenu({ anchorEl, setAnchorEl }) {
    const {
        setOpenModalEditDonor,
        setOpenModalDeleteDonor,
    } = useContext(TodoContext);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setOpenModalEditDonor(true);
        handleClose();
    }

    const handleDelete = () => {
        setOpenModalDeleteDonor(true);
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
        generateExcelFromJson(allData, "Donadores");
        handleClose();
    }

    const handleExportVisible = () => {
        //console.log(filteredData)
        generateExcelFromJson(filteredData, "Donadores");
        handleClose();
    }

    const handleExportSelected = () => {
        //console.log(selectedData)
        const dataToExport = allData.filter((donor) => selectedData.includes(donor.user));
        //console.log(dataToExport)
        generateExcelFromJson(dataToExport, "Donadores");
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
                const newData = filteredData.filter((donor) => {
                    return donor.first_name.toLowerCase().includes(search) ||
                        donor.last_name.toLowerCase().includes(search) ||
                        donor.user.toLowerCase().includes(search) ||
                        donor.rfc.toLowerCase().includes(search)
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
        setOpenModalDeleteDonor,
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
                    setOpenModalDeleteDonor(true)
                    setUsersToDelete(selected)
                }}>Borrar</Button>
            </Box>
            <ExportOptionsMenu selectedData={selected} filteredData={filteredData} allData={allData} anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl} />
        </Box>
    )

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={2}>
            <Typography variant="h4" component="div" color="primary" sx={{ p: 2 }}>
                Donadores
            </Typography>
            <Box>
                <SearchField filteredData={filteredData} setVisibleData={setVisibleData} />
                <Badge color="error" overlap="circular" badgeContent=" " variant="dot" invisible={!filtersApplied}>
                    <Button variant="text" size="large" color="secondary" startIcon={<FilterList />} sx={{ m: 0, mx: 2 }} onClick={() => setOpenFiltersModal(true)}>Filtrar</Button>
                </Badge>
                <Button variant="outlined" size="large" color="success" startIcon={<Download />} sx={{ m: 2 }} onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}>Exportar</Button>
                <Button variant="contained" size="large" color="primary" startIcon={<Add />} sx={{ m: 2 }} onClick={() => { setOpenModalCreateDonor(true) }}>Nuevo</Button>
                <ExportOptionsMenu selectedData={selected} filteredData={filteredData} allData={allData} anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl} />
            </Box>
        </Box>
    )

}


export default function DonorsTable({ data }) {
    const [filteredData, setFilteredData] = useState(data);
    const [donorsToDelete, setDonorsToDelete] = useState([]);
    const [userToEdit, setUserToEdit] = useState(null);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [visibleData, setVisibleData] = useState(data);
    const dataUser = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {
        openModalCreateDonor,
        openModalEditDonor,
        setOpenModalEditDonor,
        setOpenModalDeleteDonor,
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
            setSelected(data.map((donor) => donor.user));
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
            const company = [...new Set(data.map((donor) => donor.company))];
            const address_postal_code = [...new Set(data.map((donor) => donor.address_postal_code))];
            const address_state = [...new Set(data.map((donor) => donor.address_state))];
            const address_city = [...new Set(data.map((donor) => donor.address_city))];
            const address_locality = [...new Set(data.map((donor) => donor.address_locality))];

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
                <Toolbar selected={selected} allData={data} filteredData={filteredData} setOpenFiltersModal={setOpenFiltersModal} setUsersToDelete={setDonorsToDelete} filtersApplied={filtersApplied} setVisibleData={setVisibleData} />
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
                                {dataUser && !(dataUser.groups[0] === "Logistica") &&
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
                            {visibleData.length === 0 ?
                                <TableRow>
                                    <TableCell colSpan={14}>
                                        <Typography variant="h6" color="textSecondary" align="center">
                                            No se encontraron donadores
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                : visibleData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((donor, index) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            key={donor.user}
                                            selected={isRowSelected(donor.user)}
                                            sx={{ cursor: 'pointer' }}
                                            aria-checked={isRowSelected(donor.user) ? true : false}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleSelected(donor.user)
                                            }}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                setUserToEdit(donor)
                                                setDonorsToDelete([donor.email])
                                                setRowContextMenuAnchorEl(e.target);
                                            }}

                                        >
                                            <TableCell>
                                                <Checkbox
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleSelected(donor.user)
                                                    }}
                                                    checked={isRowSelected(donor.user)}
                                                    inputProps={{
                                                        'aria-labelledby': donor.user,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{donor.first_name}</TableCell>
                                            <TableCell>{donor.last_name}</TableCell>
                                            <TableCell>{donor.user}</TableCell>
                                            <TableCell>{donor.rfc}</TableCell>
                                            <TableCell>{donor.company}</TableCell>
                                            <TableCell>{donor.address_street}</TableCell>
                                            <TableCell>{donor.address_number}</TableCell>
                                            <TableCell>{donor.address_locality}</TableCell>
                                            <TableCell>{donor.address_city}</TableCell>
                                            <TableCell>{donor.address_state}</TableCell>
                                            <TableCell>{donor.address_postal_code}</TableCell>
                                            {dataUser && !(dataUser.groups[0] === "Logistica") &&
                                                <>
                                                    <TableCell>
                                                        <IconButton onClick={(e) => {
                                                            e.stopPropagation()
                                                            setUserToEdit(donor)
                                                            setOpenModalEditDonor(true)
                                                        }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton color="error" onClick={(e) => {
                                                            e.stopPropagation()
                                                            setDonorsToDelete([donor.email])
                                                            setOpenModalDeleteDonor(true)
                                                        }}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>

                                                </>
                                            }
                                        </TableRow>
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
            <GeneratorsFiltersModal isOpen={openFiltersModal} setOpen={setOpenFiltersModal} data={dataForFilters} setFilteredData={setFilteredData} users={data} setFiltersApplied={setFiltersApplied} />
            <RowContextMenu anchorEl={rowContextMenuAnchorEl} setAnchorEl={setRowContextMenuAnchorEl} />
            {openModalCreateDonor && <ModalDonor mode={"CREAR"} creatorUser={dataUser.user} />}
            {openModalEditDonor && <ModalDonor mode={"EDITAR"} userToEdit={userToEdit} creatorUser={dataUser.user} />}
            <DeleteDonorModal donors={donorsToDelete} />
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