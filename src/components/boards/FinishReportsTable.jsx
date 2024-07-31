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


    const handleDataImported = async (data) => {
        console.log("Datos importados:", data);
        console.log(data[0].Tipo);
    
        let url = "http://127.0.0.1:8000/Rennueva"; // URL base
    
        if (data[0].Tipo === "Generador") {
          console.log("Es un archivo de usuarios");
          // Suponiendo que tienes una URL para crear usuarios
          url += "/create-generator/";
        } else if (data[0].Tipo === "Centro de Reciclaje") {
          console.log("Es un archivo de reciclaje");
          url += "/creat-recycling-center/";
        } else if (data[0].Tipo === "Centro de Recoleccion") {
          console.log("Es un archivo de recolección");
          url += "/creat-collection-center/";
        } else if (data[0].Tipo === "Responsiva") {
          console.log("Es un archivo de responsiva");
          url += "/import-report/";
        }
        else {
          console.log("Tipo desconocido");
          return; // Salir si el tipo no es reconocido
        }
    
        // Realizar la consulta
        try {
          console.log("####################################");
          console.log("Enviando datos:", JSON.stringify(data));
    
          const response = axios
            .post(`${url}`, data)
            .then(response => {
              const data = response.data;
              console.log("Respuesta del servidor:", data);
              if (data.error) {
                setTextOpenModalText("Error al crear Generador(es) con el archivo Excel, se lograron crear: " + data.usuarios_creados + " Generadores error en la creacion por: " + data.error);
                setOpenModalText(true);
              }
              if (data.message === "Responsivas creadas") {
                setTextOpenModalText("Responsivas creadas correctamente con el archivo Excel, se crearon: " + data.responsivas_creadas + " Responsivas");
                setOpenModalText(true);
              }
              if (data.error_responsiva) {
                setTextOpenModalText("Error al crear Responsivas con el archivo Excel, se lograron crear: " + data.responsivas_creadas + " Responsivas error en la creacion por: " + data.error_responsiva);
                setOpenModalText(true);
              }
              if (data.message === "Generador creado") {
                setTextOpenModalText("Generador(es) creado(s) correctamente con el archivo Excel, se crearon: " + data.usuarios_creados + " Generadores");
                setOpenModalText(true);
              }
              if (data.message === "error") {
                setTextOpenModalText("Error al crear Generador(es) con el archivo Excel, se lograron crear: " + data.usuarios_creados + " Generadores error en la creacion por: " + data.error);
                setOpenModalText(true);
              }
    
    
    
    
    
    
            })
            .catch(error => {
              console.error(error);
            })
    
          console.log("Respuesta del servidor:", response.data);
        } catch (error) {
          console.error("Error al realizar la consulta:", error);
        }
      };
  
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
          >
            Exportar
          </Button>
          {/* <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<Add />}
            sx={{ m: 2 }}
            onClick={() => {
              setOpenModalCreateReport(true);
            }}
          >
            Nuevo
          </Button> */}
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
            label="Búscar"
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
  
    const dataUser = useAuth();
  
    //console.log(data)
    const {
      setTextOpenModalText,
      openModalCreateReport,
      openModalEditReport,
      setOpenModalDeleteReport,
      setOpenModalEditReport,
      openModalText,
      textOpenModalText,
      setOpenModalText,
      setOpenModalEditResidueReport,
      setOpenModalEditFirma,
      setUpdateReportInfo,
    } = useContext(TodoContext);
    const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
    const [selected, setSelected] = useState([]);
    const [generalCheckboxStatus, setGeneralCheckboxStatus] =
      useState("unchecked");
    const [openFiltersModal, setOpenFiltersModal] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
  
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
      grupo_usuario : []
  
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
  
    const onEditGeneratorSign = (id) => {
      setReportToEdit(id);
      setSignType("Generador");
      setOpenModalEditFirma(true);
    };
  
    const onEditReceiverSign = (id) => {
      setReportToEdit(id);
      setSignType("Receptor");
      setOpenModalEditFirma(true);
    };
  
    const handleEditResidues = (report) => {
      setReportToEdit(report);
      setOpenModalEditResidueReport(true);
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
        const grupo_usuario = [ ...new Set(data.map((report) => report.grupo_usuario))];
  
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
          <TableContainer sx = {{ maxHeight: '68vh' }}>
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
                      <Typography variant="subtitle2">Apellidos</Typography>
                    </TableSortLabel>
                  </TableCell>
                  {/* <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">RFC</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">
                        Correo electrónico
                      </Typography>
                    </TableSortLabel>
                  </TableCell> */}
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Teléfono</Typography>
                    </TableSortLabel>
                  </TableCell>                
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Direccion Completa</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Fecha de inicio</Typography>
                    </TableSortLabel>
                  </TableCell>
                  {/* <TableCell>
                    <Typography variant="subtitle2">Firma generador</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Residuos</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Firma receptor</Typography>
                  </TableCell> */}
                  <TableCell>
                    <Typography variant="subtitle2">PDF</Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Typography variant="subtitle2">Editar</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Borrar</Typography>
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
                          {/* <TableCell>{report.rfc_usuario}</TableCell>
                          <TableCell>{report.email_usuario}</TableCell> */}
                          <TableCell>{report.telefono_usuario}</TableCell>
                          <TableCell>{report.direccion_completa_usuario}</TableCell>
                          {/* <TableCell>{report.calle_usuario}</TableCell>
                          <TableCell>{report.colonia_usuario}</TableCell>
                          <TableCell>{report.cp_usuario}</TableCell>
                          <TableCell>{report.ciudad_usuario}</TableCell>
                          <TableCell>{report.estado_usuario}</TableCell> */}
                          <TableCell>
                            {dateFormater(report.fecha_inicio_reporte)}
                          </TableCell>
                          {/* <TableCell>
                            <Button
                              startIcon={<Draw />}
                              variant="contained"
                              size="small"
                              color={
                                report.firma_responsiva_generador
                                  ? "success"
                                  : "warning"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditGeneratorSign(report.id_report);
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
                          <TableCell>
                            <Button
                              startIcon={<Draw />}
                              variant="contained"
                              size="small"
                              color={
                                report.firma_responsiva_receptor
                                  ? "success"
                                  : "warning"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditReceiverSign(report.id_report);
                              }}
                            >
                              Firmar
                            </Button>
                          </TableCell> */}
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
                          {/* <TableCell>
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
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReportsToDelete([report.id_report]);
                                setOpenModalDeleteReport(true);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell> */}
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
  