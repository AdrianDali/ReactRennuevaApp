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
  Card,
  CardHeader,
  CardContent,
  Divider,
  Chip,
  Grid,
  Stack,
  Avatar,
  Tooltip,
  Grow,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Badge,
  Dialog,
  Collapse,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  TablePagination
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Person,
  Phone,
  Email,
  Home,
  Map,
  LocationOn,
  Event,
  CalendarToday,
  ChatBubbleOutline,
  Add, Download, FilterList, Delete, Search, Visibility, Check, Edit, Close
} from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import React, { useState, useContext, useEffect, useRef } from "react";
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
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      py={2}
      px={2}
      flexWrap="wrap"
      gap={{ xs: 2, sm: 0 }}
    >
      {/* Título */}
      <Typography
        variant="h4"
        component="div"
        color="primary"
        sx={{
          px: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'auto' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Generadores
      </Typography>

      {/* Controles */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="flex-end"
        gap={{ xs: 1, sm: 2 }}
        width={{ xs: '100%', sm: 'auto' }}
      >
        {/* Search */}
        <SearchField
          filteredData={filteredData}
          setVisibleData={setVisibleData}
        />

        {/* Filtrar */}
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
            onClick={() => setOpenFiltersModal(true)}
            fullWidth={{ xs: true, sm: false }}
          >
            Filtrar
          </Button>
        </Badge>

        {/* Exportar */}
        <Button
          variant="outlined"
          size="large"
          color="success"
          startIcon={<Download />}
          onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}
          fullWidth={{ xs: true, sm: false }}
        >
          Exportar
        </Button>

        {/* Nuevo */}
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenModalCreateGenerator(true)}
          fullWidth={{ xs: true, sm: false }}
        >
          Nuevo
        </Button>

        <ExportOptionsMenu
          selectedData={selected}
          filteredData={filteredData}
          allData={allData}
          anchorEl={exportOptionsAchorEl}
          setAnchorEl={setExportOptionsAnchorEl}
        />
      </Box>
    </Box>
  );
}


