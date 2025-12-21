import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
  Badge,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TableSortLabel,
  Grid,
  Chip,
} from "@mui/material";

import {
  Add,
  Download,
  FilterList,
  Delete,
  Visibility,
  Check,
  Close,
  Search,
  Edit,
  KeyboardArrowDown,
} from "@mui/icons-material";

import { TodoContext } from "../context/index";
import { Autocomplete } from "@mui/material";
import theme from "../context/theme";
import { generateExcelFromJson } from "../services/Excel";
import useAuth from "../hooks/useAuth";
import VehicleInfoSubTable from "./VehicleInfoSubTable";
import FiltersVehicleModal from "./FiltersVehicleModal";

// -----------------------------
// NORMALIZACIÓN DE VEHÍCULOS
// -----------------------------
const normalizeVehicles = (vehicles) => {
  if (!vehicles) return [];

  const routal = vehicles?.routal?.docs || [];
  const local = vehicles?.local || [];
  console.log("Routal vehicles:", routal);

  const routalNorm = routal.map((v) => ({
    id: v.id,
    modelo: v.label || "N/A",
    placas: v.plate || "N/A",
    capacidad: v.default_max_volume || "-",
    conductor: v.phone || "N/A",
    permiso: v.external_id || "N/A",
    source: "Routal",
    external_id: v.external_id || "N/A",
  }));

  const localNorm = local.map((v) => ({
    id: v.id,
    modelo: v.modelo || "N/A",
    placas: v.placas || "N/A",
    capacidad: v.capacidad || "-",
    conductor: v.conductor || "N/A",
    permiso: v.permiso || "N/A",
    source: "Local",
  }));

  return [...localNorm, ...routalNorm];
};

// ------------------------------------
// MENÚ CONTEXTUAL POR CADA FILA
// ------------------------------------
function RowContextMenuVehicle({ anchorEl, setAnchorEl, onEdit, onDelete }) {
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  return (
    <Menu anchorEl={anchorEl} open={open}>
      <MenuList>
        <MenuItem
          onClick={() => {
            onEdit();
            handleClose();
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Editar" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDelete();
            handleClose();
          }}
        >
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText primary="Eliminar" />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

// --------------------------------------------
// MENÚ DE EXPORTACIÓN PARA VEHÍCULOS
// --------------------------------------------
function ExportOptionsMenuVehicle({
  anchorEl,
  setAnchorEl,
  allData,
  filteredData,
  selected,
}) {
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  return (
    <Menu anchorEl={anchorEl} open={open}>
      <MenuList>
        <MenuItem
          onClick={() => {
            generateExcelFromJson(allData, "Vehículos");
            handleClose();
          }}
        >
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText primary="Exportar todos" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            generateExcelFromJson(filteredData, "Vehículos");
            handleClose();
          }}
        >
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText primary="Exportar visibles" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            const ids = selected.map((v) => v.id);
            const filtered = allData.filter((v) => ids.includes(v.id));
            generateExcelFromJson(filtered, "Vehículos");
            handleClose();
          }}
        >
          <ListItemIcon>
            <Check />
          </ListItemIcon>
          <ListItemText primary="Exportar seleccionados" />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

