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
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  FormHelperText,
  Stack,
  Chip,
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
  Draw,
  SaveAlt,
  Close,
  Watch,
} from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import React, { useState, useContext, useEffect, useRef } from "react";
import { ModalGenerator } from "../../pages/ModalGenerator";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import DeleteGeneratorModal from "../modals/DeleteGeneratorModal";
import { generateExcelFromJson } from "../../services/Excel";
import { ModalReport } from "../../pages/ModalReport";
import dateFormater from "../../services/dateFormater";
import { ModalFirmar } from "../../pages/ModalFirmar";
import ModalWatchResidueReport from "../../pages/ModalWatchResidueReport";
import validateReport from "../../services/validateReport";
import getReportInfo from "../../services/getReportInfo";
import generateReportPDF from "../../services/generateReportPDF";
import generateQR from "../../services/generateQR";
import DeleteReportsModal from "../modals/DeleteReportsModal";
import ReportsFiltersModal from "../modals/ReportsFiltersModal";
import generateDonorReportPDF from "../../services/generateDonorReportPDF";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReportInfoRecycling from "./ReportInfoRecycling";
import { ModalFinishReport } from "../../pages/ModalFinishReport";
import VerificationReportModal from "../../pages/VerificationReportModal";
import { set } from "date-fns";
import axios from "axios";
import OrderInfoCollapse from "./OrderInfoCollapse";
import { useMediaQuery, useTheme } from "@mui/material";
import { ModalWeightVolumeReport } from "../../pages/WeightVolumeDialog";
import { statusColor, statusText } from "../../helpers/statusModifiers";

