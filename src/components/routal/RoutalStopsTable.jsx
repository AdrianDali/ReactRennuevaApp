import React, { useEffect, useState, useMemo } from "react";
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

// Datos dummy por ahora
const MOCK_STOPS = [
  {
    id: "68f68f817afe958cd1eef8bc",
    order: 2,
    name: "jennifer esquivel lopez",
    status: "Pendiente",
    location: "Prolongacion Av. Hidalgo, Estado de...",
    durationMin: 10,
    weightKg: "-",
    volumeM3: "-",
    schedule: "-",
    executionDate: "20/10",
    reportLocation: "19.3351689, -99.2269742",
    stopTime: "00:16:28",
    reportDate: "20/10",
    reportComments: "-",
    reportSignature: "Sí",
    reportImages: "Sí",
    cancelReason: "-",
    createdAt: "20/10",
  },
  {
    id: "68f68bcb2081f02985b5d90c",
    order: 1,
    name: "Ana Laura Cabello Villegas",
    status: "Pendiente",
    location: "Sur 75 4301-75, Viaducto Piedad, Iz...",
    durationMin: 10,
    weightKg: "-",
    volumeM3: 4,
    schedule: "-",
    executionDate: "21/10",
    reportLocation: "19.5795549, -99.2359268",
    stopTime: "00:02:57",
    reportDate: "21/10",
    reportComments: "-",
    reportSignature: "Sí",
    reportImages: "Sí",
    cancelReason: "-",
    createdAt: "21/10",
  },
];

const DEFAULT_ROWS_PER_PAGE = 25;

// Paleta Rewards (ajústala si tu CSS usa otros tonos)
const REWARDS_GREEN = "#8BC34A";

const RoutalStopsTable = () => {
  const [stops, setStops] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [selected, setSelected] = useState([]);

  const [createdAfter, setCreatedAfter] = useState("20/10/2025");
  const [createdBefore, setCreatedBefore] = useState("21/11/2025");

  useEffect(() => {
    setStops(MOCK_STOPS);
  }, []);

  const totalCount = useMemo(() => stops.length, [stops]);

  const handleChangePage = (_event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return stops.slice(start, end);
  }, [stops, page, rowsPerPage]);

  return (
    // Fondo gris como en Rewards
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Card principal */}
      <Box
        sx={{
          maxWidth: "100%",
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: 3,
          mx: "auto",
          p: 4,
        }}
      >
        {/* Header: título + botón */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: REWARDS_GREEN }}
          >
            Paradas
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            sx={{
              borderRadius: 2,
              backgroundColor: REWARDS_GREEN,
              "&:hover": {
                backgroundColor: "#7CB342",
              },
            }}
            onClick={() => console.log("Añadir parada")}
          >
            Añadir parada
          </Button>
        </Box>

        {/* Filtros */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
          {createdAfter && (
            <Chip
              label={`Fecha de creación mayor que "${createdAfter}"`}
              onDelete={() => setCreatedAfter(null)}
              variant="outlined"
            />
          )}
          {createdBefore && (
            <Chip
              label={`Fecha de creación menor que "${createdBefore}"`}
              onDelete={() => setCreatedBefore(null)}
              variant="outlined"
            />
          )}
        </Stack>

        {/* Tabla estilo Rewards */}
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
                      borderBottom: "none",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      sx={{
                        color: "white",
                        "&.Mui-checked": { color: "white" },
                      }}
                      indeterminate={
                        selected.length > 0 && selected.length < stops.length
                      }
                      checked={
                        stops.length > 0 && selected.length === stops.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{ "aria-label": "select all stops" }}
                    />
                  </TableCell>

                  <TableCell>Orden</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Peso (Kg)</TableCell>
                  <TableCell>Volumen (M³)</TableCell>
                  <TableCell>Horarios</TableCell>
                  <TableCell>Fecha de ejecución</TableCell>
                  <TableCell>Ubicación de reporte</TableCell>
                  <TableCell>Tiempo en parada</TableCell>
                  <TableCell>Fecha de reporte</TableCell>
                  <TableCell>Comentarios reporte</TableCell>
                  <TableCell>Firma reporte</TableCell>
                  <TableCell>Imágenes reporte</TableCell>
                  <TableCell>Motivo de cancelación</TableCell>
                  <TableCell>Id</TableCell>
                  <TableCell>Fecha creación</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.map((row) => {
                  const selectedRow = isSelected(row.id);
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      role="checkbox"
                      aria-checked={selectedRow}
                      selected={selectedRow}
                      onClick={() => handleRowClick(row.id)}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#fafafa",
                        },
                        "& .MuiTableCell-root": {
                          borderBottom: "1px solid #eeeeee",
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRow}
                          sx={{ color: REWARDS_GREEN }}
                        />
                      </TableCell>

                      <TableCell>{row.order}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.status}
                          sx={{
                            backgroundColor: "#FFE0B2",
                            color: "#F57C00",
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.durationMin} min</TableCell>
                      <TableCell>{row.weightKg}</TableCell>
                      <TableCell>{row.volumeM3}</TableCell>
                      <TableCell>{row.schedule}</TableCell>
                      <TableCell>{row.executionDate}</TableCell>
                      <TableCell>{row.reportLocation}</TableCell>
                      <TableCell>{row.stopTime}</TableCell>
                      <TableCell>{row.reportDate}</TableCell>
                      <TableCell>{row.reportComments}</TableCell>
                      <TableCell>{row.reportSignature}</TableCell>
                      <TableCell>{row.reportImages}</TableCell>
                      <TableCell>{row.cancelReason}</TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                    </TableRow>
                  );
                })}

                {paginatedRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={19} align="center">
                      No hay paradas para los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalCount}
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
