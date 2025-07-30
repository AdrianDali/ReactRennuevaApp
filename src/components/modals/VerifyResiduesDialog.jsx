import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { parse } from "date-fns";

export default function VerifyResiduesDialog({ open, onClose, report, onSubmit, user }) {
  const [residuesState, setResiduesState] = useState([]);
  const [residues, setResidues] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Obtener residuos disponibles del backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
      .then((response) => setResidues(response.data))
      .catch((error) => console.error("Error al obtener residuos:", error));
  }, []);

  // Inicializa los residuos de la orden
  useEffect(() => {
    if (report?.residuos) {
      setResiduesState(
        report.residuos.map((residuo) => ({
          ...residuo,
          isValid: null,
          newKg: residuo.kg,
          newM3: residuo.m3,
          originalResiduo: residuo.residuo, 
          isNew: false,
        }))
      );
    }
  }, [report]);

  const handleAction = (idx, isValid) => {
  const updated = [...residuesState];
  const item = updated[idx];

  if (isValid === true && !item.isNew) {
    // Restaurar valores originales si fue corregido antes
    updated[idx] = {
      ...item,
      isValid: true,
      residuo: item.originalResiduo,
      newKg: item.kg,
      newM3: item.m3,
    };
  } else {
    updated[idx].isValid = isValid;
  }

  setResiduesState(updated);
};


  const handleChange = (idx, field, value) => {
    const updated = [...residuesState];
    updated[idx][field] = value;
    setResiduesState(updated);
  };

  const handleAddResiduo = () => {
    setResiduesState([
      ...residuesState,
      {
        residuo: "",
        newKg: "",
        newM3: "",
        isValid: true,
        isNew: true,
      },
    ]);
  };

  const handleSubmit = () => {
    console.log("handleSubmit");
    console.log("residuesState", residuesState);
    console.log("user", user);

    const data = residuesState.map((r) => ({
      user: user, 
      orderRecollection: report.id_order,
      residue: r.residuo,
      residueOriginal: r.originalResiduo,
      valido: r.isNew ? true : r.isValid,
      peso: parseFloat(r.newKg),
      volumen: parseFloat(r.newM3),
    }));

    console.log("Datos a enviar:", data);
    console.log("Report ID:", report);

    axios.post(`${process.env.REACT_APP_API_URL}/create-new-verification-report-residue-user/`, {
      reportId: report.id_report || report.id,
      residues: data,
    })
    .then((response) => {
      console.log("Respuesta del servidor:", response.data);
      setSnackbar({
        open: true,
        message: "Verificación enviada correctamente",
        severity: "success",
      });
      onSubmit();
    })
    .catch((error) => {
      console.error("Error al enviar verificación:", error);
      setSnackbar({
        open: true,
        message: "Error al enviar verificación",
        severity: "error",
      });
    });
    // Log para depuración
    

    console.log("Datos enviados:", data);


    setSnackbar({
      open: true,
      message: "Verificación enviada correctamente",
      severity: "success",
    });
    onClose();
  };

  if (!report) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Verificar residuos – Orden #{report.id_order}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            Peso total: {report.kg_total} kg — Volumen total: {report.m3_total} m³
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {residuesState.map((residuo, idx) => (
            <Box key={idx} mb={3} p={2} border={1} borderRadius={2} borderColor="divider">
              <FormControl fullWidth margin="dense" disabled={residuo.isValid !== false && !residuo.isNew}>
                <InputLabel>Residuo</InputLabel>
                <Select
                  value={residuo.residuo}
                  onChange={(e) => handleChange(idx, "residuo", e.target.value)}
                  label="Residuo"
                >
                  {residues.map((r, i) => (
                    <MenuItem key={i} value={r.nombre}>
                      {r.nombre}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
              
              {residuo.isValid === false && residuo.residuo !== residuo.originalResiduo && (
                <Typography variant="caption" color="text.secondary">
                  Residuo original: {residuo.originalResiduo}
                </Typography>
              )}


              {!residuo.isNew && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Peso original: {residuo.kg} kg — Volumen original: {residuo.m3} m³
                </Typography>
              )}

              <Box mt={2} display="flex" gap={2}>
                {!residuo.isNew && (
                  <>
                    <Button
                      variant={residuo.isValid === true ? "contained" : "outlined"}
                      color="success"
                      onClick={() => handleAction(idx, true)}
                    >
                      Marcar como Correcto
                    </Button>
                    <Button
                      variant={residuo.isValid === false ? "contained" : "outlined"}
                      color="warning"
                      onClick={() => handleAction(idx, false)}
                    >
                      Corregir
                    </Button>
                  </>
                )}
              </Box>

              {(residuo.isNew || residuo.isValid === false) && (
                <Box mt={2}>
                  <TextField
                    label="Nuevo peso (kg)"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={residuo.newKg}
                    onChange={(e) => handleChange(idx, "newKg", e.target.value)}
                    inputProps={{ min: 0, step: 0.001 }}
                  />
                  <TextField
                    label="Nuevo volumen (m³)"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={residuo.newM3}
                    onChange={(e) => handleChange(idx, "newM3", e.target.value)}
                    inputProps={{ min: 0, step: 0.001 }}
                  />
                </Box>
              )}
            </Box>
          ))}

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleAddResiduo}
            sx={{ mt: 2 }}
          >
            + Agregar nuevo residuo
          </Button>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Verifica cada residuo. Si alguno es incorrecto, puedes actualizar sus valores o cambiarlo. También puedes añadir uno nuevo si no estaba registrado.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={residuesState.some((r) => !r.residuo || r.newKg === "" || r.newM3 === "" || (!r.isNew && r.isValid === null))}
          >
            Confirmar Verificación
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
