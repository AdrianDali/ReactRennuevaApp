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
  KeyboardArrowDown,
} from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import React, { useState, useContext, useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { generateExcelFromJson } from "../../services/Excel";
import { ModalUser } from "../../pages/Users/ModalUser";
import UsersFiltersModal from "../modals/UsersFiltersModal";
import DeleteUserModal from "../modals/DeleteUserModal";
import UserInfoSubTable from "./UserInfoSubTable";
import { set } from "date-fns";

function RowContextMenu({ anchorEl, setAnchorEl }) {
  const { setOpenModalEdit, setOpenModalDeleteGenerator } =
    useContext(TodoContext);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenModalEdit(true);
    handleClose();
  };

  const handleDelete = () => {
    setOpenModalDeleteGenerator(true);
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

function ExportOptionsMenu({
  anchorEl,
  setAnchorEl,
  allData,
  filteredData,
  selectedData,
}) {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportAll = () => {
    //console.log(allData)
    generateExcelFromJson(allData, "Usuarios");
    handleClose();
  };

  const handleExportVisible = () => {
    //console.log(filteredData)
    generateExcelFromJson(filteredData, "Usuarios");
    handleClose();
  };

  const handleExportSelected = () => {
    //console.log(selectedData)
    const dataToExport = allData.filter((generador) =>
      selectedData.includes(generador.user)
    );
    //console.log(dataToExport)
    generateExcelFromJson(dataToExport, "Usuarios");
    handleClose();
  };

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
  );
}

function SearchField({ setPage, filteredData, setVisibleData }) {
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
        setPage(0);
      } else {
        const newData = filteredData.filter((generador) => {
          return (
            generador.first_name?.toLowerCase().includes(search) ||
            generador.phone?.toLowerCase().includes(search) ||
            generador.email?.toLowerCase().includes(search) ||
            generador.address_street?.toLowerCase().includes(search) ||
            generador.rfc?.toLowerCase().includes(search)||
            generador.address_postal_code?.toString().toLowerCase().includes(search)||
            generador.address_state?.toLowerCase().includes(search)||
            generador.address_city?.toLowerCase().includes(search)||
            generador.address_locality?.toLowerCase().includes(search)
          );
        });
        setVisibleData(newData);
        setPage(0);
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
            mt: 1,
            width: showSearch ? "25rem" : 0,
            transition: "all 300ms ease-in",
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

function Toolbar({
  setPage,
  selected,
  setOpenFiltersModal,
  setUsersToDelete,
  filtersApplied,
  filteredData,
  allData,
  setVisibleData,
}) {
  const { setOpenModalCreateDonor, setOpenModalDeleteGenerator, openModalCreate, setOpenModalCreate } =
    useContext(TodoContext);
  const [exportOptionsAchorEl, setExportOptionsAnchorEl] = useState(null);

  if (selected.length > 0)
    return (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        py={2}
        bgcolor={theme.palette.primary.light}
      >
        <Typography
          variant="h4"
          component="div"
          color="secondary"
          sx={{ p: 2 }}
        >
          {`${selected.length} ${selected.length === 1 ? "seleccionado" : "seleccionados"
            }`}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            size="large"
            color="success"
            startIcon={<Download />}
            sx={{ m: 2 }}
            onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            size="large"
            color="error"
            startIcon={<Delete />}
            sx={{ m: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              setUsersToDelete(selected);
              setOpenModalDeleteGenerator(true);
            }}
          >
            Borrar
          </Button>
        </Box>
        <ExportOptionsMenu
          selectedData={selected}
          filteredData={filteredData}
          allData={allData}
          anchorEl={exportOptionsAchorEl}
          setAnchorEl={setExportOptionsAnchorEl}
        />
      </Box>
    );

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      py={2}
    >
      <Typography variant="h4" component="div" color="primary" sx={{ p: 2 }}>
        Usuarios registrados
      </Typography>
      <Box>
        <SearchField
          setPage={setPage}
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
        <Button
          variant="outlined"
          size="large"
          color="success"
          startIcon={<Download />}
          sx={{ m: 2 }}
          onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}
        >
          Exportar
        </Button>
        <ExportOptionsMenu
          selectedData={selected}
          filteredData={filteredData}
          allData={allData}
          anchorEl={exportOptionsAchorEl}
          setAnchorEl={setExportOptionsAnchorEl}
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Add />}
          sx={{ m: 2 }}
          onClick={() => setOpenModalCreate(true)}
        >
          Nuevo
        </Button>
      </Box>
    </Box>
  );
}

