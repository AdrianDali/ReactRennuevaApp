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
import UnifiedVerifyResiduesDialog from "../modals/UnifiedVerifyResiduesDialog";
import getCookieValue from "../../services/GetCookie";

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

export default function DriverCenterAssignedTable({ data }) {
  console.log("DriverCenterAssignedTable");
  console.log(data);
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

  

  const user = getCookieValue("user");
  console.log("user", user);
  

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

  /**
   * Maneja la apertura del modal para el residuo seleccionado.
   * Realiza una petición POST para obtener los residuos asociados a un reporte,
   * actualiza el estado del componente y determina el valor de 'verified'
   * en función del status del primer elemento del arreglo de respuesta.
   *
   * @param {Object} report - Objeto con la información del reporte.
   */
  const handleOpenResiduoModal = async (report) => {
    try {
      // Mostrar en consola el reporte recibido
      console.log("Reporte recibido:", report);
      setReportToEdit(report);
      // Extrae el reportId del folio (asumiendo que es el último elemento separado por guiones)
      const orderRecollectionId = report.id;
      console.log("ID de recolección:", orderRecollectionId);

      setIdOrderSelected(orderRecollectionId);

      // Realiza la petición POST para obtener los residuos asociados al reporte
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-residues-total-per-report/`,
        { orderRecollectionId: report.id }
      );
      // Muestra en consola la respuesta de la API
      console.log("Respuesta de la API:", response.data);
      // Verifica que la respuesta sea un arreglo y contenga al menos un elemento

      setResiduesPerOrderRecollection(response.data);
      console.log("Residuos por reporte:", response.data);

      // Se utiliza directamente la respuesta para actualizar el estado,
      // ya que setResidueReportInfo es asíncrono, evitamos depender del estado actualizado.
      const residuesData = response.data;

      console.log("Datos de residuos:", residuesData);

      // Actualiza los estados correspondientes con los datos obtenidos
      setResidueReportInfo(residuesData);
      setStatusResidue("VERIFICADO");

      // Actualiza el reporte seleccionado y abre el modal
      //setSelectedReport(report);
      setOpenResiduoModal(true);
    } catch (error) {
      // Captura y registra cualquier error que ocurra durante la ejecución
      console.error("Error en handleOpenResiduoModal:", error);
    }
  };

  const handleCloseResiduoModal = () => {
    setOpenResiduoModal(false);
    setResidueReportInfo([]);
  };
  const handleOpenConfirmModal = (index, residuo) => {
    console.log("Residuo index:", index);
    console.log("Residuo:", residuo);

    setOpenConfirmModal(true);
    setResidueIndex(index);
    setEditedResidueName(residuo.residue_name);
    console.log("Residuo name:", residuo.report_residue_id);
    setReportResidueId(residuo.report_residue_id);

    setEditedPeso(residuo.total_kg);
    setEditedVolumen(residuo.total_m3);
    setStatusResidue(residuo.verification_status);


  };

  const handleConfirmCorrect = () => {
    console.log("Residuo verificado");
    console.log("Residuo index:", editedResidueName);

    // llamado https a la API para marcar el residuo como verificado
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/driver-verified-order-reports-residue/`,
        {
          residue_name : editedResidueName,
          orderId: idOrderSelected,
          status: "VERIFICADO",
        }
      )
      .then((response) => {
        console.log("Residuo verificado:", response.data);

        // // Actualiza el estado del residuo verificado
        // setResidueReportInfo((prev) => {
        //   const newResidues = [...prev];
        //   newResidues[selectedResiduoIndex] = {
        //     ...newResidues[selectedResiduoIndex],
        //     verified: true,
        //   };
        //   return newResidues;
        // });
        // setResidueReportInfo((prev) => {
        //   const newResidues = [...prev];
        //   newResidues[residueIndex] = {
        //     ...newResidues[residueIndex],
        //     verification_status: "VERIFICADO",
        //   };
        //   return newResidues;
        // });
        return response.data;
        
      })
      .catch((error) => {
        console.error(error);
      });
    setOpenConfirmModal(false);
  };

  const handleOpenEditModal = () => {

    setOpenEditModal(true);
  };
  const handleEditSubmit = () => {
    // Aquí puedes manejar el envío de los datos editados

    console.log(
      "Residuo editado:",
      editedResidueName,
      editedPeso,
      editedVolumen,
      reportResidueId 
    );

    axios
    .post(
      `${process.env.REACT_APP_SERVER_URL}/Rennueva/checker-verified-report/`,
      [{
        residue_id: reportResidueId,
        checker_username : dataUser.user,
        status: "REPORTADO",
        //residue_name: editedResidueName,
        new_weight: editedPeso,
        new_m3: editedVolumen,
        measurement_comments : "Residuo editado"
      }]

    )
      .then((response) => {
        console.log("Residuo editado:", response.data);
        // Aquí puedes manejar la respuesta de la API después de editar el residuo
        // Por ejemplo, puedes cerrar el modal o mostrar un mensaje de éxito
        setOpenEditModal(false);
        setOpenModalText(true);
        setTextOpenModalText("Residuo editado correctamente");
        setUpdateReportInfo((prev) => !prev);
      })

      .catch((error) => {
        console.error("Error al editar el residuo:", error);
      });

    

    setOpenEditModal(false);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
      .then(response => {
        const data = response.data;
        console.log("Residuos:", data);
        setResidues(data);
      })
      .catch(error => {
        console.error(error);
      })
  }, []);

  return (
    <Box sx={{
      width: "100%",
      mb: "3rem",
      height: "80vh",
      display: "flex",
      flexDirection: "column",
    }}>
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
        <TableContainer sx={{
            maxHeight: "calc(70vh - 64px)", // ajusta según tu Toolbar/TablePagination
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "grey.400",
              borderRadius: 3,
            },
          }}>
          <Table >
            <TableHead sx={{
                bgcolor: "primary.main",
                "& .MuiTableCell-root": {
                  color: "common.white",
                  borderBottom: "2px solid",
                  borderColor: "primary.dark",
                  "& .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon": {
                    opacity: 1,
                  },
                },
              }}>
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
                    <Typography variant="subtitle2">
                      Nombre Solicitante
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">
                      Centro de acopio
                    </Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Fecha</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Peso</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Conductor</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel direction="asc">
                    <Typography variant="subtitle2">Residuos</Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <Typography variant="subtitle2">Verificación</Typography>
                </TableCell>
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
                        <TableCell>{report.nombre_donador}</TableCell>

                        <TableCell>{report.nombre_centro}</TableCell>

                        <TableCell>{report.fecha}</TableCell>
                        <TableCell>Peso</TableCell>
                        <TableCell>{report.conductor_asignado}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            sx={{ marginLeft: 2 }}
                            onClick={() => handleOpenResiduoModal(report)}
                          >
                            Ver Residuos
                          </Button>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
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
                            <ReportInfoRecycling request={report} />
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


      <UnifiedVerifyResiduesDialog
        open={openResiduoModal}
        onClose={() => setOpenResiduoModal(false)}
        residueReportInfo={residueReportInfo}
        residues={residues}
        report={reportToEdit}
        user={user}
        //onSubmit={handleDialogSubmit}
      />
      
    </Box>
  );
}
