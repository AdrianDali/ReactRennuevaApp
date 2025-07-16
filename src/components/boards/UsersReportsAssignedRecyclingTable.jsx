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
  Draw,
  SaveAlt,
  Close,
  Watch,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Assignment,
  InfoOutlined,
  DateRange,
  AccountCircle,
  Phone,
  CheckCircle,
  Warning,
  WarningAmber,
  CheckCircleOutline,
  PhoneEnabled,
  PhoneDisabled,
  PhoneInTalk,
  Business,
  LocalOffer,
  Place,
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
import OrderInfoRecycling from "./OrderInfoRecycling";
import CheckRecyclingOrder from "../../components/modals/CheckRecyclingOrder";
import { ModalOrderResidueDetail } from "../../components/modals/UserReportsAssignedRecyclingModal";
import FinishVerificationDialog from "../modals/FinishVerificationDialog";
import getSingleReport from "../../services/ApGetSingleReport";
import finishVerifiedDonorReport from "../../services/ApiFinishVerifiedDonorReport";

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
      selectedData.includes(report.id_report)
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
        Residuos de usuarios asignados
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

export default function UsersReportsAssignedRecyclingTable({ data }) {
  const [filteredData, setFilteredData] = useState(data);
  const [reportsToDelete, setReportsToDelete] = useState([]);
  const [reportToEdit, setReportToEdit] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [visibleData, setVisibleData] = useState(data);
  const [signType, setSignType] = useState("Generador");
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
    openModalEditResidueReport,
    userReportsAssignedRecycling, setUserReportsAssignedRecycling,
    openFinishVerificationModal, setOpenFinishVerificationModal,

  } = useContext(TodoContext);
  //const  [openModalFinishReport, setOpenModalFinishReport] = useState(false);
  const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [generalCheckboxStatus, setGeneralCheckboxStatus] =
    useState("unchecked");
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  

  const [openModalCheckRecyclingOrder, setOpenModalCheckRecyclingOrder] =
    useState(false);

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

  const handleGenaeralCheckboxClick = (e) => {
    e.stopPropagation();
    if (generalCheckboxStatus === "checked") {
      setGeneralCheckboxStatus("unchecked");
    } else {
      setGeneralCheckboxStatus("checked");
    }
  };

  const handleCloseModal = () => {
    setOpenModalCheckRecyclingOrder(false);
  };

  const handleEditResidues = (report) => {
    setReportToEdit(report);
    console.log(report);
    setUserReportsAssignedRecycling(true)
    setOpenModalCheckRecyclingOrder(true);
    //setOpenModalEditResidueReport(true);
    //setOpenModalCheckRecyclingOrder(true);
  };

  const handleFinishReport = (report) => {
    setReportToEdit(report);
    setOpenFinishVerificationModal(true);
  };

  const finalizarVerificacion = async (report) => {
    if (report) {
  console.log("Finalizando verificación del reporte:", report);

  const idToUse = report.reportes[0]?.id_report ?? report.id_report;
  const validate = await validateReport(idToUse);
  if (validate === true) {
    const data = await getReportInfo(idToUse);

    let key_centro = "";
    if (data[0]?.key_centro_reciclaje != null) {
      key_centro = data[0].key_centro_reciclaje;
    }
    if (data[0]?.key_centro_recoleccion != null) {
      key_centro = data[0].key_centro_recoleccion;
    }

    const folio_busqueda =
      data[0]?.key_grupo_usuario + "-" + key_centro + "-" + idToUse;

    const qrImage = await generateQR(
      "https://rewards.rennueva.com/tracking-external/" + folio_busqueda
    );

    const singleReport = await getSingleReport(idToUse);

    // Aquí generas el PDF según el grupo
    if (singleReport?.grupo_usuario === "Donador") {
      generateDonorReportPDF(singleReport, data, qrImage);
    } else {
      generateReportPDF(singleReport, data, qrImage);
    }

    // === Llama al servicio para finalizar el reporte y la orden ===
    const result = await finishVerifiedDonorReport(idToUse);

    if (result.error) {
      setOpenModalText(true);
      setTextOpenModalText(
        result.detail?.error ||
        "Ocurrió un error al finalizar el reporte. Intenta de nuevo."
      );
      return;
    }

    // Éxito: muestra mensaje de éxito, puedes refrescar datos si lo necesitas
    setOpenModalText(true);
    setTextOpenModalText(result.message || "Reporte finalizado correctamente");
    // Ejemplo: setUpdateReportInfo(prev => !prev); // si necesitas refrescar la tabla
  } else {
    setOpenModalText(true);
    setTextOpenModalText(
      "No se puede generar el reporte, aun no se han firmado todos los campos"
    );
  }
}

    };

  const handleGeneralCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelected(data.map((report) => report.id_report));
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
        <TableContainer
          sx={{
            maxHeight: "calc(70vh - 64px)",
            overflowY: "auto",
            backgroundColor: "background.paper",
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
                <TableCell />
                <TableCell>
                  <Checkbox
                    checked={generalCheckboxStatus === "checked"}
                    indeterminate={generalCheckboxStatus === "indeterminate"}
                    onClick={handleGenaeralCheckboxClick}
                    onChange={handleGeneralCheckboxChange}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">ID Orden</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Peso Total</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Volumen Total</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Folio Reporte</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Verificación</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="subtitle2">Finalizar</Typography>
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {visibleData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12}>
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
                  .map((order) => (
                    <React.Fragment key={`order-${order.id_order}`}>
                      <TableRow
                        hover
                        role="checkbox"
                        selected={isRowSelected(order.id_order)}
                        sx={{
                          "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                          "&:hover": { bgcolor: "action.selected" },
                          transition: "background-color 0.2s ease",
                        }}
                        aria-checked={isRowSelected(order.id_order)}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelected(order.id_order);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setReportToEdit(order);
                          setReportsToDelete([order.id_order]);
                          setRowContextMenuAnchorEl(e.target);
                        }}
                      >
                        {/* Expand/Collapse */}
                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandClick(order.id_order);
                            }}
                            size="small"
                          >
                            {expandedRow === order.id_order ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                        {/* Checkbox */}
                        <TableCell>
                          <Checkbox
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelected(order.id_order);
                            }}
                            checked={isRowSelected(order.id_order)}
                            inputProps={{
                              "aria-labelledby": order.id_order,
                            }}
                          />
                        </TableCell>
                        {/* Datos */}
                        <TableCell>{order.id_order}</TableCell>
                        <TableCell>
                          {order.peso_total_orden !== null
                            ? `${order.peso_total_orden} Kg`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {order.m3_total_orden !== null
                            ? `${order.m3_total_orden} m³`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {order.reportes?.[0]?.folio ?? "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            startIcon={<Visibility />}
                            variant="contained"
                            size="small"
                            color="info"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditResidues(order);
                            }}
                          >
                            Verificar
                          </Button>
                        </TableCell>

                        <TableCell>
                          <Button
                            startIcon={<Visibility />}
                            variant="contained"
                            size="small"
                            color="success"
                          

                            onClick={(e) => {
                              e.stopPropagation();
                              handleFinishReport(order);
                            }}
                          >
                            Finalizar
                          </Button>
                        </TableCell>
                        

                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={12}
                        >
                          <Collapse
                            in={expandedRow === order.id_order}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                mx: 3,
                                my: 2,
                                background: "#fff",
                                borderRadius: 2,
                                border: "1px solid #eee",
                                p: 2,
                                boxShadow: "0px 1px 4px rgba(0,0,0,0.02)",
                              }}
                            >
                              {order.reportes && order.reportes.length > 0 ? (
                                order.reportes.map((reporte) => (
                                  <Box
                                    key={reporte.id_report}
                                    sx={{
                                      mb: 2,
                                      pb: 1,
                                      borderBottom: "1px dashed #eee",
                                      "&:last-child": { borderBottom: "none" },
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <Assignment
                                        fontSize="small"
                                        sx={{ mr: 1, color: "primary.main" }}
                                      />
                                      <Typography variant="body2">
                                        <b>Folio:</b> {reporte.folio}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <InfoOutlined
                                        fontSize="small"
                                        sx={{ mr: 1, color: "info.main" }}
                                      />
                                      <Typography variant="body2">
                                        <b>Status:</b> {reporte.status_reporte}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <DateRange
                                        fontSize="small"
                                        sx={{ mr: 1, color: "success.main" }}
                                      />
                                      <Typography variant="body2">
                                        <b>Fecha:</b>{" "}
                                        {reporte.report_date
                                          ? new Date(
                                              reporte.report_date
                                            ).toLocaleString("es-MX")
                                          : "-"}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <AccountCircle
                                        fontSize="small"
                                        sx={{ mr: 1, color: "secondary.main" }}
                                      />
                                      <Typography variant="body2">
                                        <b>Usuario:</b>{" "}
                                        {reporte.usuario?.username}{" "}
                                        <Phone
                                          fontSize="inherit"
                                          sx={{
                                            ml: 1,
                                            mr: 0.5,
                                            color: "grey.600",
                                          }}
                                        />
                                        {reporte.usuario?.telefono}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <Business
                                        fontSize="small"
                                        sx={{ mr: 1, color: "warning.main" }}
                                      />
                                      <Typography variant="body2">
                                        <b>Empresa:</b>{" "}
                                        {reporte.usuario?.company}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <LocalOffer
                                        fontSize="small"
                                        sx={{ mr: 1, color: "info.main" }}
                                      />
                                      <Typography variant="body2">
                                        <b>RFC:</b> {reporte.usuario?.rfc}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <Place
                                        fontSize="small"
                                        sx={{ mr: 1, color: "error.main" }}
                                      />
                                      <Typography variant="body2">
                                        <b>Dirección:</b>{" "}
                                        {[
                                          reporte.direccion?.calle,
                                          reporte.direccion?.num_ext,
                                          reporte.direccion?.localidad,
                                          reporte.direccion?.ciudad,
                                          reporte.direccion?.estado,
                                          `CP ${reporte.direccion?.cp}`,
                                        ]
                                          .filter(Boolean)
                                          .join(", ")}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <InfoOutlined
                                        fontSize="small"
                                        sx={{ mr: 1, color: "grey.600" }}
                                      />
                                      <Typography variant="body2">
                                        <b>Referencia:</b>{" "}
                                        {reporte.direccion?.referencia}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))
                              ) : (
                                <Typography variant="body2">
                                  No hay reportes para esta orden.
                                </Typography>
                              )}
                            </Box>
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

      <ModalFirmar type={signType} id={reportToEdit} />
      <ModalWatchResidueReport report={reportToEdit} />

       <FinishVerificationDialog onFinish={() => finalizarVerificacion(reportToEdit)} />


      {openModalCheckRecyclingOrder && (
        <ModalOrderResidueDetail
          
          orderReport={reportToEdit}
        />
      )}


      
      {/* <ModalFinishReport report={reportToEdit} /> */}
      <DeleteReportsModal reports={reportsToDelete} />
      <ReportsFiltersModal
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
