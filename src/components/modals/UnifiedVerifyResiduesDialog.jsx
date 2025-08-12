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
  InputAdornment,
} from "@mui/material";
import axios from "axios";

export default function UnifiedVerifyResiduesDialog({
  open,
  onClose,
  residueReportInfo = {},
  residues = [],
  report = null,
  user,
  onSubmit, // callback tras submit exitoso
}) {
  const [residuesState, setResiduesState] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const totalKg = residueReportInfo.residues_summary?.reduce(
    (sum, r) => sum + (r.total_kg || 0),
    0
  );
  const totalM3 = residueReportInfo.residues_summary?.reduce(
    (sum, r) => sum + (r.total_m3 || 0),
    0
  );

  // Inicializa los residuos del reporte
  useEffect(() => {
    if (residueReportInfo?.residues_summary) {
      setResiduesState(
        residueReportInfo.residues_summary.map((residuo) => ({
          id: residuo.id, // si tienes ID
          residuo: residuo.residue_name,
          kg: residuo.total_kg,
          m3: residuo.total_m3,
          verification_status: residuo.verification_status,
          isValid: residuo.verification_status === "VERIFICADO",
          isEditing: false,
          isNew: false,
          originalResiduo: residuo.residue_name,
          newKg: residuo.total_kg,
          newM3: residuo.total_m3,
        }))
      );
    }
  }, [residueReportInfo]);

  // Maneja acción de verificación
  const handleAction = (idx, isValid) => {
    const updated = [...residuesState];
    updated[idx].isValid = isValid;
    updated[idx].verification_status = isValid ? "VERIFICADO" : "REPORTADO";
    updated[idx].isEditing = !isValid; // solo permite editar si está reportado
    setResiduesState(updated);
  };

  // Maneja edición de campos
  const handleChange = (idx, field, value) => {
    const updated = [...residuesState];
    updated[idx][field] = value;
    setResiduesState(updated);
  };

  // Alterna modo edición inline
  const handleEdit = (idx) => {
    const updated = [...residuesState];
    updated[idx].isEditing = true;
    setResiduesState(updated);
  };

  // Guardar cambios después de editar
  const handleSaveEdit = (idx) => {
    const updated = [...residuesState];
    updated[idx].isEditing = false;
    updated[idx].isValid = false; // tras editar, requiere re-verificación
    updated[idx].verification_status = "REPORTADO";
    setResiduesState(updated);
  };

  // Agrega nuevo residuo
  const handleAddResiduo = () => {
    setResiduesState([
      ...residuesState,
      {
        residuo: "",
        kg: "",
        m3: "",
        isValid: true,
        isNew: true,
        isEditing: true,
        verification_status: "VERIFICADO",
        originalResiduo: "",
        newKg: "",
        newM3: "",
      },
    ]);
  };

  // Guardar nuevo residuo
  const handleSaveNewResiduo = (idx) => {
    const updated = [...residuesState];
    updated[idx].isEditing = false;
    updated[idx].isValid = true;
    updated[idx].verification_status = "VERIFICADO";
    setResiduesState(updated);
  };

  const handleEditSubmit = async ({
    residue_id,
    checker_username,
    status,
    new_weight,
    new_m3,
    measurement_comments,
  }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/checker-verified-report/`,
        [
          {
            residue_id,
            checker_username,
            status,
            new_weight,
            new_m3,
            measurement_comments,
          },
        ]
      );
      // Puedes actualizar el estado local si lo deseas
    } catch (error) {
      console.error("Error al editar el residuo:", error);
      setSnackbar({
        open: true,
        message: "Error al editar el residuo",
        severity: "error",
      });
    }
  };

  const handleConfirmCorrect = async (residueName, orderId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/driver-verified-order-reports-residue/`,
        {
          residue_name: residueName,
          orderId: orderId,
          status: "VERIFICADO",
        }
      );
      // Puedes actualizar el estado local si lo deseas
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: `Error al verificar residuo ${residueName}`,
        severity: "error",
      });
    }
  };

  // Enviar verificación
  const handleSubmit = async () => {
    for (const residuo of residuesState) {
        console.log("Residuo:", residuo);
      if (residuo.isValid) {
        // CORRECTO/VERIFICADO
        await handleConfirmCorrect(
          residuo.residuo, // residue_name
          residueReportInfo.id_order || report?.id // orderId
          // ...agrega más props si tu handleConfirmCorrect los necesita
        );
      } else {
        // NO VÁLIDO/REPORTADO
        await handleEditSubmit({
          residue_id: residuo.id, // <-- Ajusta según tu backend
          checker_username: user,
          status: "REPORTADO",
          new_weight: residuo.newKg,
          new_m3: residuo.newM3,
          measurement_comments: "Residuo editado",
        });
      }
    }
    setSnackbar({
      open: true,
      message: "Verificación finalizada",
      severity: "success",
    });
    onSubmit && onSubmit();
    onClose();
  };

  if (!residueReportInfo) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Verificar residuos – Orden #{report?.id}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            Peso total: {totalKg} kg — Volumen total: {totalM3} m³
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {residuesState.length > 0 ? (
            residuesState.map((residuo, idx) => (
              <Box
                key={idx}
                mb={3}
                p={2}
                border={1}
                borderRadius={2}
                borderColor="divider"
              >
                {/* Estado del residuo */}
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="subtitle1"
                    color="secondary"
                    fontWeight={500}
                  >
                    {residuo.isNew ? "Nuevo residuo" : `Residuo:`}
                  </Typography>
                  <Typography variant="body1" ml={1}>
                    {residuo.residuo}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={
                      residuo.verification_status === "VERIFICADO"
                        ? "success.main"
                        : residuo.verification_status === "REPORTADO"
                        ? "warning.main"
                        : "error.main"
                    }
                    ml={2}
                  >
                    {residuo.verification_status === "VERIFICADO"
                      ? "Verificado"
                      : residuo.verification_status === "REPORTADO"
                      ? "Reportado"
                      : "No verificado"}
                  </Typography>
                </Box>

                {/* Mostrar residuo original si cambió */}
                {!residuo.isNew &&
                  residuo.residuo !== residuo.originalResiduo && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Residuo original: {residuo.originalResiduo}
                    </Typography>
                  )}

                {/* Mostrar peso original si cambió */}
                {!residuo.isNew &&
                  residuo.newKg !== undefined &&
                  residuo.newKg !== "" &&
                  parseFloat(residuo.kg) !== parseFloat(residuo.newKg) && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Peso original: {residuo.kg} kg
                    </Typography>
                  )}

                {/* Mostrar volumen original si cambió */}
                {!residuo.isNew &&
                  residuo.newM3 !== undefined &&
                  residuo.newM3 !== "" &&
                  parseFloat(residuo.m3) !== parseFloat(residuo.newM3) && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Volumen original: {residuo.m3} m³
                    </Typography>
                  )}

                {/* Edición inline */}
                {residuo.isEditing ? (
                  <>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Residuo</InputLabel>
                      <Select
                        value={residuo.residuo}
                        onChange={(e) =>
                          handleChange(idx, "residuo", e.target.value)
                        }
                        label="Residuo"
                      >
                        {residues.map((r, i) => (
                          <MenuItem key={i} value={r.nombre}>
                            {r.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Nuevo peso (kg)"
                      type="number"
                      fullWidth
                      margin="dense"
                      value={residuo.newKg}
                      onChange={(e) =>
                        handleChange(idx, "newKg", e.target.value)
                      }
                      inputProps={{ min: 0, step: 0.001 }}
                    />
                    <TextField
                      label="Nuevo volumen (m³)"
                      type="number"
                      fullWidth
                      margin="dense"
                      value={residuo.newM3}
                      onChange={(e) =>
                        handleChange(idx, "newM3", e.target.value)
                      }
                      inputProps={{ min: 0, step: 0.001 }}
                    />
                    <Box mt={1} display="flex" gap={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          residuo.isNew
                            ? handleSaveNewResiduo(idx)
                            : handleSaveEdit(idx)
                        }
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleChange(idx, "isEditing", false)}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Peso:{" "}
                      {residuo.newKg !== undefined && residuo.newKg !== ""
                        ? residuo.newKg
                        : residuo.kg}{" "}
                      kg — Volumen:{" "}
                      {residuo.newM3 !== undefined && residuo.newM3 !== ""
                        ? residuo.newM3
                        : residuo.m3}{" "}
                      m³
                    </Typography>
                    <Box mt={2} display="flex" gap={2}>
                        <Button
                            variant={residuo.verification_status === "VERIFICADO" ? "contained" : "outlined"}
                            color="success"
                            disabled={residuo.verification_status === "VERIFICADO" || residuo.verification_status === "REPORTADO"}
                            onClick={() => handleAction(idx, true)}
                        >
                            Marcar como Correcto
                        </Button>
                        <Button
                            variant={residuo.verification_status === "REPORTADO" ? "contained" : "outlined"}
                            color="warning"
                            disabled={residuo.verification_status === "REPORTADO" || residuo.verification_status === "VERIFICADO"}
                            onClick={() => handleEdit(idx)}
                        >
                            Editar
                        </Button>
                        </Box>

                  </>
                )}
              </Box>
            ))
          ) : (
            <Typography>No hay residuos para este reporte.</Typography>
          )}

          {/* Agregar nuevo residuo */}
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
            Verifica cada residuo. Si alguno es incorrecto, puedes actualizar
            sus valores o cambiarlo. También puedes añadir uno nuevo si no
            estaba registrado.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={residuesState.some(
              (r) =>
                !r.residuo ||
                (r.isEditing && (r.newKg === "" || r.newM3 === ""))
            )}
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
