import React, { useState, useContext, useEffect, useRef } from "react";
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
  ClickAwayListener,
  CircularProgress,
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
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import useAuth from "../../hooks/useAuth";
import { ModalGenerator } from "../../pages/ModalGenerator";
import DeleteGeneratorModal from "../modals/DeleteGeneratorModal";
import { generateExcelFromJson } from "../../services/Excel";
import { ModalReport } from "../../pages/ModalReport";
import dateFormater from "../../services/dateFormater";
import { ModalFirmar } from "../../pages/ModalFirmar";
import { ModalResidueReport } from "../../pages/ModalResidueReport";
import validateReport from "../../services/validateReport";
import getReportInfo from "../../services/getReportInfo";
import generateReportPDF from "../../services/generateReportPDF";
import generateQR from "../../services/generateQR";
import DeleteReportsModal from "../modals/DeleteReportsModal";
import ReportsFiltersModal from "../modals/ReportsFiltersModal";
import generateDonorReportPDF from "../../services/generateDonorReportPDF";
import DonorRecollectionInfo from "./DonorRecollectionInfo";
import ReportInfo from "./ReportInfo";
import axios from "axios";
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

function ExportOptionsMenu({
  anchorEl,
  setAnchorEl,
  allData,
  filteredData,
  selectedData,
  setLoadingExport
}) {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportAll = async () => {
    setLoadingExport(true);
    handleClose();
    const newData = JSON.parse(JSON.stringify(allData));
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
    const residues = response.data;

    for (let reportIdx in newData) {
      const dateObj = new Date(newData[reportIdx]['fecha_inicio_reporte']);
      newData[reportIdx]['fecha_inicio_reporte'] = dateObj.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      newData[reportIdx]['hora_inicio_reporte'] = dateObj.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // Para formato 24h
      });
      for (let residue of residues) {
        newData[reportIdx][`${residue.nombre}(kg)`] = 0;
        newData[reportIdx][`${residue.nombre}(m3)`] = 0;
      }
      const query = { reportId: newData[reportIdx].id_report ?? newData[reportIdx].id };
      const responsePerReport = await axios.post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, query);
      const residuesPerReport = responsePerReport.data;
      for (let residue of residuesPerReport) {
        newData[reportIdx][`${residue.residue}(kg)`] = residue.peso;
        newData[reportIdx][`${residue.residue}(m3)`] = residue.volumen;
      }
    }
    generateExcelFromJson(newData, "Reportes");
    setLoadingExport(false);
  };

  const handleExportVisible = async () => {
    //console.log(filteredData)
    setLoadingExport(true);
    handleClose();
    const newData = JSON.parse(JSON.stringify(filteredData));
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
    const residues = response.data;

    for (let reportIdx in newData) {
      const dateObj = new Date(newData[reportIdx]['fecha_inicio_reporte']);
      newData[reportIdx]['fecha_inicio_reporte'] = dateObj.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      newData[reportIdx]['hora_inicio_reporte'] = dateObj.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // Para formato 24h
      });
      for (let residue of residues) {
        newData[reportIdx][`${residue.nombre}(kg)`] = 0;
        newData[reportIdx][`${residue.nombre}(m3)`] = 0;
      }
      const query = { reportId: newData[reportIdx].id_report ?? newData[reportIdx].id };
      const responsePerReport = await axios.post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, query);
      const residuesPerReport = responsePerReport.data;
      for (let residue of residuesPerReport) {
        newData[reportIdx][`${residue.residue}(kg)`] = residue.peso;
        newData[reportIdx][`${residue.residue}(m3)`] = residue.volumen;
      }
    }
    generateExcelFromJson(newData, "Reportes");
    setLoadingExport(false);
  }

  const handleExportSelected = async () => {
    setLoadingExport(true);
    handleClose();
    //console.log(selectedData)
    const dataToExport = allData.filter((report) =>
      selectedData.includes(report.id_report)
    );

    const newData = JSON.parse(JSON.stringify(dataToExport));
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
    const residues = response.data;

    for (let reportIdx in newData) {
      const dateObj = new Date(newData[reportIdx]['fecha_inicio_reporte']);
      newData[reportIdx]['fecha_inicio_reporte'] = dateObj.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      newData[reportIdx]['hora_inicio_reporte'] = dateObj.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // Para formato 24h
      });
      for (let residue of residues) {
        newData[reportIdx][`${residue.nombre}(kg)`] = 0;
        newData[reportIdx][`${residue.nombre}(m3)`] = 0;
      }
      const query = { reportId: newData[reportIdx].id_report ?? newData[reportIdx].id };
      const responsePerReport = await axios.post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, query);
      const residuesPerReport = responsePerReport.data;
      for (let residue of residuesPerReport) {
        newData[reportIdx][`${residue.residue}(kg)`] = residue.peso;
        newData[reportIdx][`${residue.residue}(m3)`] = residue.volumen;
      }
    }

    generateExcelFromJson(newData, "Reportes");
    setLoadingExport(false);
  };

  return (
    <Menu anchorEl={anchorEl} open={open}>
      <ClickAwayListener onClickAway={handleClose}>
        <MenuList>
          <MenuItem onClick={async () => {
            await handleExportAll()
          }}>
            <ListItemIcon>
              <Download />
            </ListItemIcon>
            <ListItemText primary="Exportar todos" />
          </MenuItem>
          <MenuItem onClick={async () => await handleExportVisible()}>
            <ListItemIcon>
              <Visibility />
            </ListItemIcon>
            <ListItemText primary="Exportar visibles" />
          </MenuItem>
          <MenuItem onClick={async () => await handleExportSelected()}>
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
  const [loadingExport, setLoadingExport] = useState(false);
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
            disabled={loadingExport}
          >
            {loadingExport ? <CircularProgress size={20} /> : "Exportar"}
          </Button>
          <Button
            variant="contained"
            size="large"
            color="error"
            startIcon={<Delete />}
            sx={{ m: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              setOpenModalDeleteReport(true);
              setObjectsToDelete(selected);
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
          setLoadingExport={setLoadingExport}
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
        Historial Responsivas
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
        <Button
          variant="outlined"
          size="large"
          color="success"
          startIcon={<Download />}
          sx={{ m: 2 }}
          onClick={(e) => setExportOptionsAnchorEl(e.currentTarget)}
          disabled={loadingExport}
        >
          {loadingExport ? <CircularProgress size={20}/> : "Exportar"}
        </Button>
        <ExportOptionsMenu
          selectedData={selected}
          filteredData={filteredData}
          allData={allData}
          anchorEl={exportOptionsAchorEl}
          setAnchorEl={setExportOptionsAnchorEl}
          setLoadingExport={setLoadingExport}
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
            report.grupo_usuario.toLowerCase().includes(search) ||
            report.folio_reporte.toLowerCase().includes(search) ||
            report.id_report.toString().includes(search)
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

export default function FinishReportsTable({ data }) {

  const [filteredData, setFilteredData] = useState(data);
  const [reportsToDelete, setReportsToDelete] = useState([]);
  const [reportToEdit, setReportToEdit] = useState({});
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [visibleData, setVisibleData] = useState(data);
  const [signType, setSignType] = useState("Generador");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("id_report");
  const [order, setOrder] = useState("desc");
  const [sortedData, setSortedData] = useState([]);

  const dataUser = useAuth();
  const {
    setTextOpenModalText,
    openModalCreateReport,
    openModalEditReport,
    openModalText,
    textOpenModalText,
    setOpenModalText,
    setUpdateReportInfo,
  } = useContext(TodoContext);
  const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [generalCheckboxStatus, setGeneralCheckboxStatus] =
    useState("unchecked");
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);


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
    grupo_usuario: []

  });

  const handleExpandClick = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
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

  const handleSavePDF = async (report) => {
    const validate = await validateReport(report.id_report);
    if (validate == true) {
      const data = await getReportInfo(report.id_report);

      let key_centro = "";
      if (data[0].key_centro_reciclaje != null) {
        key_centro = data[0].key_centro_reciclaje;
      }
      if (data[0].key_centro_recoleccion != null) {
        key_centro = data[0].key_centro_recoleccion;
      }

      const folio_busqueda =
        data[0].key_grupo_usuario + "-" + key_centro + "-" + report.id_report;

      const qrImage = await generateQR(
        "https://rewards.rennueva.com/tracking-external/" + folio_busqueda // Aquí deberías poner la URL correcta para el reporte
      );
      if (report.grupo_usuario === "Donador") {
        generateDonorReportPDF(report, data, qrImage);
      } else {
        generateReportPDF(report, data, qrImage);
      }
    } else {
      setOpenModalText(true);
      setTextOpenModalText(
        "No se puede generar el reporte, aun no se han firmado todos los campos"
      );
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
      const grupo_usuario = [...new Set(data.map((report) => report.grupo_usuario))];

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
        grupo_usuario
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
          height: '80vh',
          overflow: 'auto',
          padding: 2
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
        <TableContainer sx={{ maxHeight: '68vh' }}>
          <Table stickyHeader>
            <TableHead sx={{ bgcolor: theme.palette.background.default }}>
              <TableRow>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2"> </Typography>
                  </TableSortLabel>
                </TableCell>
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
                    direction={order}
                    onClick={() => {
                      setOrderBy("nombre_real_usuario")
                      setOrder(order === "asc" ? "desc" : "asc")
                    }}
                    active={orderBy === "nombre_real_usuario" ? true : false}
                  >
                    <Typography variant="subtitle2">Nombre</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    direction={order}
                    onClick={() => {
                      setOrderBy("apellido_usuario")
                      setOrder(order === "asc" ? "desc" : "asc")
                    }}
                    active={orderBy === "apellido_usuario" ? true : false}
                  >
                    <Typography variant="subtitle2">Apellidos</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Teléfono</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    direction={order}
                    onClick={() => {
                      setOrderBy("direccion_completa_usuario")
                      setOrder(order === "asc" ? "desc" : "asc")
                    }}
                    active={orderBy === "direccion_completa_usuario" ? true : false}
                  >
                    <Typography variant="subtitle2">Dirección Completa</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Fecha de inicio</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">PDF</Typography>
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
                        selected={isRowSelected(report.id_report)}
                        sx={{ cursor: "pointer" }}
                        aria-checked={
                          isRowSelected(report.id_report) ? true : false
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelected(report.id_report);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setReportToEdit(report);
                          setReportsToDelete([report.id_report]);
                          setRowContextMenuAnchorEl(e.target);
                        }}
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
                        <TableCell>
                          <Checkbox
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelected(report.id_report);
                            }}
                            checked={isRowSelected(report.id_report)}
                            inputProps={{
                              "aria-labelledby": report.id_report,
                            }}
                          />
                        </TableCell>

                        <TableCell>{report.id_report}</TableCell>
                        <TableCell>{report.nombre_real_usuario}</TableCell>
                        <TableCell>{report.apellido_usuario}</TableCell>
                        <TableCell>{report.telefono_usuario}</TableCell>
                        <TableCell>{report.direccion_completa_usuario}</TableCell>
                        <TableCell>
                          {dateFormater(report.fecha_inicio_reporte)}
                        </TableCell>
                        <TableCell>
                          <Button
                            startIcon={<SaveAlt />}
                            variant="contained"
                            size="small"
                            color={
                              report.firma_responsiva_generador &&
                                report.firma_responsiva_receptor &&
                                report.residuos_agregados
                                ? "success"
                                : "warning"
                            }
                            onClick={async (e) => {
                              e.stopPropagation();
                              await handleSavePDF(report);
                            }}
                          >
                            Descargar
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
                            <ReportInfo request={report} />
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
          count={visibleData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ModalFirmar type={signType} id={reportToEdit} />
      <ModalResidueReport report={reportToEdit} />
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
