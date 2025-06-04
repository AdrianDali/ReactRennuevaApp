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
  TableSortLabel,
  IconButton,
  Badge,
  TextField,
  TablePagination,
  Collapse,
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

//import { modalStyle } from "../../styles/modalStyle";
import {
  Add,
  FilterList,
  Delete,
  Search,
  Draw,
  SaveAlt,
  Close,
  KeyboardArrowDown,
  MoreVert,
} from "@mui/icons-material";
import SearchingModal from "../modals/SearchingModal";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect, useRef } from "react";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { ModalFirmar } from "../../pages/ModalFirmar";
import { ModalResidueReport } from "../../pages/ModalResidueReport";
import getReportInfo from "../../services/getReportInfo";
import generateQR from "../../services/generateQR";
import CreateDonorReportModal from "../modals/CreateDonorReportModal";
import DonorSubtable from "./DonorSubtable";
import DonorReportsFiltersModal from "../modals/DonorReportsFiltersModal";
import DeleteDonorReportsModal from "../modals/DeleteDonorReportModal";
import generateDonorReportPDF from "../../services/generateDonorReportPDF";
import generateDonorTalonPDF from "../../services/DonorTalonReportPDF";
import sortData from "../../helpers/SortData";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import saveTalonPDF from "../../services/saveTalonPDF";
import { da } from "date-fns/locale";

function Toolbar({
  selected,
  setOpenFiltersModal,
  filtersApplied,
  filteredData,
  setVisibleData,
}) {
  const [openModalCreateReport, setOpenModalCreateReport] = useState(false);
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
      <Typography
        variant="h4"
        component="div"
        color="primary"
        sx={{ p: 2, flexGrow: 0, flexShrink: 1 }}
      >
        Reportes de donadores
      </Typography>
      <Box
        sx={{
          flexShrink: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
        }}
      >
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
        </Button>
      </Box>
      <CreateDonorReportModal
        isOpen={openModalCreateReport}
        setOpen={setOpenModalCreateReport}
      />
    </Box>
  );
}

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
            report.email_usuario.toLowerCase().includes(search) ||
            report.nombre_real_usuario.toLowerCase().includes(search) ||
            report.apellido_usuario.toLowerCase().includes(search) ||
            report.telefono_usuario.toLowerCase().includes(search)
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
            width: showSearch ? "15rem" : 0,
            transition: "all 300ms ease-in",
          }}
          placeholder="Nombre, Apellido, Correo electrónico, Teléfono"
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