export default function GeneratorsTable({ data }) {
  const [filteredData, setFilteredData] = useState(data);
  const [generatorsToDelete, setGeneratorsToDelete] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [visibleData, setVisibleData] = useState(data);
  const dataUser = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const [openRow, setOpenRow] = useState(null);
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

  console.log({ data })


  return (
    <Box sx={{ width: '100%', mb: '3rem' }}>
      <Paper>
        <Toolbar
          selected={selected}
          allData={data}
          filteredData={filteredData}
          setOpenFiltersModal={setOpenFiltersModal}
          setUsersToDelete={setGeneratorsToDelete}
          filtersApplied={filtersApplied}
          setVisibleData={setVisibleData}
        />
        <TableContainer
          sx={{
            overflowX: 'auto',     // scroll si hay muchas columnas
            maxHeight: '60vh'   // altura máxima para que no crezca indefinidamente
          }}
        >
          <Table sx={{ maxWidth: '100%' }}>
            <TableHead
              sx={{
                bgcolor: '#93C031',
                '& .MuiTypography-root': { color: 'white' },
                '& .MuiTableCell-root': {
                  py: 4
                }
              }}
            >
              <TableRow>
                <TableCell> </TableCell>
                <TableCell>
                  <Checkbox
                    checked={generalCheckboxStatus === "checked"}
                    indeterminate={generalCheckboxStatus === "indeterminate"}
                    onClick={handleGenaeralCheckboxClick}
                    onChange={handleGeneralCheckboxChange}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ color: 'white' }}>Correo electrónico asociado</Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ color: 'white' }}>RFC</Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ color: 'white' }}>Razón social</Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Typography variant="subtitle2" sx={{ color: 'white' }}>Compañía</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ color: 'white' }}>Editar</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ color: 'white' }}>Borrar</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14}>
                    <Typography variant="h6" color="textSecondary" align="center">
                      No se encontraron generadores
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((cliente) => {
                    const isExpanded = openRow === cliente.user;
                    return (
                      <React.Fragment key={cliente.user}>
                        <TableRow
                          hover
                          selected={isRowSelected(cliente.user)}
                          sx={{
                            cursor: 'pointer',
                            bgcolor: theme.palette.background.default,
                            '& > td': {
                              py: 5,
                            },
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setUserToEdit(cliente);
                            setGeneratorsToDelete([cliente.email]);
                            setRowContextMenuAnchorEl(e.target);
                          }}
                        >
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenRow(isExpanded ? null : cliente.user);
                              }}
                            >
                              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Checkbox
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelected(cliente.user);
                                }}
                                checked={isRowSelected(cliente.user)}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>{cliente.user}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            {cliente.rfc}
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            {cliente.razon_social}
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            {cliente.company}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserToEdit(cliente);
                                setOpenModalEditGenerator(true);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                setGeneratorsToDelete([cliente.email]);
                                setOpenModalDeleteGenerator(true);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        {/* ✅ Fila colapsable */}
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Grow in>
                                <Card elevation={3} sx={{ m: 2 }}>
                                  <CardHeader
                                    avatar={<Avatar>{cliente.first_name?.charAt(0) || 'G'}</Avatar>}
                                    title={
                                      <Typography variant="h6">
                                        Información del Generador
                                      </Typography>
                                    }
                                    subheader={cliente.first_name}
                                  />

                                  <Divider />

                                  <CardContent>
                                    <Grid container spacing={2}>
                                      {/* Datos Generales */}
                                      <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Person color="primary" />
                                            <Typography>
                                              <strong>Nombre:</strong> {cliente.first_name || '—'}
                                            </Typography>
                                          </Stack>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Person color="primary" />
                                            <Typography>
                                              <strong>Apellido:</strong> {cliente.last_name || '—'}
                                            </Typography>
                                          </Stack>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Email color="primary" />
                                            <Typography>
                                              <strong>Email:</strong> {cliente.user || '—'}
                                            </Typography>
                                          </Stack>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Home color="primary" />
                                            <Typography>
                                              <strong>Empresa:</strong> {cliente.company || '—'}
                                            </Typography>
                                          </Stack>
                                        </Stack>
                                      </Grid>

                                      {/* Dirección */}
                                      <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <LocationOn color="primary" />
                                            <Typography>
                                              <strong>Calle:</strong> {cliente.address_street || '—'}
                                            </Typography>
                                          </Stack>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Map color="primary" />
                                            <Typography>
                                              <strong>Colonia:</strong> {cliente.address_locality || '—'}
                                            </Typography>
                                          </Stack>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Home color="primary" />
                                            <Typography>
                                              <strong>Ciudad:</strong> {cliente.address_city || '—'}
                                            </Typography>
                                          </Stack>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Home color="primary" />
                                            <Typography>
                                              <strong>Estado:</strong> {cliente.address_state || '—'}
                                            </Typography>
                                          </Stack>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Home color="primary" />
                                            <Typography>
                                              <strong>CP:</strong> {cliente.address_postal_code || '—'}
                                            </Typography>
                                          </Stack>
                                        </Stack>
                                      </Grid>

                                      {/* RFC y Razón social */}
                                      <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Tooltip title="RFC">
                                              <Email color="primary" />
                                            </Tooltip>
                                            <Typography>
                                              <strong>RFC:</strong> {cliente.rfc || '—'}
                                            </Typography>
                                          </Stack>
                                          <Stack direction="row" alignItems="center" spacing={1}>
                                            <Tooltip title="Razón Social">
                                              <ChatBubbleOutline color="primary" />
                                            </Tooltip>
                                            <Typography>
                                              <strong>Razón social:</strong> {cliente.razon_social || '—'}
                                            </Typography>
                                          </Stack>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Card>
                              </Grow>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 25]}
          component="div"
          count={visibleData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Modales y contexto */}
        <GeneratorsFiltersModal
          isOpen={openFiltersModal}
          setOpen={setOpenFiltersModal}
          data={dataForFilters}
          setFilteredData={setFilteredData}
          users={data}
          setFiltersApplied={setFiltersApplied}
        />
        <RowContextMenu
          anchorEl={rowContextMenuAnchorEl}
          setAnchorEl={setRowContextMenuAnchorEl}
        />
        {openModalCreateGenerator && (
          <ModalGenerator mode="CREAR" creatorUser={dataUser.user} />
        )}
        {openModalEditGenerator && (
          <ModalGenerator
            mode="EDITAR"
            userToEdit={userToEdit}
            creatorUser={dataUser.user}
          />
        )}
        <DeleteGeneratorModal generators={generatorsToDelete} />

        {openModalText && (
          <Dialog open={openModalText} onClose={() => setOpenModalText(false)}>
            <DialogTitle>{textOpenModalText}</DialogTitle>
            <DialogContent>
              <DialogContentText>{textOpenModalText}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModalText(false)}>Aceptar</Button>
            </DialogActions>
          </Dialog>
        )}
      </Paper>
    </Box>
  );
}