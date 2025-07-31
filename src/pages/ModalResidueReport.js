import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import axios from "axios";
import { TodoContext } from "../context/index.js";
import { PersistentAlert } from "../components/alerts/PersistentAlert.jsx";



function ModalResidueReport({ report }) {
  const [residues, setResidues] = useState([]);
  const [entries, setEntries] = useState([
    {
      user: report.nombre_usuario,
      report: report.id_report,
      residue: "",
      peso: "",
      volumen: "",
    },
  ]);
  const [botonAdd, setBotonAdd] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("success"); // "success" o "error"
  const [alertMessage, setAlertMessage] = useState("");


  const {
    openModalEditResidueReport,
    setOpenModalEditResidueReport,
    setUpdateReportInfo,
  } = useContext(TodoContext);

  const closeModal = () => {
    setUpdateReportInfo((prev) => !prev);
    setOpenModalEditResidueReport(false);
  };

  useEffect(() => {
    const getResidues = {
      reportId: report.id_report ? report.id_report : report.id,
    };

    // 1. Obtener todos los residuos
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
      .then((response) => {
        console.log("Todos los residuos:", response.data);
        setResidues(response.data);
      })
      .catch((error) => {
        console.error("Hubo un problema al obtener los residuos:", error);
      });

    // 2. Obtener todos los residuos de este reporte (si existe reportId)
    if (
      getResidues.reportId !== undefined &&
      getResidues.reportId !== null &&
      getResidues.reportId !== ""
    ) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`,
          getResidues
        )
        .then((response) => {
          const data = response.data;
          console.log("Todos los residuos del reporte:", data);
          setEntries(data);
          if (data.length < 1) {
            setBotonAdd(true);
          }
        })
        .catch((error) => {
          console.error("Hubo un problema al obtener los residuos:", error);
        });
    }
  }, [report]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const values = [...entries];
    values[index][name] = value;
    setEntries(values);
  };

  const handleAddFields = () => {
    setEntries([
      ...entries,
      {
        user: report.nombre_usuario,
        report: report.id_report,
        residue: "",
        peso: "",
        volumen: "",
      },
    ]);
  };

  const handleAddFirstFields = () => {
    handleAddFields();
    setBotonAdd(false);
  };

  const handleRemoveFields = (index) => {
    const values = [...entries];
    values.splice(index, 1);
    setEntries(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/create-report-residue-user/`,
        entries
      )
      .then((response) => {
        setAlertType("success");
        setAlertMessage("Residuos guardados correctamente.");
        setAlertOpen(true);
         e.target.reset();
         closeModal();
      })
      .catch((error) => {
        // Mostrar alerta de error
        console.error(error);
        setAlertType("error");
        setAlertMessage("Error al guardar. Inténtalo de nuevo.");
        setAlertOpen(true);
      });
  };

  return ReactDOM.createPortal(
    <>
    {/* 1) La alerta persistente en la parte superior */}
      <PersistentAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => {
          setAlertOpen(false);
          // Si quieres cerrar el modal apenas el usuario cierre la alerta:
          if (alertType === "success") {
            closeModal();
          }
        }}
      />
      
    <Dialog
      open={openModalEditResidueReport}
      onClose={closeModal}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          borderRadius: isMobile ? 3 : 4,      // bordes más redondeados
          maxHeight: '90vh',
        },
      }}
    >
      {/* Encabezado del diálogo */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: isMobile ? 2 : 3,
          py: isMobile ? 1 : 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">Reporte de Residuos</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={closeModal}
          aria-label="cerrar"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Contenido: formulario con scroll interno si excede */}
      <DialogContent
        dividers
        sx={{
          px: isMobile ? 2 : 3,
          pt: 2,
          pb: 2,
          overflowY: "auto",
          maxHeight: "70vh",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* Si no hay entradas y botonAdd=true, mostramos solo el botón para agregar la primera fila */}
            {entries.length === 0 && botonAdd && (
              <Button
                type="button"
                variant="contained"
                fullWidth={isMobile}
                onClick={handleAddFirstFields}
                sx={{ mt: 1 }}
              >
                Agregar Residuo
              </Button>
            )}

            {/* Mapeo de cada fila de entrada */}
            {entries.map((entry, index) => (
              <Grid
                container
                spacing={1}
                key={index}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  position: 'relative',
                  bgcolor: theme.palette.background.default,
                  mb: 1,
                }}
              >
                

                {/* Campo “Residuo” */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id={`label-residue-${index}`}>
                      Residuo
                    </InputLabel>
                    <Select
                      labelId={`label-residue-${index}`}
                      name="residue"
                      value={entry.residue}
                      label="Residuo"
                      onChange={(event) => handleInputChange(index, event)}
                      sx={{
                        // agregamos algo de margen derecho para que no quede tan pegado al ícono
                        pr: isMobile ? 0 : 1,
                        
                      }}
                    >
                      <MenuItem value="">
                        <em>Selecciona…</em>
                      </MenuItem>
                      {residues.map((res, idx) => (
                        <MenuItem key={idx} value={res.nombre}>
                          {res.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Campo “Peso en kg” */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    name="peso"
                    label="Peso (kg)"
                    variant="outlined"
                    type="number"
                    value={entry.peso}
                    onChange={(event) => {
                      const value = event.target.value;
                      if(value === "") {
                        handleInputChange(index, event);
                        return;
                      }
                      const valor = parseFloat(value);
                      const regexTresDecimales = /^\d*(\.\d{0,3})?$/;

                      if (
                        (regexTresDecimales.test(value)) &&
                        valor >= 0 &&
                        valor <= 1000
                      ) {
                        handleInputChange(index, event);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">kg</InputAdornment>
                      ),
                      inputProps: { min: 0, max: 1000, step: 0.001 },
                    }}
                  />
                </Grid>

                {/* Campo “Volumen en m³” */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    name="volumen"
                    label="Volumen (m³)"
                    variant="outlined"
                    type="number"
                    value={entry.volumen}
                    onChange={(event) => {
                      const value = event.target.value;
                      if(value === "") {
                        handleInputChange(index, event);
                        return;
                      }
                      const valor = parseFloat(value);
                      const regexTresDecimales = /^\d*(\.\d{0,3})?$/;

                      if (
                        (regexTresDecimales.test(value)) &&
                        valor >= 0 &&
                        valor <= 1000
                      ) {
                        handleInputChange(index, event);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">m³</InputAdornment>
                      ),
                      inputProps: { min: 0, max: 1000, step: 0.001 },
                    }}
                  />
                </Grid>

                 <IconButton
        onClick={() => handleRemoveFields(index)}
        sx={{
          color: theme.palette.error.main,
          p: isMobile ? 1.5 : 1,
          mr:  isMobile ? 1.5 : 1,      // margen entre el botón “Eliminar” y el de “Agregar”
          ...(isMobile && { transform: 'scale(1.4)' }),
          '&:hover': { backgroundColor: 'transparent' },
        }}
        aria-label="Eliminar residuo"
      >
        <RemoveCircleOutlineIcon fontSize={isMobile ? 'large' : 'medium'} />
      </IconButton>

      <IconButton
        onClick={handleAddFields}
        sx={{
          color: theme.palette.primary.main,
          p: isMobile ? 1.5 : 1,
          ...(isMobile && { transform: 'scale(1.4)' }),
          '&:hover': { backgroundColor: 'transparent' },
        }}
        aria-label="Agregar residuo"
      >
        <AddCircleOutlineIcon fontSize={isMobile ? 'large' : 'medium'} />
      </IconButton>
              </Grid>
            ))}

            {/* Si hay al menos una entrada y botonAdd=false, mostramos el botón de “Enviar” */}
            {entries.length > 0 && !botonAdd && (
              <Button
                type="submit"
                variant="contained"
                fullWidth={isMobile}
                sx={{ mt: 2 }}
              >
                Enviar
              </Button>
            )}
          </Stack>
        </form>
      </DialogContent>

      {/* Si sigue sin haber entradas y botonAdd=false (caso excepcional), mostramos igualmente “Agregar Residuo” */}
      {entries.length === 0 && !botonAdd && (
        <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
          <Button
            type="button"
            variant="contained"
            fullWidth={isMobile}
            onClick={handleAddFirstFields}
          >
            Agregar Residuo
          </Button>
        </DialogActions>
      )}

      {/* Si ya hay entradas y botonAdd=true, mostramos “Agregar Residuo” debajo del contenido */}
      {entries.length > 0 && botonAdd && (
        <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
          <Button
            type="button"
            variant="contained"
            fullWidth={isMobile}
            onClick={handleAddFirstFields}
          >
            Agregar Residuo
          </Button>
        </DialogActions>
      )}
    </Dialog>
    
    </>,
    // Usamos ReactDOM.createPortal para renderizar el modal en un nodo específico del DOM
    document.getElementById("modal-root") ||
      document.body ||
      document.documentElement ||
      document.createElement("div") // Fallback for environments without a modal root

      
  );
}

export { ModalResidueReport };