function MobileToolbar({
  selected,
  setOpenFiltersModal,
  filtersApplied,
  filteredData,
  allData,
  setVisibleData,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openModalCreateReport, setOpenModalCreateReport] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreate = (e) => {
    console.log("Crear");
    setOpenModalCreateReport(true);
    handleClose();
  };

  const handleFilter = (e) => {
    console.log("Filtrar");
    setOpenFiltersModal(true);
    handleClose();
  };

  const handleSearch = (e) => {
    setOpenSearchModal(true);
    handleClose();
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        py={2}
      >
        <Typography
          variant="h4"
          component="div"
          color="primary"
          sx={{ p: 2, flexShrink: 2 }}
        >
          Responsivas en proceso
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
          }}
        >
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                style: {
                  maxHeight: 48 * 4.5,
                  width: "15ch",
                },
              },
            }}
          >
            <MenuList>
              <MenuItem onClick={handleCreate} color="info">
                <ListItemIcon>
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
                  <ListItemIcon>
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
      <SearchingModal
        isOpen={openSearchModal}
        setOpen={setOpenSearchModal}
        filteredData={filteredData}
        setVisibleData={setVisibleData}
      />
      <CreateDonorReportModal
        isOpen={openModalCreateReport}
        setOpen={setOpenModalCreateReport}
      />
    </>
  );
}

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
    generateExcelFromJson(allData, "Reportes");
    handleClose();
  };

  const handleExportVisible = () => {
    //console.log(filteredData)
    generateExcelFromJson(filteredData, "Reportes");
    handleClose();
  };

  const handleExportSelected = () => {
    //console.log(selectedData)
    const dataToExport = allData.filter((report) =>
      selectedData.includes(report.id)
    );
    //console.log(dataToExport)
    generateExcelFromJson(dataToExport, "Reportes");
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

function Toolbar({
  selected,
  setOpenFiltersModal,
  setObjectsToDelete,
  filtersApplied,
  filteredData,
  allData,
  setVisibleData,
}) {
  const { setOpenModalDeleteReport, setOpenModalCreateReport } =
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
          {`${selected.length} ${
            selected.length === 1 ? "seleccionado" : "seleccionados"
          }`}
        </Typography>
        <Box></Box>
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
        Ordenes a Centro Acopio Asignadas
      </Typography>
      <Box>
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
            report.colonia_usuario.toLowerCase().includes(search) ||
            report.grupo_usuario.toLowerCase().includes(search)
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

export default function ReportInfoDonor({ data }) {
  console.log("DriverCenterAssignedTable");
  console.log(data);
  const [filteredData, setFilteredData] = useState(data);
  const [reportsToDelete, setReportsToDelete] = useState([]);
  const [reportToEdit, setReportToEdit] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [visibleData, setVisibleData] = useState(data);
  const [signType, setSignType] = useState("Donador Recoleccion");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openVerificationModal, setOpenVerificationModal] = useState(false);

  const dataUser = useAuth();

  //console.log(data);
  const {
    setTextOpenModalText,
    openModalCreateReport,
    openModalEditReport,
    openModalText,
    textOpenModalText,
    setOpenModalText,
    setOpenModalEditResidueReport,
    setUpdateReportInfo,
    openModalFinishReport,
    setOpenModalEditReport,
    setOpenModalEditFirma,
    setOpenModalDeleteReport,
    openModalWeightVolumeReport,
    setOpenModalWeightVolumeReport,
  } = useContext(TodoContext);

  //const  [openModalFinishReport, setOpenModalFinishReport] = useState(false);
  const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [generalCheckboxStatus, setGeneralCheckboxStatus] =
    useState("unchecked");
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [openResiduoModal, setOpenResiduoModal] = useState(false);
  const [residueReportInfo, setResidueReportInfo] = useState([]);
  const [residuesPerOrderRecollection, setResiduesPerOrderRecollection] =
    useState([]);
  const [residueIndex, setResidueIndex] = useState(null);
  const [residues, setResidues] = useState([]);
  const [editedResidueName, setEditedResidueName] = useState("");
  const [editedPeso, setEditedPeso] = useState("");
  const [editedVolumen, setEditedVolumen] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [statusResidue, setStatusResidue] = useState("");
  const [idOrderSelected, setIdOrderSelected] = useState(null);
  const [reportResidueId, setReportResidueId] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handleGenaeralCheckboxClick = (e) => {
    e.stopPropagation();
    if (generalCheckboxStatus === "checked") {
      setGeneralCheckboxStatus("unchecked");
    } else {
      setGeneralCheckboxStatus("checked");
    }
  };

  const handleEditResidues = (report) => {
    setReportToEdit(report);
    setOpenModalEditResidueReport(true);
  };

  const handleVerifyReport = (report) => {
    setReportToEdit(report);
    setOpenVerificationModal(true);
  };

  const handleGeneralCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelected(data.map((report) => report.id));
    } else if (e.target.indeterminate) {
      setSelected(selected);
    } else {
      setSelected([]);
    }
  };

  const isRowSelected = (id) => selected.indexOf(id) !== -1;

  const toggleSelected = (id) => {
    if (isRowSelected(id)) {
      setSelected(selected.filter((selectedId) => selectedId !== id));
    } else {
      setSelected([...selected, id]);
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
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
      .then((response) => {
        const data = response.data;
        console.log("Residuos:", data);
        setResidues(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onEditGeneratorSign = (id) => {
    console.log("Edit Generador Sign", id);
    setReportToEdit(id);
    setSignType("Donador Recoleccion");
    setOpenModalEditFirma(true);
  };

  const onEditReceiverSign = (id) => {
    console.log("Edit Receptor Sign", id);
    setReportToEdit(id);
    setSignType("Conductor Recoleccion");
    setOpenModalEditFirma(true);
  };

  // Sx común para todos los botones, ajustando tipografía e íconos
  const buttonSx = {
    textTransform: "none",
    fontWeight: 600,
    fontSize: isMobile ? "0.75rem" : "0.875rem",
    borderRadius: 1,
    px: isMobile ? 1 : 2,
    py: isMobile ? 0.5 : 1,
    height: isMobile ? 36 : 40,
    "& .MuiButton-startIcon": {
      mr: isMobile ? 0.5 : 1,
      "& svg": {
        fontSize: isMobile ? 18 : 20,
      },
    },
  };

  // Sx para IconButton de eliminar y expandir (adaptado a móvil)
  const iconButtonSx = {
    p: isMobile ? 0.5 : 1,
    "& svg": {
      fontSize: isMobile ? 20 : 24,
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        mb: "3rem",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2, // esquinas redondeadas
          boxShadow: 1, // sombra ligera
          p: 2, // padding interno
          bgcolor: "background.paper",
        }}
      >
        <Toolbar
          selected={selected}
          allData={data}
          filteredData={filteredData}
          setOpenFiltersModal={setOpenFiltersModal}
          setObjectsToDelete={setReportsToDelete}
          filtersApplied={filtersApplied}
          setVisibleData={setVisibleData}
        />

        {!isMobile && (
          <TableContainer
            sx={{
              maxHeight: "calc(70vh - 64px)", // ajusta según tu Toolbar/TablePagination
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "grey.400",
                borderRadius: 3,
              },
            }}
          >
            <Table>
              <TableHead
                sx={{
                  bgcolor: "primary.main",
                  "& .MuiTableCell-root": {
                    color: "common.white",
                    borderBottom: "2px solid",
                    borderColor: "primary.dark",
                    "& .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <TableRow>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2"> </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={
                        generalCheckboxStatus === "checked" ? true : false
                      }
                      onClick={handleGenaeralCheckboxClick}
                      indeterminate={
                        generalCheckboxStatus === "indeterminate" ? true : false
                      }
                      onChange={handleGeneralCheckboxChange}
                    />
                  </TableCell>

                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">ID+</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">
                        Nombre Donador
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">
                        Fecha Solicitud
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Direccion</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Firma Donador</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Residuos</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">
                        Firma Conductor
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Status</Typography>
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2">Editar</Typography>
                  </TableCell>

                  {/* <TableCell>
                  <Typography variant="subtitle2">Status</Typography>
                </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleData.length === 0 ? (
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
                  visibleData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report, index) => (
                      <React.Fragment key={`report-assigned-${index}`}>
                        <TableRow
                          hover
                          role="checkbox"
                          key={`${report.id}-${index}`}
                          selected={isRowSelected(report.id)}
                          sx={{ cursor: "pointer" }}
                          aria-checked={isRowSelected(report.id) ? true : false}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelected(report.id);
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setReportToEdit(report);
                            setReportsToDelete([report.id]);
                            setRowContextMenuAnchorEl(e.target);
                          }}
                        >
                          <TableCell>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExpandClick(report.id);
                              }}
                            >
                              {expandedRow === report.id ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelected(report.id);
                              }}
                              checked={isRowSelected(report.id)}
                              inputProps={{
                                "aria-labelledby": report.id,
                              }}
                            />
                          </TableCell>

                          <TableCell>{report.id}</TableCell>
                          <TableCell>{report.nombre}</TableCell>

                          <TableCell>{report.fecha}</TableCell>

                          <TableCell>{report.direccion_completa}</TableCell>
                          <TableCell>
                            <Button
                              startIcon={<Draw />}
                              variant="contained"
                              size="small"
                              color={
                                report.firma_donador ? "success" : "warning"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditGeneratorSign(report.id);
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
                              color={report.residuos ? "success" : "warning"}
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Agregar residuos");
                                console.log("report", report);
                                setReportToEdit(report);
                                setOpenModalWeightVolumeReport(true);
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
                              color={
                                report.firma_receptor ? "success" : "warning"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditReceiverSign(report.id);
                              }}
                            >
                              Firmar
                            </Button>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={statusText(report.status)}
                              color={statusColor(report.status)}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setReportToEdit(report);
                                setOpenModalEditReport(true);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </TableCell>
                          {/* <TableCell>
                          <Button
                            startIcon={<Visibility />}
                            variant="contained"
                            size="small"
                            color="info"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditResidues(report);
                            }}
                          >
                            Verificar
                          </Button>
                        </TableCell> */}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={18}
                          >
                            <Collapse
                              in={expandedRow === report.id}
                              timeout="auto"
                              unmountOnExit
                            >
                              <OrderInfoCollapse request={report} />
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {isMobile && (
  <Stack spacing={1} sx={{ px: 1, py: 1 }}>
    {visibleData.length === 0 ? (
      <Typography
        variant="subtitle1"
        color="textSecondary"
        align="center"
        sx={{ my: 3 }}
      >
        No se encontraron reportes
      </Typography>
    ) : (
      visibleData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((report) => (
          <Paper
            key={report.id}
            elevation={1}
            sx={{
              borderRadius: 2,
              p: 1.5,
              position: "relative",
              bgcolor: "background.paper",
            }}
          >
            {/* Header: ID + fecha */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={0.5}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {/* Checkbox de selección */}
                <Checkbox
                  checked={isRowSelected(report.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelected(report.id);
                  }}
                  size="small"
                  inputProps={{ "aria-labelledby": report.id }}
                />
                <Typography variant="body1" fontWeight={600}>
                  #{report.id}
                </Typography>
              </Stack>
              <Typography variant="caption" color="textSecondary">
                {new Date(report.fecha).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Stack>

            {/* Detalles */}
            <Stack spacing={0.5} sx={{ mt: 0.5 }}>
              <Typography variant="caption">
                <strong>Donador:</strong> {report.nombre}
              </Typography>
              <Typography variant="caption">
                <strong>Dirección:</strong> {report.direccion_completa}
              </Typography>
            </Stack>

            {/* Acciones */}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                overflowX: "auto",
                py: 0.5,
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {/* Firma donador */}
              <Button
                startIcon={<Draw />}
                variant="contained"
                size="small"
                fullWidth
                sx={{
                  bgcolor: report.firma_donador
                    ? "success.main"
                    : "warning.main",
                  "&:hover": {
                    bgcolor: report.firma_donador
                      ? "success.dark"
                      : "warning.dark",
                  },
                }}
                onClick={() => onEditGeneratorSign(report.id)}
              >
                Firmar
              </Button>

              {/* Agregar residuos */}
              <Button
                startIcon={<Add />}
                variant="contained"
                size="small"
                fullWidth
                sx={{
                  bgcolor: report.residuos
                    ? "success.main"
                    : "warning.main",
                  "&:hover": {
                    bgcolor: report.residuos
                      ? "success.dark"
                      : "warning.dark",
                  },
                }}
                onClick={() => {
                  setReportToEdit(report);
                  setOpenModalWeightVolumeReport(true);
                }}
              >
                Agregar
              </Button>

              {/* Firma receptor */}
              <Button
                startIcon={<Draw />}
                variant="contained"
                size="small"
                fullWidth
                sx={{
                  bgcolor: report.firma_receptor
                    ? "success.main"
                    : "warning.main",
                  "&:hover": {
                    bgcolor: report.firma_receptor
                      ? "success.dark"
                      : "warning.dark",
                  },
                }}
                onClick={() => onEditReceiverSign(report.id)}
              >
                Firmar R.
              </Button>

              {/* Editar reporte */}
              <IconButton
                onClick={() => {
                  setReportToEdit(report);
                  setOpenModalEditReport(true);
                }}
              >
                <Edit />
              </IconButton>

              {/* Eliminar */}
              <IconButton
                color="error"
                onClick={() => {
                  setReportsToDelete([report.id]);
                  setOpenModalDeleteReport(true);
                }}
              >
                <Delete />
              </IconButton>

              {/* Expandir/Colapsar */}
              <IconButton
                onClick={() =>
                  setExpandedRow(
                    expandedRow === report.id ? null : report.id
                  )
                }
              >
                {expandedRow === report.id ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Stack>

            {/* Estado */}
            <Stack direction="row" alignItems="center" sx={{ mt: 0.5 }}>
              <Chip
                label={statusText(report.status)}
                color={statusColor(report.status)}
                variant="outlined"
                size="small"
              />
            </Stack>

            {/* Collapse detalles extra */}
            <Collapse
              in={expandedRow === report.id}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ mt: 1 }}>
                <OrderInfoCollapse request={report} />
              </Box>
            </Collapse>
          </Paper>
        ))
    )}
  </Stack>
)}



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
      {openModalWeightVolumeReport && (
        <ModalWeightVolumeReport report={reportToEdit} />
      )}
    </Box>
  );
}