export default function DonorReportsTable({ data, setUpdateDonorReports }) {
  const [filteredData, setFilteredData] = useState(data);
  const [reportsToDelete, setReportsToDelete] = useState([]);
  const [reportToEdit, setReportToEdit] = useState({});
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [visibleData, setVisibleData] = useState(data);
  const [signType, setSignType] = useState("Generador");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showCompleteInfo, setShowCompleteInfo] = useState(null);
  const [orderBy, setOrderBy] = useState("id_report");
  const [order, setOrder] = useState("desc");
  const [sortedData, setSortedData] = useState([]);

  const {
    setOpenModalDeleteReport,

    setOpenModalEditFirma,
  } = useContext(TodoContext);
  const [selected, setSelected] = useState([]);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [dataForFilters, setDataForFilters] = useState({
    donador_signature: [],
    recollection_signature: [],
  });

  const [openModalText, setOpenModalText] = useState(false);
  const [textOpenModalText, setTextOpenModalText] = useState("");

  const [desktop, setDesktop] = useState(window.innerWidth > 940);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [pesoTotal, setPesoTotal] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Se obtiene el usuario actual
  const dataUser = useAuth();
  console.log("Datos del usuario actual:");
  console.log(dataUser);

  const handleUpdateStatus = async () => {
    try {
      console.log("Actualizando status de los reportes:", reportToEdit);

      // Se calcula el umbral de alerta según el porcentaje configurado (por defecto 80%)
      const alertPercent = dataUser.collection_center_alert_porcent || 80;
      const threshold =
        (dataUser.collection_center_kg_max * alertPercent) / 100;

      console.log("Porcentaje de alerta:", alertPercent);
      console.log("Peso máximo permitido:", dataUser.collection_center_kg_max);
      console.log("Umbral de alerta calculado:", threshold);

      // Ajusta la lógica de la petición según tu API
      await fetch(`${process.env.REACT_APP_API_URL}/update-status-reports/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: reportToEdit,
          reportStatus: "Pendiente",
          creator_user: dataUser.user,
          collection_center_kg_max: dataUser.collection_center_m3_max,
          collection_center_alert_porcent:
            dataUser.collection_center_alert_porcent,
          collection_center: dataUser.collection_center,
        }),
      });
      // Una vez realizado el fetch, cierra el modal

      // Se obtienen los re
      console.log("Reporte a editar:");
      console.log(data);
      const reports = filteredData.filter(
        (report) => report.id_report === reportToEdit
      );
      console.log("Reportes del usuario actual:");
      console.log(reports);
      setOpenModalConfirm(false);
      setOpenModalText(true);
      setTextOpenModalText(
        "El status del reporte ha sido actualizado correctamente"
      );
      setUpdateDonorReports(true);
    } catch (error) {
      console.error("Error al actualizar el status:", error);
      // Manejo de errores
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 940) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onEditDonorSign = (id) => {
    setReportToEdit(id);
    setSignType("Donador");
    setOpenModalEditFirma(true);
  };

  const onEditReceiverSign = (id) => {
    setReportToEdit(id);
    setSignType("Recolector");
    setOpenModalEditFirma(true);
  };

  const handleShowCompleteInfo = (id) => {
    if (showCompleteInfo === id) {
      setShowCompleteInfo(null);
    } else {
      setShowCompleteInfo(id);
    }
  };

  useEffect(() => {
    setSelected([]);
    setFilteredData(data);
    setVisibleData(data);
    if (data.length > 0) {
      const firma_responsiva_generador = [
        ...new Set(data.map((report) => report.firma_responsiva_generador)),
      ];
      const firma_responsiva_receptor = [
        ...new Set(data.map((report) => report.firma_responsiva_receptor)),
      ];

      setDataForFilters({
        firma_responsiva_generador,
        firma_responsiva_receptor,
      });
    }
  }, [data]);

  useEffect(() => {
    setSortedData(sortData(visibleData, orderBy, order));
  }, [visibleData, order, orderBy]);

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
        {desktop ? (
          <Toolbar
            selected={selected}
            allData={data}
            filteredData={filteredData}
            setOpenFiltersModal={setOpenFiltersModal}
            setObjectsToDelete={setReportsToDelete}
            filtersApplied={filtersApplied}
            setVisibleData={setVisibleData}
          />
        ) : (
          <MobileToolbar
            selected={selected}
            allData={data}
            filteredData={filteredData}
            setOpenFiltersModal={setOpenFiltersModal}
            setObjectsToDelete={setReportsToDelete}
            filtersApplied={filtersApplied}
            setVisibleData={setVisibleData}
          />
        )}
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
                  <TableCell></TableCell>
                  <TableCell>
                    <TableSortLabel
                      direction={order}
                      onClick={() => {
                        setOrderBy("id_report");
                        setOrder(order === "asc" ? "desc" : "asc");
                      }}
                      active={orderBy === "id_report" ? true : false}
                    >
                      <Typography variant="subtitle2">ID</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Donador</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel direction="asc">
                      <Typography variant="subtitle2">Fecha</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Centro Acopio</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Firma donador</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Firma receptor</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Talón</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Cambiar status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">Borrar</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.length === 0 ? (
                  <TableRow
                    key="NoReports"
                    sx={{ "&:nth-of-type(odd)": { bgcolor: "action.hover" } }}
                  >
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
                          key={report.id_report}
                          sx={{
                            "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                            "&:hover": { bgcolor: "action.selected" },
                            transition: "background-color 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowCompleteInfo(report.id_report);
                          }}
                        >
                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
                            <IconButton
                              color="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowCompleteInfo(report.id_report);
                              }}
                            >
                              <KeyboardArrowDown
                                sx={{
                                  transform:
                                    showCompleteInfo === report.id_report
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s",
                                }}
                              />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
                            {report.id_report}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
                            {report.nombre_usuario}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
                            {new Date(
                              report.fecha_inicio_reporte
                            ).toLocaleDateString("es-MX", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
                            {report.centro_recoleccion}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
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
                                onEditDonorSign(report.id_report);
                              }}
                            >
                              Firmar
                            </Button>
                          </TableCell>

                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
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
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
                            <Button
                              startIcon={<SaveAlt />}
                              variant="contained"
                              size="small"
                              color={
                                report.firma_responsiva_generador &&
                                report.firma_responsiva_receptor
                                  ? "success"
                                  : "warning"
                              }
                              onClick={async (e) => {
                                console.log(report);
                                e.stopPropagation();
                                await saveTalonPDF(report, () => {
                                  setOpenModalText(true);
                                  setTextOpenModalText(
                                    "No se puede generar el reporte, aun no se han firmado todos los campos"
                                  );
                                });
                                //await handleSaveTalonPDF(report)
                              }}
                            >
                              Generar Talón
                            </Button>
                          </TableCell>

                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
                            <Button
                              variant="contained"
                              size="small"
                              color={
                                report.status_reporte == "Pendiente"
                                  ? "success"
                                  : "warning"
                              }
                              onClick={async (e) => {
                                console.log(report);
                                e.stopPropagation();
                                if (
                                  report.firma_responsiva_generador &&
                                  report.firma_responsiva_receptor &&
                                  report.residuos_agregados == true
                                ) {
                                  console.log("Se puede generar el reporte");
                                  setReportToEdit(report.id_report);
                                  setOpenModalConfirm(true);
                                  setTextOpenModalText(
                                    "Estas seguro de que quieres cerrar el registro de datos y residuos?, una vez cambiado no se podrá regresar ni modificar"
                                  );
                                } else if (
                                  !report.firma_responsiva_generador ||
                                  !report.firma_responsiva_receptor
                                ) {
                                  console.log("No se puede generar el reporte");
                                  setOpenModalText(true);
                                  setTextOpenModalText(
                                    "No se puede generar el reporte, aun no se han firmado todos los campos"
                                  );
                                } else if (
                                  report.status_reporte == "Pendiente"
                                ) {
                                  console.log("ya esta en status de Pendiente");
                                  setOpenModalText(true);
                                  setTextOpenModalText(
                                    "No se puede generar el reporte, aun no se han firmado todos los campos"
                                  );
                                } else if (report.residuos_agregados == false) {
                                  console.log("No se puede generar el reporte");
                                  setOpenModalText(true);
                                  setTextOpenModalText(
                                    "No se puede generar el reporte, aun no se han Agregados residuos"
                                  );
                                } else {
                                  console.log("No se puede generar el reporte");
                                  setOpenModalText(true);
                                  setTextOpenModalText(
                                    "No se puede generar el reporte"
                                  );
                                }
                                // await saveTalonPDF(report, () => {
                                //     setOpenModalText(true);
                                //     setTextOpenModalText(
                                //         "No se puede generar el reporte, aun no se han firmado todos los campos"
                                //     );
                                // })
                                //await handleSaveTalonPDF(report)
                              }}
                            >
                              Pendiente de recolección
                            </Button>
                          </TableCell>

                          <TableCell
                            sx={{
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 0 : 1,
                            }}
                          >
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
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{
                              paddingBottom: 0,
                              paddingTop: 0,
                              borderBottomWidth:
                                showCompleteInfo === report.id_report ? 1 : 0,
                            }}
                            colSpan={12}
                          >
                            <Collapse
                              in={showCompleteInfo === report.id_report}
                              timeout="auto"
                              unmountOnExit
                            >
                              <DonorSubtable report={report} />
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {isMobile && (
          <Stack
            spacing={isMobile ? 1 : 2}
            sx={{ px: isMobile ? 1 : 2, py: isMobile ? 1 : 2 }}
          >
            {sortedData.length === 0 ? (
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                color="textSecondary"
                align="center"
                sx={{ my: isMobile ? 3 : 6 }}
              >
                No se encontraron reportes
              </Typography>
            ) : (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <Paper
                    key={report.id_report}
                    elevation={isMobile ? 1 : 3}
                    sx={{
                      borderRadius: 2,
                      p: isMobile ? 1.5 : 2,
                      position: "relative",
                      bgcolor: isMobile ? "background.paper" : "grey.50",
                    }}
                  >
                    {/* Encabezado de la tarjeta */}
                    <Stack
                      direction={isMobile ? "column" : "row"}
                      alignItems={isMobile ? "flex-start" : "center"}
                      justifyContent="space-between"
                      spacing={isMobile ? 0.5 : 1}
                    >
                      <Typography
                        variant={isMobile ? "body1" : "subtitle1"}
                        fontWeight={600}
                      >
                        #{report.id_report}
                      </Typography>
                      <Typography
                        variant={isMobile ? "caption" : "body2"}
                        color="textSecondary"
                      >
                        {new Date(
                          report.fecha_inicio_reporte
                        ).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </Stack>

                    <Stack
                      spacing={isMobile ? 0.5 : 1}
                      sx={{ mt: isMobile ? 0.5 : 1 }}
                    >
                      <Typography variant={isMobile ? "caption" : "body2"}>
                        <strong>Donador:</strong> {report.nombre_usuario}
                      </Typography>
                      <Typography
                        variant={isMobile ? "caption" : "body2"}
                        sx={{ mb: isMobile ? 0.5 : 1 }}
                      >
                        <strong>Centro:</strong> {report.centro_recoleccion}
                      </Typography>
                    </Stack>

                    {/* Botones de acción en fila */}
                    <Stack
                      direction="row"
                      spacing={isMobile ? 0.5 : 1}
                      sx={{
                        overflowX: "auto",
                        py: isMobile ? 0.5 : 1,
                        "&::-webkit-scrollbar": { display: "none" },
                      }}
                    >
                      <Button
                        startIcon={<Draw />}
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
                        sx={{
                          ...buttonSx,
                          bgcolor: report.firma_responsiva_generador
                            ? "success.main"
                            : "warning.main",
                          "&:hover": {
                            bgcolor: report.firma_responsiva_generador
                              ? "success.dark"
                              : "warning.dark",
                          },
                        }}
                        onClick={() => onEditDonorSign(report.id_report)}
                      >
                        {isMobile ? "Firmar D." : "Firmar Donador"}
                      </Button>

                      <Button
                        startIcon={<Draw />}
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
                        sx={{
                          ...buttonSx,
                          bgcolor: report.firma_responsiva_receptor
                            ? "success.main"
                            : "warning.main",
                          "&:hover": {
                            bgcolor: report.firma_responsiva_receptor
                              ? "success.dark"
                              : "warning.dark",
                          },
                        }}
                        onClick={() => onEditReceiverSign(report.id_report)}
                      >
                        {isMobile ? "Firmar R." : "Firmar Receptor"}
                      </Button>

                      <Button
                        startIcon={<SaveAlt />}
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
                        sx={{
                          ...buttonSx,
                          bgcolor:
                            report.firma_responsiva_generador &&
                            report.firma_responsiva_receptor
                              ? "success.main"
                              : "warning.main",
                          "&:hover": {
                            bgcolor:
                              report.firma_responsiva_generador &&
                              report.firma_responsiva_receptor
                                ? "success.dark"
                                : "warning.dark",
                          },
                        }}
                        onClick={async () => {
                          await saveTalonPDF(report, () => {
                            setOpenModalText(true);
                            setTextOpenModalText(
                              "No se puede generar el reporte, aun no se han firmado todos los campos"
                            );
                          });
                        }}
                      >
                        {isMobile ? "Talón" : "Generar Talón"}
                      </Button>

                      <Button
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        fullWidth={isMobile}
                        sx={{
                          ...buttonSx,
                          bgcolor:
                            report.status_reporte === "Pendiente"
                              ? "success.main"
                              : "warning.main",
                          "&:hover": {
                            bgcolor:
                              report.status_reporte === "Pendiente"
                                ? "success.dark"
                                : "warning.dark",
                          },
                        }}
                        onClick={() => {
                          if (
                            report.firma_responsiva_generador &&
                            report.firma_responsiva_receptor &&
                            report.residuos_agregados === true
                          ) {
                            setReportToEdit(report.id_report);
                            setOpenModalConfirm(true);
                            setTextOpenModalText(
                              "¿Estás seguro de que quieres cambiar el registro a “Pendiente de recolección”? Una vez cambiado no se podrá regresar ni modificar"
                            );
                          } else if (
                            !report.firma_responsiva_generador ||
                            !report.firma_responsiva_receptor
                          ) {
                            setOpenModalText(true);
                            setTextOpenModalText(
                              "No se puede generar el reporte, aun no se han firmado todos los campos"
                            );
                          } else if (report.residuos_agregados === false) {
                            setOpenModalText(true);
                            setTextOpenModalText(
                              "No se puede generar el reporte, aun no se han agregado residuos"
                            );
                          } else {
                            setOpenModalText(true);
                            setTextOpenModalText(
                              "No se puede generar el reporte"
                            );
                          }
                        }}
                      >
                        {isMobile ? "Pendiente" : "Marcar Pendiente"}
                      </Button>

                      <IconButton
                        color="error"
                        sx={iconButtonSx}
                        onClick={() => {
                          setReportsToDelete([report.id_report]);
                          setOpenModalDeleteReport(true);
                        }}
                      >
                        <Delete />
                      </IconButton>

                      <IconButton
                        sx={iconButtonSx}
                        onClick={() =>
                          setShowCompleteInfo(
                            showCompleteInfo === report.id_report
                              ? null
                              : report.id_report
                          )
                        }
                      >
                        <KeyboardArrowDown
                          sx={{
                            transform:
                              showCompleteInfo === report.id_report
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.3s",
                          }}
                        />
                      </IconButton>
                    </Stack>

                    {/* Collapse de detalles */}
                    <Collapse
                      in={showCompleteInfo === report.id_report}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ mt: isMobile ? 1 : 2 }}>
                        <DonorSubtable report={report} />
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
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ModalFirmar type={signType} id={reportToEdit} />
      <ModalResidueReport report={reportToEdit} />
      <DeleteDonorReportsModal reports={reportsToDelete} />
      <DonorReportsFiltersModal
        isOpen={openFiltersModal}
        users={data}
        setOpen={setOpenFiltersModal}
        data={dataForFilters}
        setFilteredData={setFilteredData}
        objects={data}
        setFiltersApplied={setFiltersApplied}
      />
      {openModalText && (
        <Modal
          open={openModalText}
          onClose={() => setOpenModalText(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              width: "400px",
              backgroundColor: "white",
              borderRadius: "25px",
              boxShadow: 24,
              p: 4,
              mx: "auto",
              my: "20%",
              textAlign: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Aviso
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {textOpenModalText}
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpenModalText(false)}
              sx={{ mt: 4 }}
            >
              Aceptar
            </Button>
          </Box>
        </Modal>
      )}
      {openModalConfirm && (
        <Modal
          open={openModalConfirm}
          onClose={() => setOpenModalText(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              width: "400px",
              backgroundColor: "white",
              borderRadius: "25px",
              boxShadow: 24,
              p: 4,
              mx: "auto",
              my: "20%",
              textAlign: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Aviso
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              ¿Estás seguro de que quieres cambiar el status del reporte a
              <strong> "Pendiente de recolección"</strong>? Una vez cambiado,{" "}
              <strong>no se podrá regresar ni modificar</strong>.
            </Typography>

            {/* Botón para confirmar (continuar) */}
            <Button
              variant="contained"
              color="success"
              onClick={handleUpdateStatus}
              sx={{ mt: 4, mr: 2 }}
            >
              Continuar
            </Button>

            {/* Botón para cancelar */}
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenModalConfirm(false)}
              sx={{ mt: 4 }}
            >
              Cancelar
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
}