export default function UserInfoTable({ data, centers, recyclingCenters, collectionCenters }) {
  console.log(recyclingCenters);
  const [filteredData, setFilteredData] = useState(data);
  const [recollectionsToDelete, setRecollectionsToDelete] = useState([]);
  const [recollectionToEdit, setRecollectionToEdit] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  console.log(data);
  const [visibleData, setVisibleData] = useState(data);
  const dataUser = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showCompleteInfo, setShowCompleteInfo] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const {
    setOpenModalDeleteGenerator,
    openModalText,
    textOpenModalText,
    setOpenModalText,
    setOpenModalEdit,
    openModalCreate,
    openModalEdit,
  } = useContext(TodoContext);
  const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [generalCheckboxStatus, setGeneralCheckboxStatus] =
    useState("unchecked");
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [dataForFilters, setDataForFilters] = useState({
    company: [],
    address_postal_code: [],
    address_state: [],
    address_city: [],
    address_locality: [],
  });
  const [userToEdit, setUserToEdit] = useState(null);

  const handleShowCompleteInfo = (id) => {
    if (showCompleteInfo === id) {
      setShowCompleteInfo(null);
    } else {
      setShowCompleteInfo(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGenaeralCheckboxClick = (e) => {
    e.stopPropagation();
    if (generalCheckboxStatus === "checked") {
      setGeneralCheckboxStatus("unchecked");
    } else {
      setGeneralCheckboxStatus("checked");
    }
  };

  const handleGeneralCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelected(data.map((request) => request));
    } else if (e.target.indeterminate) {
      setSelected(selected);
    } else {
      setSelected([]);
    }
  };

  const isRowSelected = (id) =>
    selected.filter((selectedReq) => selectedReq.id === id).length > 0;

  const toggleSelected = (req) => {
    if (isRowSelected(req.id)) {
      setSelected(selected.filter((selectedReq) => selectedReq.id !== req.id));
    } else {
      setSelected([...selected, req]);
    }
  };

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
      const conductor_asignado = [
        ...new Set(data.map((req) => req.conductor_asignado)),
      ];
      const address_postal_code = [...new Set(data.map((req) => req.address_postal_code))];
      const address_city = [...new Set(data.map((req) => req.address_city))];
      const address_state = [...new Set(data.map((req) => req.address_state))];
      const address_locality = [...new Set(data.map((req) => req.address_locality))];
      const address_street = [...new Set(data.map((req) => req.address_street))];
      const groups = [...new Set(data.map((req) => req.groups[0]))];

      setDataForFilters({
        conductor_asignado,
        address_postal_code,
        address_city,
        address_state,
        address_locality,
        address_street,
        groups,
      });
    }
  }, [data]);

  return (
    <Box sx={{ width: "100%", mb: "3rem" }}>
      <Paper sx={{
        height: "80%",
        overflow: "auto",
        padding: 2,
      }}>
        <Toolbar
          setPage={setPage}
          selected={selected}
          allData={data}
          filteredData={filteredData}
          setOpenFiltersModal={setOpenFiltersModal}
          setUsersToDelete={setRecollectionsToDelete}
          filtersApplied={filtersApplied}
          setVisibleData={setVisibleData}
        />
        <TableContainer sx={{ maxHeight: "100vh" }}>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.background.default }}>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Checkbox
                    checked={generalCheckboxStatus === "checked" ? true : false}
                    onClick={handleGenaeralCheckboxClick}
                    indeterminate={
                      generalCheckboxStatus === "indeterminate" ? true : false
                    }
                    onChange={handleGeneralCheckboxChange}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
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
                    <Typography variant="subtitle2">Email</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Dirección</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Grupo</Typography>
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
              {visibleData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14}>
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      align="center"
                    >
                      No se encontraron solicitudes de recolección
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <React.Fragment key={`row-user-${request.email}`}>
                      <TableRow
                        hover
                        role="checkbox"
                        key={request.id}
                        selected={isRowSelected(request.id)}
                        sx={{
                          cursor: "pointer",
                          bgcolor:
                            showCompleteInfo === request.id && "primary.light",
                          transition: "all 0.3s",
                        }}
                        aria-checked={isRowSelected(request.id) ? true : false}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowCompleteInfo(request.id);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setUserToEdit(request);
                          setRecollectionsToDelete([request]);
                          setRowContextMenuAnchorEl(e.target);
                        }}
                      >
                        <TableCell
                          sx={{
                            borderBottomWidth:
                              showCompleteInfo === request.id ? 0 : 1,
                          }}
                        >
                          <IconButton
                            color="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowCompleteInfo(request.id);
                            }}
                          >
                            <KeyboardArrowDown
                              sx={{
                                transform:
                                  showCompleteInfo === request.id
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                transition: "transform 0.3s",
                              }}
                            />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelected(request);
                            }}
                            checked={isRowSelected(request.id)}
                            inputProps={{
                              "aria-labelledby": request.id,
                            }}
                          />
                        </TableCell>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>
                          {request.first_name + " " + request.last_name}
                        </TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.direccion_completa}</TableCell>
                        <TableCell>{request.groups[0]}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setRecollectionToEdit(request);
                              setUserToEdit(request);
                              setOpenModalEdit(true);
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
                              setRecollectionsToDelete([request]);
                              setOpenModalDeleteGenerator(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{
                            paddingBottom: 0,
                            paddingTop: 0,
                            borderBottomWidth:
                              showCompleteInfo === request.id ? 1 : 0,
                          }}
                          colSpan={10}
                        >
                          <Collapse
                            in={showCompleteInfo === request.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <UserInfoSubTable request={request} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
              )}
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
      <UsersFiltersModal
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
      {openModalCreate &&
        <ModalUser mode={"CREAR"}
          creatorUser={dataUser.user}
          centers={centers}
          recyclingCenters={recyclingCenters}
          collectionCenters={collectionCenters}
        />
      }
      {openModalEdit && (
        <ModalUser
          mode={"EDITAR"}
          creatorUser={dataUser.user}
          userToEdit={userToEdit}
          centers={centers}
          recyclingCenters={recyclingCenters}
          collectionCenters={collectionCenters}
        />
      )}
      <DeleteUserModal users={recollectionsToDelete} />
      {openModalText && (
        <Dialog
          open={openModalText}
          onClose={() => setOpenModalText(false)}
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
