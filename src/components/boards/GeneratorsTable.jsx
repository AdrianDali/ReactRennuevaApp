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
    ListItem,
    ListItemText,
    Divider
} from "@mui/material";
import { Add, Download, FilterList, Delete, Search, Visibility, Check, Edit } from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect, createContext } from "react";
import GeneratorsFiltersModal from "../modals/GeneratorsFiltersModal";
import { ModalGenerator } from "../../pages/ModalGenerator";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import DeleteGeneratorModal from "../modals/DeleteGeneratorModal";




function RowContextMenu({ anchorEl, setAnchorEl }) {
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Menu anchorEl={anchorEl} open={open}>
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Edit />
                        </ListItemIcon>
                        <ListItemText primary="Editar" />
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
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


function ExportOptionsMenu({ anchorEl, setAnchorEl }) {
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Menu anchorEl={anchorEl} open={open}>
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Download />
                        </ListItemIcon>
                        <ListItemText primary="Exportar todos" />
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Visibility />
                        </ListItemIcon>
                        <ListItemText primary="Exportar visibles" />
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
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

function Toolbar({ selected, setOpenFiltersModal, setUsersToDelete }) {
    
    const {
        setUpdateGeneratorInfo,
        openModalCreateGenerator,
        setOpenModalCreateGenerator,
        openModalEditGenerator,
        setOpenModalEditGenerator,
        openModalDeleteGenerator,
        setOpenModalDeleteGenerator,
        openModalText, 
        setOpenModalText
    } = useContext(TodoContext);
    const [exportOptionsAchorEl, setExportOptionsAnchorEl] = useState(null);
    if (selected.length > 0) return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={2} bgcolor={theme.palette.primary.light}>
            <Typography variant="h4" component="div" color="secondary" sx={{ p: 2 }}>
                {`${selected.length} ${selected.length === 1 ? 'seleccionado' : 'seleccionados'}`}
            </Typography>
            <Box>
                <Button variant="outlined" size="large" color="success" startIcon={<Download />} sx={{ m: 2 }} onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}>Exportar</Button>
                <Button variant="contained" size="large" color="error" startIcon={<Delete />} sx={{ m: 2 }} onClick={e=>{
                    e.stopPropagation()
                    setOpenModalDeleteGenerator(true)
                    setUsersToDelete(selected)
                }}>Borrar</Button>
            </Box>
            <ExportOptionsMenu anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl} />
        </Box>
    )

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={2}>
            <Typography variant="h4" component="div" color="primary" sx={{ p: 2 }}>
                Generadores
            </Typography>
            <Box>
                <IconButton color="info" ><Search /></IconButton>
                <Button variant="text" size="large" color="secondary" startIcon={<FilterList />} sx={{ m: 2 }} onClick={() => setOpenFiltersModal(true)}>Filtrar</Button>
                <Button variant="outlined" size="large" color="success" startIcon={<Download />} sx={{ m: 2 }} onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}>Exportar</Button>
                <Button variant="contained" size="large" color="primary" startIcon={<Add />} sx={{ m: 2 }} onClick={() => { setOpenModalCreateGenerator(true) }}>Nuevo</Button>
                <ExportOptionsMenu anchorEl={exportOptionsAchorEl} setAnchorEl={setExportOptionsAnchorEl}/>
            </Box>
        </Box>
    )

}


export default function GeneratorsTable({ data }) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [generatorsToDelete, setGeneratorsToDelete] = useState([]);
    const [userToEdit, setUserToEdit] = useState(null);
    const dataUser = useAuth();
    const {
        setUpdateGeneratorInfo,
        openModalCreateGenerator,
        setOpenModalCreateGenerator,
        openModalEditGenerator,
        setOpenModalEditGenerator,
        openModalDeleteGenerator,
        setOpenModalDeleteGenerator,
        openModalText, 
        setOpenModalText
    } = useContext(TodoContext);
    const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
    const [rowContextMenuSelected, setRowContextMenuSelected] = useState(null);
    const [selected, setSelected] = useState([]);
    const [generalCheckboxStatus, setGeneralCheckboxStatus] = useState("unchecked");
    const [openFiltersModal, setOpenFiltersModal] = useState(false);
    const [dataForFilters, setDataForFilters] = useState({
        email: [],
        rfc: [],
        company: [],
        postalCode: [],
        state: [],
        city: [],
        locality: [],
    });


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
        if (data.length > 0) {
            const email = [...new Set(data.map((cliente) => cliente.user))];
            const rfc = [...new Set(data.map((cliente) => cliente.rfc))];
            const company = [...new Set(data.map((cliente) => cliente.company))];
            const postalCode = [...new Set(data.map((cliente) => cliente.address_postal_code))];
            const state = [...new Set(data.map((cliente) => cliente.address_state))];
            const city = [...new Set(data.map((cliente) => cliente.address_city))];
            const locality = [...new Set(data.map((cliente) => cliente.address_locality))];

            setDataForFilters({
                email,
                rfc,
                company,
                postalCode,
                state,
                city,
                locality
            })
        }
    }, [data])

    return (
        <Box sx={{ width: '100%' }}>
            <Paper>
                <Toolbar selected={selected} setOpenFiltersModal={setOpenFiltersModal} setUsersToDelete={setGeneratorsToDelete}/>
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
                                        <Typography variant="subtitle2">Campaña</Typography>
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
                            {data.map((cliente, index) => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    key={cliente.user}
                                    selected={isRowSelected(cliente.user)}
                                    sx={{ cursor: 'pointer' }}
                                    aria-checked={false}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleSelected(cliente.user)
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
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
            <GeneratorsFiltersModal isOpen={openFiltersModal} setOpen={setOpenFiltersModal} data={dataForFilters} />
            <RowContextMenu anchorEl={rowContextMenuAnchorEl} setAnchorEl={setRowContextMenuAnchorEl} />
            {openModalCreateGenerator && <ModalGenerator mode={"CREAR"} creatorUser={dataUser.user} />}
            {openModalEditGenerator && <ModalGenerator mode={"EDITAR"} userToEdit={userToEdit} creatorUser={dataUser.user}/>}
            <DeleteGeneratorModal generators={generatorsToDelete} open={openModalDeleteGenerator} setOpen={setOpenModalDeleteGenerator}/>
        </Box>
    );
}