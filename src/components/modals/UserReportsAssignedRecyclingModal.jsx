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
  Box,
} from "@mui/material";
import {
  Close as CloseIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import axios from "axios";
import { TodoContext } from "../../context";
import { PersistentAlert } from "../../components/alerts/PersistentAlert.jsx";

function ModalOrderResidueDetail({ orderReport , dataUser }) {
  console.log("ModalOrderResidueDetail orderReport:", orderReport);
  console.log("ModalOrderResidueDetail dataUser:", dataUser);
  // 1. Estados locales
  const [residues, setResidues] = useState([]);
  const [entries, setEntries] = useState([
    {
      order: orderReport.id_order || "",
      report: orderReport.reportes[0]?.id_report || "",
      residue: "",
      peso: "",
      volumen: "",
    },
  ]);
  const [botonAdd, setBotonAdd] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 2. Contexto
  const {
    setUpdateReportInfo,
    userReportsAssignedRecycling,
    setUserReportsAssignedRecycling
  } = useContext(TodoContext);

  // 3. Calcular totales de los residuos agregados
  const totalPesoAgregado = entries.reduce((acc, curr) => acc + Number(curr.peso || 0), 0);
  const totalVolumenAgregado = entries.reduce((acc, curr) => acc + Number(curr.volumen || 0), 0);

  // 4. Totales máximos por la orden
  const maxPeso = Number(orderReport.peso_total_orden) || 0;
  const maxVolumen = Number(orderReport.m3_total_orden) || 0;

  // 5. Para saber si completaste el total
  const cumpleTotales =
    totalPesoAgregado >= maxPeso &&
    totalVolumenAgregado >= maxVolumen &&
    maxPeso > 0 &&
    maxVolumen > 0;

  const closeModal = () => {
    setUpdateReportInfo((prev) => !prev);
    setUserReportsAssignedRecycling(false);
  };

  useEffect(() => {

    const getResidues = {reportId : orderReport.reportes[0].id_report ? orderReport.reportes[0].id_report : orderReport.id};

    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
      .then((response) => {
        setResidues(response.data);
      })
      .catch((error) => {
        console.error("Hubo un problema al obtener los residuos:", error);
      });

    axios.post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, getResidues)
            .then(response => {
                const data = response.data;
                console.log(response.data)
                setEntries([...data]);
            })
            .catch(error => {
                console.error('Hubo un problema al obtener los residuos:', error);
            });

    
  }, [orderReport]);

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
        order: orderReport.id_order,
        report: orderReport.reportes[0]?.id_report,
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

  // Bloquea submit si te pasas del máximo
  const bloqueado =
    (maxPeso > 0 && totalPesoAgregado > maxPeso) ||
    (maxVolumen > 0 && totalVolumenAgregado > maxVolumen);

  // GENERA UN ID TEMPORAL ÚNICO PARA id_report_residue
  const generateTempId = (idx) => Date.now() + idx;

const handleSubmit = (e) => {
  e.preventDefault();

  // Calcula si totales son correctos
  const totalsOk =
    totalPesoAgregado === maxPeso &&
    totalVolumenAgregado === maxVolumen &&
    maxPeso > 0 &&
    maxVolumen > 0;

  // Define el status según condición para ambas peticiones
  const statusGeneral = totalsOk ? "VERIFICADO" : "REPORTADO";

  const userMail = orderReport?.reportes?.[0]?.usuario?.username || "anonimo@anonimo.com";
  const reportId = orderReport?.reportes?.[0]?.id_report;

  const dataToSend = entries.map((entry, idx) => ({
    report: reportId,
    id_report_residue: generateTempId(idx),
    residue: entry.residue,
    user: userMail,
    peso: Number(entry.peso),
    volumen: Number(entry.volumen),
    status: statusGeneral, // <-- Aquí está el cambio importante
  }));

  // PRIMERA PETICIÓN: Guarda los residuos
  axios
    .post(
      `${process.env.REACT_APP_API_URL}/create-report-residue-user/`,
      dataToSend
    )
    .then((response) => {
      // Usa los IDs generados en response.data.generated_report_residue_ids
      const generatedIds = response.data.generated_report_residue_ids || [];
      const jsonRequest = entries.map((entry, idx) => ({
        residue_id: generatedIds[idx], // Usar el ID generado correcto
        checker_username: dataUser.user,
        status: statusGeneral,
        comments: statusGeneral === "VERIFICADO"
          ? "Residuo verificado correctamente por el recolector"
          : "Residuo reportado por el recolector",
        new_weight: Number(entry.peso),
        new_m3: Number(entry.volumen),
        measurement_comments: "Mediciones actualizadas por el recolector",
      }));

      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/Rennueva/checker-verified-report/`,
          jsonRequest
        )
        .then((response) => {
          setAlertType("success");
          setAlertMessage(
            statusGeneral === "VERIFICADO"
              ? "Residuo verificado correctamente."
              : "Residuo reportado correctamente."
          );
          setAlertOpen(true);
          setUpdateReportInfo((prev) => !prev);
          closeModal();
        })
        .catch((error) => {
          setAlertType("error");
          setAlertMessage("Error al actualizar el residuo. Inténtalo de nuevo.");
          setAlertOpen(true);
        });
    })
    .catch((error) => {
      setAlertType("error");
      setAlertMessage("Error al guardar los residuos. Inténtalo de nuevo.");
      setAlertOpen(true);
    });
};



  return ReactDOM.createPortal(
    <>
      <PersistentAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => {
          setAlertOpen(false);
          if (alertType === "success") {
            closeModal();
          }
        }}
      />
      <Dialog
        open={userReportsAssignedRecycling}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: isMobile ? 3 : 4,
            maxHeight: "90vh",
          },
        }}
      >
        {/* CABECERA CON TOTALES */}
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.default,
          }}
        >
          <Typography variant="h6" textAlign="center" sx={{ width: "100%" }}>
            Orden #{orderReport.id_order}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography
                variant="body1"
                fontWeight={700}
                color={cumpleTotales ? "success.main" : "error.main"}
                textAlign="center"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: cumpleTotales
                    ? "success.light"
                    : "error.light",
                  display: "inline-block",
                  fontSize: "1.1rem",
                  letterSpacing: 1,
                  minWidth: "170px",
                }}
              >
                Peso total: {maxPeso.toFixed(3)} kg
                <br />
                <span style={{
                  fontSize: "0.93rem",
                  fontWeight: 400,
                  color: theme.palette.text.secondary,
                }}>
                  Agregado: {totalPesoAgregado.toFixed(3)} kg
                </span>
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body1"
                fontWeight={700}
                color={cumpleTotales ? "success.main" : "error.main"}
                textAlign="center"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: cumpleTotales
                    ? "success.light"
                    : "error.light",
                  display: "inline-block",
                  fontSize: "1.1rem",
                  letterSpacing: 1,
                  minWidth: "170px",
                }}
              >
                Volumen total: {maxVolumen.toFixed(3)} m³
                <br />
                <span style={{
                  fontSize: "0.93rem",
                  fontWeight: 400,
                  color: theme.palette.text.secondary,
                }}>
                  Agregado: {totalVolumenAgregado.toFixed(3)} m³
                </span>
              </Typography>
            </Box>
          </Stack>
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeModal}
            aria-label="cerrar"
            sx={{
              position: "absolute",
              right: isMobile ? 6 : 12,
              top: isMobile ? 8 : 16,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* CONTENIDO */}
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
              {/* Botón para agregar primer residuo si no hay */}
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
              {/* Lista de residuos */}
              {entries.map((entry, index) => (
                <Grid
                  container
                  spacing={1}
                  key={index}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 2,
                    position: "relative",
                    bgcolor: theme.palette.background.default,
                    mb: 1,
                  }}
                >
                  {/* RESIDUO */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`label-residue-${index}`}>Residuo</InputLabel>
                      <Select
                        labelId={`label-residue-${index}`}
                        name="residue"
                        value={entry.residue}
                        label="Residuo"
                        onChange={(event) => handleInputChange(index, event)}
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
                  {/* PESO */}
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
                        const valor = parseFloat(event.target.value);
                        const regexTresDecimales = /^\d*(\.\d{0,3})?$/;
                        if (
                          (!event.target.value || regexTresDecimales.test(event.target.value)) &&
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
                  {/* VOLUMEN */}
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
                        const valor = parseFloat(event.target.value);
                        const regexTresDecimales = /^\d*(\.\d{0,3})?$/;
                        if (
                          (!event.target.value || regexTresDecimales.test(event.target.value)) &&
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
                  {/* BOTONES DE AGREGAR Y ELIMINAR */}
                  <IconButton
                    onClick={() => handleRemoveFields(index)}
                    sx={{
                      color: theme.palette.error.main,
                      p: isMobile ? 1.5 : 1,
                      mr: isMobile ? 1.5 : 1,
                      ...(isMobile && { transform: "scale(1.4)" }),
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                    aria-label="Eliminar residuo"
                  >
                    <RemoveCircleOutlineIcon fontSize={isMobile ? "large" : "medium"} />
                  </IconButton>
                  <IconButton
                    onClick={handleAddFields}
                    sx={{
                      color: theme.palette.primary.main,
                      p: isMobile ? 1.5 : 1,
                      ...(isMobile && { transform: "scale(1.4)" }),
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                    aria-label="Agregar residuo"
                  >
                    <AddCircleOutlineIcon fontSize={isMobile ? "large" : "medium"} />
                  </IconButton>
                </Grid>
              ))}
              {/* Botón de enviar, solo si hay entradas */}
              {entries.length > 0 && !botonAdd && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth={isMobile}
                  sx={{ mt: 2 }}
                  //disabled={bloqueado}
                  color={cumpleTotales ? "success" : "primary"}
                >
                  { "Enviar"}
                </Button>
              )}
            </Stack>
          </form>
        </DialogContent>
        {/* Botón de agregar si no hay filas */}
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
        {/* Si ya hay entradas y botonAdd=true, mostramos “Agregar Residuo” */}
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
    document.getElementById("modal-root") ||
      document.body ||
      document.documentElement ||
      document.createElement("div")
  );
}

export { ModalOrderResidueDetail };