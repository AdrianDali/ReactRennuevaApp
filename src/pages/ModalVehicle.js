import React, { useState, useEffect, useContext, useMemo } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Stack,
  Paper,
  Chip,
  InputAdornment,
  Tooltip,
  LinearProgress,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import { TodoContext } from "../context/index.js";
import Title from "../components/Title";

function ModalVehicle({ mode, creatorUser }) {
  const {
    openModalCreateVehicle,
    openModalEditVehicle,
    openModalDeleteVehicle,
    setOpenModalCreateVehicle,
    setOpenModalEditVehicle,
    setOpenModalDeleteVehicle,
    setOpenModalText,
    setTextOpenModalText,
    setUpdateVehicleInfo,
    infoVehicle,
  } = useContext(TodoContext);

  const open =
    openModalCreateVehicle || openModalEditVehicle || openModalDeleteVehicle;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const isDelete = mode === "BORRAR";
  const isCreate = mode === "CREAR";
  const isEdit = mode === "EDITAR";

  // Estado agrupado (misma lógica)
  const [form, setForm] = useState({
    modelo: "",
    placas: "",
    capacidad: "",
    permiso: "",
    state: "",
    city: "",
    locality: "",
    street: "",
    address_num_ext: "",
    address_num_int: "",
    address_reference: "",
    postal_code: "",
    idConductor: "",
  });

  const [vehicles, setVehicles] = useState([]); // (lo dejas por si lo usas en otro lado)
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [oldVehicle, setOldVehicle] = useState("");
  const [id_routal, setIdRoutal] = useState("");

  const modeChip = useMemo(() => {
    if (isCreate) return { label: "Crear", color: "primary" };
    if (isEdit) return { label: "Editar", color: "warning" };
    return { label: "Eliminar", color: "error" };
  }, [isCreate, isEdit]);

  const closeModal = () => {
    setOpenModalCreateVehicle(false);
    setOpenModalEditVehicle(false);
    setOpenModalDeleteVehicle(false);
  };

  const updateField = (field, value) => {
    if (!isDelete) {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const putEditDataInForm = (vehicleData) => {
    // Soporta axios completo o solo data
    const data = vehicleData?.data ?? vehicleData;

    const local = data?.local || {};
    const routal = data?.routal || {};
    const startLocation = routal?.default_start_location || {};

    setForm({
      // VEHÍCULO (LOCAL)
      modelo: local.modelo || routal.label || "",
      placas: local.placas || "",
      capacidad: local.capacidad || "",
      permiso: local.permiso || "",
      idConductor: local.idConductor || "",

      // UBICACIÓN (ROUTAL)
      state: startLocation.state || "",
      city: startLocation.city || "",
      locality: startLocation.label || "",
      street: startLocation.street || "",
      postal_code: startLocation.postal_code || "",

      // Campos no usados por Routal (por ahora)
      address_num_ext: "",
      address_num_int: "",
      address_reference: "",

      // Extras (si los usas en tu UI más adelante)
      color: routal.color || "",
      fuel_type: routal.fuel_type || "",
      consumption: routal.consumption || "",
      comments: routal.comments || "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // MODO CREAR: solo drivers
        if (isCreate) {
          const driversResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/get-all-drivers/`
          );
          setDrivers(driversResponse.data);
          return; // no continuar con read-vehicle
        }

        // MODO EDITAR / BORRAR: vehicle + drivers
        const [vehicleResponse, driversResponse] = await Promise.all([
          axios.post(`${process.env.REACT_APP_API_URL}/read-vehicle/`, {
            id: infoVehicle.external_id,
            id_routal: infoVehicle.id,
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/get-all-drivers/`),
        ]);

        setVehicles(vehicleResponse.data);
        setDrivers(driversResponse.data);

        if (isEdit || isDelete) {
          putEditDataInForm(vehicleResponse.data);
          setOldVehicle(vehicleResponse.data?.local?.placas || "");
          setIdRoutal(vehicleResponse.data?.routal?.id || "");
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchData();
  }, [open, isCreate, isEdit, isDelete, infoVehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload =
      mode === "CREAR"
        ? { ...form, creator_user: creatorUser }
        : mode === "EDITAR"
        ? {
            ...form,
            antiguasPlacas: oldVehicle,
            creator_user: creatorUser,
            id_routal: id_routal,
          }
        : { placas: oldVehicle, creator_user: creatorUser };

    const url =
      mode === "CREAR"
        ? "/create-vehicle/"
        : mode === "EDITAR"
        ? "/update-vehicle/"
        : "/delete-vehicle/";

    const method =
      mode === "BORRAR" ? axios.post : mode === "EDITAR" ? axios.put : axios.post;

    method(`${process.env.REACT_APP_API_URL}${url}`, payload)
      .then(() => {
        setTextOpenModalText(
          mode === "CREAR"
            ? "Vehículo creado exitosamente"
            : mode === "EDITAR"
            ? "Vehículo actualizado correctamente"
            : "Vehículo eliminado correctamente"
        );
        setUpdateVehicleInfo(true);
        setOpenModalText(true);
        closeModal();
      })
      .catch((err) => {
        const msg =
          err.response?.data?.errorMessage || "Ha ocurrido un error inesperado";
        setOpenModalText(true);
        setTextOpenModalText(msg);
      });
  };

  return ReactDOM.createPortal(
    <Dialog
      open={open}
      onClose={closeModal}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Barra superior: más clara y usable en móvil */}
      <DialogTitle
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "background.paper",
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 1.5,
        }}
      >
        {loading && <LinearProgress sx={{ position: "absolute", left: 0, right: 0, top: 0 }} />}

        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: 0 }}>
            <Chip
              size="small"
              label={modeChip.label}
              color={modeChip.color}
              sx={{ fontWeight: 700 }}
            />
            <Typography
              variant={fullScreen ? "h6" : "h6"}
              sx={{
                fontWeight: 800,
                letterSpacing: 0.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={
                isCreate ? "Crear Vehículo" : isEdit ? "Editar Vehículo" : "Eliminar Vehículo"
              }
            >
              {isCreate && "Crear Vehículo"}
              {isEdit && "Editar Vehículo"}
              {isDelete && "Eliminar Vehículo"}
            </Typography>
          </Stack>

          <Tooltip title="Cerrar">
            <IconButton onClick={closeModal} edge="end" aria-label="cerrar">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          bgcolor: "background.default",
          p: { xs: 2, sm: 3 },
          maxHeight: fullScreen ? "100%" : "75vh",
          scrollbarWidth: "thin",
        }}
      >
        {loading ? (
          <Box
            sx={{
              minHeight: 220,
              display: "grid",
              placeItems: "center",
              py: 4,
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Cargando información…
              </Typography>
            </Stack>
          </Box>
        ) : (
          <>
            {/* MODO BORRAR: mensaje más claro */}
            {isDelete && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  borderColor: "error.light",
                  bgcolor: "error.lighter",
                  mb: 2.5,
                }}
              >
                <Typography sx={{ fontWeight: 800, mb: 0.5 }} color="error">
                  Esta acción es permanente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Se eliminará el vehículo <b>{oldVehicle || "seleccionado"}</b>. ¿Deseas continuar?
                </Typography>
              </Paper>
            )}

            {/* FORM */}
            {!isDelete && (
              <Stack spacing={2.25}>
                {/* SECCIÓN: VEHÍCULO */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <LocalShippingOutlinedIcon fontSize="small" />
                    <Title>Información del Vehículo</Title>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Grid
                    container
                    spacing={2}
                    sx={{
                      "& .MuiTextField-root": { bgcolor: "background.paper" },
                    }}
                  >
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Modelo"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.modelo}
                        onChange={(e) => updateField("modelo", e.target.value)}
                        placeholder="Ej. Nissan NP300"
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Placas"
                        placeholder="ABC-123"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.placas}
                        onChange={(e) =>
                          updateField("placas", (e.target.value || "").toUpperCase())
                        }
                        inputProps={{ maxLength: 12 }}
                        helperText="Se guardará en mayúsculas"
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Permiso"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.permiso}
                        onChange={(e) => updateField("permiso", e.target.value)}
                        placeholder="Ej. Carga / Recolección"
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Capacidad de carga"
                        type="number"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.capacidad}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                            updateField("capacidad", value);
                          }
                        }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                          inputProps: { min: 0, max: 100, step: 1 },
                        }}
                        helperText="Máximo permitido: 100 kg"
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* SECCIÓN: UBICACIÓN */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <PlaceOutlinedIcon fontSize="small" />
                    <Title>Ubicación</Title>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Estado"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Ciudad"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Colonia"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.locality}
                        onChange={(e) => updateField("locality", e.target.value)}
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Calle"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.street}
                        onChange={(e) => updateField("street", e.target.value)}
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Número exterior"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.address_num_ext}
                        onChange={(e) => updateField("address_num_ext", e.target.value)}
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Número interior"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.address_num_int}
                        onChange={(e) => updateField("address_num_int", e.target.value)}
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Referencia"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.address_reference}
                        onChange={(e) => updateField("address_reference", e.target.value)}
                        autoComplete="off"
                        placeholder="Ej. Entre calles / color de fachada / etc."
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Código Postal"
                        fullWidth
                        size={fullScreen ? "small" : "medium"}
                        value={form.postal_code}
                        onChange={(e) => updateField("postal_code", e.target.value)}
                        autoComplete="off"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* SECCIÓN: CONDUCTOR */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <BadgeOutlinedIcon fontSize="small" />
                    <Title>Conductor</Title>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <FormControl fullWidth>
                    <InputLabel id="driver-select-label">Seleccionar conductor</InputLabel>
                    <Select
                      labelId="driver-select-label"
                      value={form.idConductor}
                      label="Seleccionar conductor"
                      onChange={(e) => updateField("idConductor", e.target.value)}
                      size={fullScreen ? "small" : "medium"}
                      MenuProps={{
                        PaperProps: { sx: { maxHeight: 360, borderRadius: 2 } },
                      }}
                    >
                      {drivers.length === 0 ? (
                        <MenuItem disabled value="">
                          No hay conductores disponibles
                        </MenuItem>
                      ) : (
                        drivers.map((d) => (
                          <MenuItem key={d.id} value={d.id}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography sx={{ fontWeight: 700 }} variant="body2">
                                {d.license}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                — {d.first_name} {d.last_name}
                              </Typography>
                            </Stack>
                          </MenuItem>
                        ))
                      )}
                    </Select>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Tip: en móvil, desliza para ver toda la lista si es muy larga.
                    </Typography>
                  </FormControl>
                </Paper>
              </Stack>
            )}
          </>
        )}
      </DialogContent>

      {/* Acciones: sticky en móvil, mejor ergonomía */}
      <DialogActions
        sx={{
          position: fullScreen ? "sticky" : "static",
          bottom: 0,
          zIndex: 2,
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          gap: 1,
        }}
      >
        <Button
          onClick={closeModal}
          variant="outlined"
          fullWidth={fullScreen}
          sx={{ borderRadius: 2 }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          fullWidth={fullScreen}
          color={isDelete ? "error" : isEdit ? "warning" : "primary"}
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            fontWeight: 800,
            py: fullScreen ? 1.2 : 1,
          }}
        >
          {mode}
        </Button>
      </DialogActions>
    </Dialog>,
    document.getElementById("modal")
  );
}

export { ModalVehicle };
