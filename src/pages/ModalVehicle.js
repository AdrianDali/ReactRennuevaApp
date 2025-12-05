import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
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
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
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
  } = useContext(TodoContext);

  const open =
    openModalCreateVehicle || openModalEditVehicle || openModalDeleteVehicle;

  // Estado agrupado y limpio ✨
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

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [oldVehicle, setOldVehicle] = useState("");

  const closeModal = () => {
    setOpenModalCreateVehicle(false);
    setOpenModalEditVehicle(false);
    setOpenModalDeleteVehicle(false);
  };

  const updateField = (field, value) => {
    if (mode !== "BORRAR") {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  useEffect(() => {
    Promise.all([
      axios.get(`${process.env.REACT_APP_API_URL}/get-all-vehicle/`),
      axios.get(`${process.env.REACT_APP_API_URL}/get-all-drivers/`)
    ])
      .then(([v, d]) => {
        setVehicles(v.data);
        setDrivers(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectExistingVehicle = (placa) => {
    setOldVehicle(placa);
    const v = vehicles.find((x) => x.placas === placa);

    setForm({
      modelo: v.modelo,
      placas: v.placas,
      capacidad: v.capacidad,
      permiso: v.permiso,
      idConductor: v.idConductor,
      state: v.state || "",
      city: v.city || "",
      locality: v.locality || "",
      street: v.street || "",
      address_num_ext: v.address_num_ext || "",
      address_num_int: v.address_num_int || "",
      address_reference: v.address_reference || "",
      postal_code: v.postal_code || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload =
      mode === "CREAR"
        ? { ...form, creator_user: creatorUser }
        : mode === "EDITAR"
        ? { ...form, antiguasPlacas: oldVehicle, creator_user: creatorUser }
        : { placas: oldVehicle, creator_user: creatorUser };

    const url =
      mode === "CREAR"
        ? "/create-vehicle/"
        : mode === "EDITAR"
        ? "/update-vehicle/"
        : "/delete-vehicle/";

    const method = mode === "BORRAR" ? axios.post : mode === "EDITAR" ? axios.put : axios.post;

    method(`${process.env.REACT_APP_API_URL}${url}`, payload)
      .then(() => {
        setUpdateVehicleInfo(true);
        setOpenModalText(true);
        setTextOpenModalText(
          mode === "CREAR"
            ? "Vehículo creado exitosamente"
            : mode === "EDITAR"
            ? "Vehículo actualizado correctamente"
            : "Vehículo eliminado correctamente"
        );
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
    <Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {mode === "CREAR" && "Crear Vehículo"}
        {mode === "EDITAR" && "Editar Vehículo"}
        {mode === "BORRAR" && "Eliminar Vehículo"}

        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "75vh" }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {(mode === "EDITAR" || mode === "BORRAR") && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Seleccionar vehículo</InputLabel>
                <Select
                  value={oldVehicle}
                  label="Seleccionar vehículo"
                  onChange={(e) => handleSelectExistingVehicle(e.target.value)}
                >
                  {vehicles.map((v) => (
                    <MenuItem key={v.placas} value={v.placas}>
                      {v.placas} – {v.modelo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {mode === "BORRAR" && oldVehicle && (
              <Typography color="red" sx={{ mb: 3 }}>
                Esta acción eliminará el vehículo seleccionado. ¿Deseas continuar?
              </Typography>
            )}

            {mode !== "BORRAR" && (
              <>
                <Title>Información del Vehículo</Title>

                <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Modelo"
                      fullWidth
                      value={form.modelo}
                      onChange={(e) => updateField("modelo", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Placas"
                      fullWidth
                      value={form.placas}
                      onChange={(e) => updateField("placas", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Permiso"
                      fullWidth
                      value={form.permiso}
                      onChange={(e) => updateField("permiso", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Capacidad"
                      fullWidth
                      value={form.capacidad}
                      onChange={(e) => updateField("capacidad", e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Title>Ubicación</Title>

                <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <TextField label="Estado" fullWidth value={form.state} onChange={(e) => updateField("state", e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Ciudad" fullWidth value={form.city} onChange={(e) => updateField("city", e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Colonia" fullWidth value={form.locality} onChange={(e) => updateField("locality", e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Calle" fullWidth value={form.street} onChange={(e) => updateField("street", e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Número exterior" fullWidth value={form.address_num_ext} onChange={(e) => updateField("address_num_ext", e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Número interior" fullWidth value={form.address_num_int} onChange={(e) => updateField("address_num_int", e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Referencia" fullWidth value={form.address_reference} onChange={(e) => updateField("address_reference", e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Código Postal" fullWidth value={form.postal_code} onChange={(e) => updateField("postal_code", e.target.value)} />
                  </Grid>
                </Grid>

                <Title>Conductor</Title>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Seleccionar conductor</InputLabel>
                  <Select
                    value={form.idConductor}
                    label="Seleccionar conductor"
                    onChange={(e) => updateField("idConductor", e.target.value)}
                  >
                    {drivers.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.license} – {d.first_name} {d.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode}
        </Button>
      </DialogActions>
    </Dialog>,
    document.getElementById("modal")
  );
}

export { ModalVehicle };
