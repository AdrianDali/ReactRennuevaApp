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
  useTheme,
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
//import ReportInfo from "./ReportInfo";
import axios from "axios";

function ReportInfo({ report }) {
  const theme = useTheme();

  return (
    <Box margin={1}>
      <Typography variant="h6" gutterBottom component="div">
        Residuos
      </Typography>
      {report.residues.length === 0 ? (
        <Typography>No hay residuos</Typography>
      ) : (
        <Table size="small" aria-label="residues">
          <TableHead>
            <TableRow>
              <TableCell>ID de Residuo</TableCell>
              <TableCell>Nombre del Residuo</TableCell>
              <TableCell>Estado de Verificación</TableCell>
              <TableCell>Cantidad (kg)</TableCell>
              <TableCell>Cantidad (m³)</TableCell>
              <TableCell>Mediciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.residues.map((residue) => {
              // Determinar el color basado en el estado de verificación
              let statusColor;
              switch (residue.verification_status) {
                case 'VERIFICADO':
                  statusColor = theme.palette.success.main;
                  break;
                case 'NO_VERIFICADO':
                  statusColor = theme.palette.warning.main;
                  break;
                case 'REPORTADO':
                  statusColor = theme.palette.error.main;
                  break;
                default:
                  statusColor = theme.palette.text.primary;
              }

              return (
                <TableRow key={residue.residue_id}>
                  <TableCell>{residue.residue_id}</TableCell>
                  <TableCell>{residue.residue_name}</TableCell>
                  <TableCell>
                    <Typography style={{ color: statusColor }}>
                      {residue.verification_status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {residue.cantidad_kg !== undefined
                      ? residue.cantidad_kg
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {residue.cantidad_m3 !== undefined
                      ? residue.cantidad_m3
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {residue.measurements.length === 0 ? (
                      // Mostrar cantidad_kg y cantidad_m3 del residuo
                      <Typography variant="body2">
                        Cantidad (kg):{' '}
                        {residue.cantidad_kg !== undefined
                          ? residue.cantidad_kg
                          : 'N/A'}
                        <br />
                        Cantidad (m³):{' '}
                        {residue.cantidad_m3 !== undefined
                          ? residue.cantidad_m3
                          : 'N/A'}
                      </Typography>
                    ) : (
                      <Table size="small" aria-label="measurements">
                        <TableHead>
                          <TableRow>
                            <TableCell>Etapa</TableCell>
                            <TableCell>Cantidad (kg)</TableCell>
                            <TableCell>Cantidad (m³)</TableCell>
                            <TableCell>Comentarios</TableCell>
                            <TableCell>Medido en</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {residue.measurements.map((measurement, index) => (
                            <TableRow key={index}>
                              <TableCell>{measurement.stage}</TableCell>
                              <TableCell>
                                {measurement.cantidad_kg ?? 'N/A'}
                              </TableCell>
                              <TableCell>
                                {measurement.cantidad_m3 ?? 'N/A'}
                              </TableCell>
                              <TableCell>
                                {measurement.comments || 'N/A'}
                              </TableCell>
                              <TableCell>{measurement.measured_at}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Box>
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
          Estado de reportes asignados
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
  
  export default function CentroStatusReportsTable({ data }) {
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

<TableContainer sx={{ maxHeight: '68vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2"> </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={generalCheckboxStatus === 'checked'}
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < visibleData.length
                    }
                    onChange={handleGeneralCheckboxChange}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Folio</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">
                      Nombre del Verificador
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Residuos</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">
                    Terminar Verificación
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
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
                    <React.Fragment key={report.folio}>
                      <TableRow
                        hover
                        role="checkbox"
                        selected={isRowSelected(report.folio)}
                        sx={{ cursor: 'pointer' }}
                        aria-checked={isRowSelected(report.folio)}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelected(report.folio);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setReportToEdit(report);
                          setReportsToDelete([report.folio]);
                          setRowContextMenuAnchorEl(e.target);
                        }}
                      >
                        <TableCell>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandClick(report.folio);
                            }}
                          >
                            {expandedRow === report.folio ? (
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
                              toggleSelected(report.folio);
                            }}
                            checked={isRowSelected(report.folio)}
                            inputProps={{
                              'aria-labelledby': report.folio,
                            }}
                          />
                        </TableCell>

                        <TableCell>{report.folio}</TableCell>
                        <TableCell>{report.checker_name || 'N/A'}</TableCell>
                        <TableCell>
                          {report.residues
                            .map((residue) => residue.residue_name)
                            .join(', ')}
                        </TableCell>
                        {/* Botón "Terminar Verificación" */}
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Enviar solicitud HTTP POST
                              fetch(
                                'https://your-api-endpoint.com/finish-verification',
                                {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ folio: report.folio }),
                                }
                              )
                                .then((response) => {
                                  if (response.ok) {
                                    // Manejar éxito
                                    console.log(
                                      'Verificación terminada con éxito.'
                                    );
                                  } else {
                                    // Manejar errores del servidor
                                    console.error(
                                      'Error del servidor:',
                                      response.statusText
                                    );
                                  }
                                })
                                .catch((error) => {
                                  // Manejar errores de red
                                  console.error('Error de red:', error);
                                });
                            }}
                          >
                            Terminar Verificación
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={expandedRow === report.folio}
                            timeout="auto"
                            unmountOnExit
                          >
                            <ReportInfo report={report} />
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
  