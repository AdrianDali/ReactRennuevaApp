// CheckRecyclingOrder.jsx
import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { Snackbar, Alert } from "@mui/material";



export default function CheckRecyclingOrder({
  open,
  onClose,
  report,
  onVerify,      // opcional: callback cuando se confirma
  onSendReport,  // opcional: callback cuando se envía un reporte
}) {
  /* ---------------------------------------------------------------------- */
  /*  Estado interno                                                        */
  /* ---------------------------------------------------------------------- */
  const [isReporting, setIsReporting] = useState(false);
  const [selectedResiduo, setSelectedResiduo] = useState("");
  const [newKg, setNewKg] = useState("");
  const [newM3, setNewM3] = useState("");
  const [comment, setComment] = useState("");
  const [reports, setReports] = useState([]); // Estado para almacenar los reportes

  const resetForm = () => {
    setSelectedResiduo("");
    setNewKg("");
    setNewM3("");
    setComment("");
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",   // "success" | "error"
  });

  

  const handleVerify = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/recycling-verified-correct/`, {
        orderId: report.id_order,
      })
      .then((response) => {
        setReports(response.data);           // ← tu refresco de datos
        setSnackbar({
          open: true,
          message: response.data.message ?? "Verificado correctamente",
          severity: "success",
        });
      })
      .catch((error) => {
        const data = error.response?.data ?? {};
        setSnackbar({
          open: true,
          message:
            data.errorMessage ??
            data.error ??
            "Error inesperado al verificar el reporte",
          severity: "error",
        });
      })
      .finally(() => onClose());
  };
  

  const handleSendReport = () => {
    console.log("Reporte enviado:", {
        id_order: report.id_order,
        residuo: selectedResiduo,
        nuevo_kg: parseFloat(newKg),
        nuevo_m3: parseFloat(newM3),
        comentario: comment,
        });
    if (onSendReport) {
      onSendReport({
        id_order: report.id_order,
        residuo: selectedResiduo,
        nuevo_kg: parseFloat(newKg),
        nuevo_m3: parseFloat(newM3),
        comentario: comment,
      });
    }
    
    resetForm();
    setIsReporting(false);
    onClose();
  };

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                */
  /* ---------------------------------------------------------------------- */
  if (!report) return null;

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Residuos de la orden #{report.id_order}</DialogTitle>

      <DialogContent dividers>
        {/* ----------- Totales ------------------------------------------- */}
        <Typography variant="subtitle1" gutterBottom>
          Totales de la orden
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <Typography>Peso: {report.kg_total} kg</Typography>
          <Typography>Volumen: {report.m3_total} m³</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ----------- Lista de residuos --------------------------------- */}
        <Typography variant="subtitle1" gutterBottom>
          Residuos
        </Typography>
        {report.residuos.map((r, idx) => (
          <Box key={idx} display="flex" gap={2} mb={0.5}>
            <Typography>{r.residuo}</Typography>
            <Typography>{r.kg} kg</Typography>
            <Typography>{r.m3} m³</Typography>
          </Box>
        ))}

        {/* ----------- Formulario de reporte (solo si isReporting) -------- */}
        {isReporting && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Reportar inconsistencia
            </Typography>

            {/* Residuo a corregir */}
            <FormControl fullWidth margin="dense">
              <InputLabel>Residuo</InputLabel>
              <Select
                label="Residuo"
                value={selectedResiduo}
                onChange={(e) => setSelectedResiduo(e.target.value)}
              >
                {report.residuos.map((r, idx) => (
                  <MenuItem key={idx} value={r.residuo}>
                    {r.residuo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Nuevo peso */}
            <TextField
              margin="dense"
              label="Nuevo peso (kg)"
              type="number"
              fullWidth
              value={newKg}
              onChange={(e) => setNewKg(e.target.value)}
              inputProps={{ min: 0, step: 0.001 }}
            />

            {/* Nuevo volumen */}
            <TextField
              margin="dense"
              label="Nuevo volumen (m³)"
              type="number"
              fullWidth
              value={newM3}
              onChange={(e) => setNewM3(e.target.value)}
              inputProps={{ min: 0, step: 0.001 }}
            />

            {/* Comentario */}
            <TextField
              margin="dense"
              label="Comentario"
              multiline
              rows={3}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </>
        )}

        {/* ----------- Reportes asociados -------------------------------- */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Reportes asociados
        </Typography>
        {report.reportes.map((rep) => (
          <Box key={rep.id_report} mb={1}>
            <Typography variant="body2">
              Folio {rep.id_report} – {rep.status_reporte}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Centro: {rep.centro_recoleccion}
            </Typography>
          </Box>
        ))}
      </DialogContent>

      {/* ------------------------------------------------------------------ */}
      {/*  Acciones                                                          */}
      {/* ------------------------------------------------------------------ */}
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        {!isReporting ? (
          <>
            <Button color="success" onClick={handleVerify}>
              Verificar OK
            </Button>
            <Button color="warning" onClick={() => setIsReporting(true)}>
              Reportar
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => {
                resetForm();
                setIsReporting(false);
              }}
            >
              Atrás
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSendReport}
              disabled={
                !selectedResiduo || newKg === "" || newM3 === "" || !comment
              }
            >
              Enviar reporte
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
    <Snackbar
    open={snackbar.open}                       // ← estado local
    autoHideDuration={4000}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert
      severity={snackbar.severity}             // "success" | "error"
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      sx={{ width: "100%" }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
  </>
  );
}