// --------------------------------------------
// COMPONENTE PRINCIPAL: VehicleTable
// --------------------------------------------
export default function VehicleTable({ vehicles }) {
  const {
    setOpenModalEditVehicle,
    setOpenModalDeleteVehicle,
    setOpenModalCreateVehicle,
    infoVehicle,
    setInfoVehicle,
  } = useContext(TodoContext);
  const allData = useMemo(() => normalizeVehicles(vehicles), [vehicles]);

  const [filteredData, setFilteredData] = useState(allData);
  const [visibleData, setVisibleData] = useState(allData);

  const [selected, setSelected] = useState([]);
  const [generalStatus, setGeneralStatus] = useState("unchecked");
  const [rowMenuAnchor, setRowMenuAnchor] = useState(null);

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [expanded, setExpanded] = useState(null);

  // Selección general
  useEffect(() => {
    if (selected.length === allData.length && allData.length > 0)
      setGeneralStatus("checked");
    else if (selected.length === 0) setGeneralStatus("unchecked");
    else setGeneralStatus("indeterminate");
  }, [selected]);

  const toggleSelect = (vehicle) => {
    if (selected.some((v) => v.id === vehicle.id)) {
      setSelected(selected.filter((v) => v.id !== vehicle.id));
    } else {
      setSelected([...selected, vehicle]);
    }
  };

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

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
        <Typography variant="h4" component="div" color="primary" sx={{ p: 2 }}>
          Vehículos registrados Routal/Rewards
        </Typography>

        {/* ---------------- TOOLBAR (igual al de usuarios) --------------- */}

        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Buscar */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Buscar vehículo"
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1 }} />,
                }}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  setVisibleData(
                    filteredData.filter(
                      (v) =>
                        v.modelo.toLowerCase().includes(value) ||
                        v.placas.toLowerCase().includes(value)
                    )
                  );
                }}
              />
            </Grid>

            {/* Origen */}
            <Grid item xs={12} sm={3}>
              <Autocomplete
                size="small"
                options={["Local", "Routal"]}
                renderInput={(params) => (
                  <TextField {...params} label="Origen" />
                )}
                onChange={(e, value) => {
                  if (!value) setVisibleData(filteredData);
                  else
                    setVisibleData(
                      filteredData.filter((v) => v.source === value)
                    );
                }}
              />
            </Grid>

            {/* Exportar */}
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                fullWidth
                onClick={(e) => setExportAnchor(e.currentTarget)}
              >
                Exportar
              </Button>
            </Grid>

            {/* Crear */}
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                onClick={() => setOpenModalCreateVehicle(true)}
              >
                Nuevo
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* ---------------- TABLA ---------------- */}
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
                <TableCell />

                <TableCell>
                  <Checkbox
                    indeterminate={generalStatus === "indeterminate"}
                    checked={generalStatus === "checked"}
                    onChange={(e) => {
                      if (e.target.checked) setSelected(allData);
                      else setSelected([]);
                    }}
                  />
                </TableCell>

                <TableCell>
                  <b>Modelo</b>
                </TableCell>
                <TableCell>
                  <b>Placas</b>
                </TableCell>
                <TableCell>
                  <b>Capacidad</b>
                </TableCell>
                <TableCell>
                  <b>Conductor</b>
                </TableCell>
                <TableCell>
                  <b>Permiso</b>
                </TableCell>
                <TableCell>
                  <b>Origen</b>
                </TableCell>

                <TableCell>
                  <b>Editar</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {visibleData
                .slice(page * rows, page * rows + rows)
                .map((vehicle) => (
                  <React.Fragment key={vehicle.id}>
                    <TableRow hover>
                      {/* Expand */}
                      <TableCell>
                        <IconButton onClick={() => toggleExpand(vehicle.id)}>
                          <KeyboardArrowDown
                            sx={{
                              transform:
                                expanded === vehicle.id
                                  ? "rotate(180deg)"
                                  : "rotate(0)",
                              transition: "300ms",
                            }}
                          />
                        </IconButton>
                      </TableCell>

                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox
                          checked={selected.some((v) => v.id === vehicle.id)}
                          onClick={() => toggleSelect(vehicle)}
                        />
                      </TableCell>

                      <TableCell>{vehicle.modelo}</TableCell>
                      <TableCell>{vehicle.placas}</TableCell>
                      <TableCell>{vehicle.capacidad}</TableCell>
                      <TableCell>{vehicle.conductor}</TableCell>
                      <TableCell>{vehicle.permiso}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={vehicle.source}
                          color={
                            vehicle.source === "Routal" ? "primary" : "success"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setInfoVehicle(vehicle);
                            setOpenModalEditVehicle(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    {/* SUBTABLA */}
                    <TableRow>
                      <TableCell colSpan={10} sx={{ p: 0 }}>
                        <Collapse in={expanded === vehicle.id}>
                          <VehicleInfoSubTable vehicle={vehicle} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={visibleData.length}
          rowsPerPage={rows}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRows(parseInt(e.target.value, 10))}
        />
      </Paper>

      {/* MENÚS */}
      <ExportOptionsMenuVehicle
        anchorEl={exportAnchor}
        setAnchorEl={setExportAnchor}
        allData={allData}
        filteredData={filteredData}
        selected={selected}
      />

      <FiltersVehicleModal
        isOpen={filtersOpen}
        setOpen={setFiltersOpen}
        data={allData}
        setFilteredData={setFilteredData}
        setVisibleData={setVisibleData}
      />

      <RowContextMenuVehicle
        anchorEl={rowMenuAnchor}
        setAnchorEl={setRowMenuAnchor}
        onEdit={() => setOpenModalEditVehicle(true)}
        onDelete={() => setOpenModalDeleteVehicle(true)}
      />
    </Box>
  );
}
