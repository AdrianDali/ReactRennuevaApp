import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  Chip,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const DEFAULT_ROWS_PER_PAGE = 10;
const REWARDS_GREEN = "#8BC34A";

const RoutalStopsTable = () => {
  const [stops, setStops] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0); // MUI es 0-based
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [selected, setSelected] = useState([]);

  const [createdAfter, setCreatedAfter] = useState("20/10/2025");
  const [createdBefore, setCreatedBefore] = useState("21/11/2025");

  const [loading, setLoading] = useState(false);

  // ============================================================
  // FETCH STOPS (SERVER SIDE)
  // ============================================================
  const fetchStops = async () => {
  setLoading(true);

  try {
    const response = await axios.get(
  "http://127.0.0.1:8000/routal/stops/search/",
  {
    params: {
      project_id: "6429c7cccf48095710f801e8",

    }
  }
);

    setStops(
      response.data.docs.map((s) => ({
        id: s.id,
        nombre: s.label,
        estado: s.status,
        ubicacion: s.location?.label,
        duracion_min: Math.floor((s.duration || 0) / 60),
        orden: s.order,
        fecha_ejecucion: s.plan_execution_date,
        creada: s.created_at,
        tiene_reporte: (s.reports || []).length > 0,
      }))
    );

    setTotal(response.data.totalDocs);

  } catch (error) {
    console.error("Error cargando paradas:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchStops();
  }, [page, rowsPerPage]);

  // ============================================================
  // SELECCIÓN
  // ============================================================
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(stops.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleRowClick = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selected.includes(id);

  // ============================================================
  // PAGINACIÓN
  // ============================================================
  const handleChangePage = (_event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ============================================================
  // HELPERS UI
  // ============================================================
  const renderStatusChip = (status) => {
    const map = {
      pending: { label: "Pendiente", color: "#FFE0B2", text: "#F57C00" },
      completed: { label: "Completada", color: "#C8E6C9", text: "#2E7D32" },
      cancelled: { label: "Cancelada", color: "#FFCDD2", text: "#C62828" },
    };

    const cfg = map[status] || map.pending;

    return (
      <Chip
        size="small"
        label={cfg.label}
        sx={{
          backgroundColor: cfg.color,
          color: cfg.text,
          fontWeight: 500,
        }}
      />
    );
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: 3,
          mx: "auto",
          p: 4,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: REWARDS_GREEN }}>
            Paradas
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            sx={{
              borderRadius: 2,
              backgroundColor: REWARDS_GREEN,
              "&:hover": { backgroundColor: "#7CB342" },
            }}
          >
            Añadir parada
          </Button>
        </Box>

        {/* FILTROS VISUALES */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
          {createdAfter && (
            <Chip
              label={`Fecha creación > ${createdAfter}`}
              onDelete={() => setCreatedAfter(null)}
              variant="outlined"
            />
          )}
          {createdBefore && (
            <Chip
              label={`Fecha creación < ${createdBefore}`}
              onDelete={() => setCreatedBefore(null)}
              variant="outlined"
            />
          )}
        </Stack>

        {/* TABLA */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflowX: "auto",
            borderRadius: 3,
            border: "1px solid #e0e0e0",
          }}
        >
          <TableContainer>
            <Table size="small" sx={{ minWidth: 1300 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: REWARDS_GREEN,
                    "& .MuiTableCell-root": {
                      color: "#ffffff",
                      fontWeight: 600,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      sx={{ color: "white" }}
                      indeterminate={
                        selected.length > 0 && selected.length < stops.length
                      }
                      checked={
                        stops.length > 0 && selected.length === stops.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>

                  <TableCell>Orden</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Fecha ejecución</TableCell>
                  <TableCell>Reporte</TableCell>
                  <TableCell>Creada</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stops.map((row) => {
                  const selectedRow = isSelected(row.id);

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      selected={selectedRow}
                      onClick={() => handleRowClick(row.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedRow} />
                      </TableCell>

                      <TableCell>{row.orden ?? "-"}</TableCell>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>{renderStatusChip(row.estado)}</TableCell>
                      <TableCell>{row.ubicacion}</TableCell>
                      <TableCell>{row.duracion_min} min</TableCell>
                      <TableCell>{row.fecha_ejecucion ?? "-"}</TableCell>
                      <TableCell>
                        {row.tiene_reporte ? "Sí" : "No"}
                      </TableCell>
                      <TableCell>{row.creada}</TableCell>
                    </TableRow>
                  );
                })}

                {!loading && stops.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No hay paradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Filas por página"
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default RoutalStopsTable;
