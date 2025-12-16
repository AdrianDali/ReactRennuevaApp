// src/components/modals/NewPlanModal.jsx
import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  TextField,
  MenuItem,
  Divider,
  Checkbox,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const REWARDS_GREEN_DARK = "#689F38";

// datos dummy de vehículos
const MOCK_VEHICLES = [
  { id: 1, name: "Hino", color: "#81D4FA" },
  { id: 2, name: "Kangoo", color: "#C5E1A5" },
];

const formatDateInput = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatPlanName = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d} - Plan`;
};

const NewPlanModal = ({ open, onClose, selectedDate }) => {
  const initialDate = selectedDate || new Date();

  const [name, setName] = useState(formatPlanName(initialDate));
  const [status, setStatus] = useState("planning");
  const [executionDate, setExecutionDate] = useState(
    formatDateInput(initialDate)
  );

  const [searchVehicle, setSearchVehicle] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  // cada vez que cambie la fecha seleccionada y se abra el modal, actualizamos nombre/fecha
  React.useEffect(() => {
    if (open && selectedDate) {
      setExecutionDate(formatDateInput(selectedDate));
      setName(formatPlanName(selectedDate));
    }
  }, [open, selectedDate]);

  const filteredVehicles = useMemo(() => {
    const q = searchVehicle.toLowerCase();
    return MOCK_VEHICLES.filter((v) => v.name.toLowerCase().includes(q));
  }, [searchVehicle]);

  const handleToggleVehicle = (id) => {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleSave = () => {
    const data = {
      name,
      status,
      executionDate,
      vehicles: selectedVehicles,
    };
    console.log("Plan a guardar:", data);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 0,
          maxHeight: "120vh",      // ⬅️ más alto, hasta el 90% de la ventana
        },
      }}
    >
      {/* Título + botón cerrar */}
      <DialogTitle
        sx={{
          pb: 1,
          px: 3,
          pt: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Crear plan nuevo
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: { xs: "85vh", md: "70vh" }, // ⬅️ altura mínima para que no se apachurre
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            mt: 1,
            overflow: "hidden",
          }}
        >
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <Box sx={{ flex: 1.1 }}>
            {/* Nombre */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: "#9e9e9e", fontWeight: 500 }}
              >
                Nombre
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>

            {/* Estado */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: "#9e9e9e", fontWeight: 500 }}
              >
                Estado
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="planning">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: REWARDS_GREEN_DARK,
                      }}
                    />
                    <span>En planificación</span>
                  </Box>
                </MenuItem>
                <MenuItem value="scheduled">En borrador</MenuItem>
                <MenuItem value="in_progress">En Progeso</MenuItem>
                <MenuItem value="done">Finalizado</MenuItem>
                {/* <MenuItem value="cancelled">Cancelado</MenuItem> */}
              </TextField>
            </Box>

            {/* Fecha de ejecución */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: "#9e9e9e", fontWeight: 500 }}
              >
                Fecha de ejecución
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={executionDate}
                onChange={(e) => setExecutionDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>

          {/* DIVISOR VERTICAL */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />

          {/* COLUMNA DERECHA: VEHÍCULOS */}
          <Box sx={{ flex: 1.3, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {MOCK_VEHICLES.length} vehículos
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 20,
                  border: "1px solid #e0e0e0",
                  px: 1.5,
                  py: 0.25,
                  minWidth: 180,
                }}
              >
                <SearchIcon sx={{ fontSize: 18, color: "#bdbdbd", mr: 1 }} />
                <TextField
                  variant="standard"
                  placeholder="Buscar..."
                  value={searchVehicle}
                  onChange={(e) => setSearchVehicle(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: 14 },
                  }}
                  fullWidth
                />
              </Box>
            </Box>

            {/* Encabezado de la tabla de vehículos */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                px: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{ flex: 1, color: "#9e9e9e", textTransform: "uppercase" }}
              >
                Nombre
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  width: 40,
                  textAlign: "center",
                  color: "#9e9e9e",
                  textTransform: "uppercase",
                }}
              >
                Usar
              </Typography>
            </Box>

            {/* Lista de vehículos */}
            <Box
              sx={{
                borderRadius: 2,
                border: "1px solid #eeeeee",
                maxHeight: 320,       // ⬅️ más alto que antes
                overflowY: "auto",
              }}
            >
              {filteredVehicles.map((vehicle) => {
                const checked = selectedVehicles.includes(vehicle.id);
                return (
                  <Box
                    key={vehicle.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 1.5,
                      py: 1,
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          mr: 1,
                          bgcolor: vehicle.color,
                        }}
                      >
                        {vehicle.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{vehicle.name}</Typography>
                    </Box>
                    <Box sx={{ width: 40, textAlign: "center" }}>
                      <Checkbox
                        checked={checked}
                        onChange={() => handleToggleVehicle(vehicle.id)}
                        sx={{ p: 0.5 }}
                      />
                    </Box>
                  </Box>
                );
              })}

              {filteredVehicles.length === 0 && (
                <Typography
                  variant="body2"
                  sx={{ p: 2, color: "#9e9e9e", textAlign: "center" }}
                >
                  No se encontraron vehículos.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Footer simple */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Typography
            component="button"
            type="button"
            onClick={handleClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#757575",
              padding: "6px 8px",
            }}
          >
            Cancelar
          </Typography>
          <Typography
            component="button"
            type="button"
            onClick={handleSave}
            style={{
              borderRadius: 50,
              border: "none",
              padding: "8px 20px",
              cursor: "pointer",
              backgroundColor: REWARDS_GREEN_DARK,
              color: "white",
              fontWeight: 500,
            }}
          >
            Guardar plan
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewPlanModal;
