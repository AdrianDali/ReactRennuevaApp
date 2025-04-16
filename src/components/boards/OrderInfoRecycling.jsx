import { Box, Typography, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";

import { format } from "date-fns";
import { da } from "date-fns/locale";
import axios from "axios";

export default function ReportInfoRecycling({ request }) {
  const [residueReportInfo, setResidueReportInfo] = useState([]);

  console.log("request", request);

  const [orderRecollectionInfo, setOrderRecollectionInfo] = useState(request);
  const [openResiduoModal, setOpenResiduoModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [residuesPerReport, setResiduesPerReport] = useState([]);

  // Estados para controlar los modales de confirmación y edición.
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  // Índice del residuo seleccionado para verificar/editar.
  const [selectedResiduoIndex, setSelectedResiduoIndex] = useState(null);
  // Estados para el formulario de edición.
  const [editedResidueName, setEditedResidueName] = useState("");
  const [editedPeso, setEditedPeso] = useState("");
  const [editedVolumen, setEditedVolumen] = useState("");
  const [statusResidue, setStatusResidue] = useState("");

  const [residues, setResidues] = useState([]);

  useEffect(() => {
    const fetchResidues = async () => {
      try {
        const responseResidues = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-residue/`
        );
        setResidues(responseResidues.data);
        console.log("Residuos", responseResidues.data);
      } catch (error) {
        console.error("Error al obtener residuos:", error);
      }
    };

    fetchResidues();
  }, []);

  // Abre el modal de confirmación para el residuo seleccionado.
  const handleOpenConfirmModal = (index) => {
    console.log("Residuo seleccionado:", residueReportInfo[index]);
    console.log("Residuo seleccionado:", residueReportInfo[index].residue);
    console.log("Residuo seleccionado:", residueReportInfo[index].peso);

    setSelectedResiduoIndex(index);
    setOpenConfirmModal(true);
  };

  // Si el usuario confirma que el residuo es correcto, se marca como verificado.
  const handleConfirmCorrect = () => {
    console.log("Residuo verificado:", editedResidueName);
    console.log(
      "Residuo verificado:",
      residueReportInfo[selectedResiduoIndex].residue
    );
    console.log(
      "Residuo verificado:",
      residueReportInfo[selectedResiduoIndex].peso
    );
    console.log("Residuo verificado:", orderRecollectionInfo.id);
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/driver-collected-status-residue/`,
        {
          residue_name: "editedResidueName",
          residueId: orderRecollectionInfo.id,
          status: "VERIFICADO",
        }
      )
      .then((response) => {
        console.log("Residuo verificado:", response.data);

        // Actualiza el estado del residuo verificado
        // setResidueReportInfo((prev) => {
        //   const newResidues = [...prev];
        //   newResidues[selectedResiduoIndex] = {
        //     ...newResidues[selectedResiduoIndex],
        //     verified: true,
        //   };
        //   return newResidues;
        // });
      })
      .catch((error) => {
        console.error(error);
      });
    setOpenConfirmModal(false);
  };

  /**
   * Maneja la apertura del modal para el residuo seleccionado.
   * Realiza una petición POST para obtener los residuos asociados a un reporte,
   * actualiza el estado del componente y determina el valor de 'verified'
   * en función del status del primer elemento del arreglo de respuesta.
   *
   * @param {Object} report - Objeto con la información del reporte.
   */
  const handleOpenResiduoModal = async (report) => {
    try {
      // Mostrar en consola el reporte recibido
      console.log("Reporte recibido:", report);

      // Extrae el reportId del folio (asumiendo que es el último elemento separado por guiones)
      const reportId = parseInt(report.folio.split("-").pop(), 10);

      // Realiza la petición POST para obtener los residuos asociados al reporte
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-residues-per-report/`,
        { reportId }
      );

      setResiduesPerReport(response.data);
      console.log("Residuos por reporte:", response.data);

      // Verifica que la respuesta sea un arreglo y contenga al menos un elemento
      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.error("Datos de respuesta inválidos o vacíos:", response.data);
        return;
      }

      // Se utiliza directamente la respuesta para actualizar el estado,
      // ya que setResidueReportInfo es asíncrono, evitamos depender del estado actualizado.
      const residuesData = response.data;
      //const responseResiduesData = responseResidues.data;
      // Determina el valor de 'verified' para el primer elemento:
      // si el status es exactamente false, verified será false; de lo contrario, true.
      const statusValue = residuesData[0].status;
      const isVerified = statusValue === "VERIFICADO" ? true : false;

      // Actualiza el primer objeto del arreglo con la propiedad 'verified'
      const updatedResidues = residuesData.map((residue, index) => {
        if (index === 0) {
          return { ...residue, verified: isVerified };
        }
        return residue;
      });

      // Actualiza los estados correspondientes con los datos obtenidos
      setResidueReportInfo(updatedResidues);
      setStatusResidue(residuesData[0].status);

      // Actualiza el reporte seleccionado y abre el modal
      setSelectedReport(report);
      setOpenResiduoModal(true);
    } catch (error) {
      // Captura y registra cualquier error que ocurra durante la ejecución
      console.error("Error en handleOpenResiduoModal:", error);
    }
  };

  const handleCloseResiduoModal = () => {
    setOpenResiduoModal(false);
    setSelectedReport(null);
  };

  const handleEditSubmit = () => {
    // setResidueReportInfo((prev) => {
    //   const newResidues = [...prev];
    //   newResidues[selectedResiduoIndex] = {
    //     ...newResidues[selectedResiduoIndex],
    //     residue: editedResidueName,
    //     peso: editedPeso,
    //     volumen: editedVolumen,
    //   };
    //   return newResidues;
    // });
    // setOpenEditModal(false);

    // Petición HTTP para actualizar los datos del residuo
    const jsonRequest = [
      {
        residue_id: residueReportInfo[selectedResiduoIndex].id_report_residue,
        checker_username: request.conductor_asignado,
        status: "REPORTADO",
        comments: "Residuo reportado por el recolector",
        new_weight: editedPeso,
        new_m3: editedVolumen,
        measurement_comments: "Mediciones actualizadas por el recolector",
      },
    ];

    console.log(jsonRequest);

    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/checker-verified-report/`,
        jsonRequest
      )
      .then((response) => {
        console.log("Residuo actualizado:", response.data);

        // Actualiza el estado del residuo verificado
        setResidueReportInfo((prev) => {
          const newResidues = [...prev];
          newResidues[selectedResiduoIndex] = {
            ...newResidues[selectedResiduoIndex],
            verified: false,
          };
          return newResidues;
        });
      })
      .catch((error) => {
        console.error(error);
      });
    setOpenEditModal(false);
  };

  const handleOpenEditModal = () => {
    setOpenConfirmModal(false);
    const residuo = residueReportInfo[selectedResiduoIndex];
    setEditedResidueName(residuo.residue);
    setEditedPeso(residuo.peso);
    setEditedVolumen(residuo.volumen);
    setOpenEditModal(true);
  };

  console.log("residueReportInfo", residueReportInfo);

  return (
    <Box padding={4}>
      {/* Sección superior con la información existente */}
      <Box
        display="flex"
        justifyContent="start"
        gap={10}
        flexWrap="nowrap"
        overflow="scroll"
      >
        <Box flexShrink={0}>
          <Typography variant="h6" gutterBottom>
            Información del Centro de Acopio
          </Typography>
          <Box paddingLeft={2}>
            <Box>
              <Typography
                variant="subtitle1"
                color="secondary"
                display="inline"
                fontWeight={500}
                gutterBottom
              >
                Nombre Centro:{" "}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.reportes[0].centro_recoleccion}{" "}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                color="secondary"
                display="inline"
                fontWeight={500}
                gutterBottom
              >
                Teléfono: {request.reportes[0].telefono_centro_recoleccion}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                color="secondary"
                display="inline"
                fontWeight={500}
                gutterBottom
              >
                Direccion :{" "}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.reportes[0].direccion_centro_recoleccion}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                color="secondary"
                display="inline"
                fontWeight={500}
                gutterBottom
              >
                Grupo: {"Acopio "}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />

        <Box flexShrink={0}>
          <Typography variant="h6" gutterBottom>
            Residuos de la Orden
          </Typography>

          {/* ---------- Datos generales de la orden -------------------------------- */}
          <Box pl={2}>
            {/* Centro de recolección */}
            <Box>
              <Typography
                variant="subtitle1"
                display="inline"
                color="secondary"
                fontWeight={500}
                gutterBottom
              >
                Centro Recolección:&nbsp;
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.reportes[0]?.centro_recoleccion ?? "—"}
              </Typography>
            </Box>

            

            {/* Totales de la orden */}
            <Box mt={1}>
              <Typography
                variant="subtitle1"
                display="inline"
                color="secondary"
                fontWeight={500}
                gutterBottom
              >
                Peso total:&nbsp;
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.kg_total} kg
              </Typography>

              <Typography
                variant="subtitle1"
                display="inline"
                color="secondary"
                fontWeight={500}
                sx={{ ml: 2 }}
                gutterBottom
              >
                Volumen total:&nbsp;
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.m3_total} m³
              </Typography>
            </Box>
          </Box>

          {/* ---------- Lista de residuos individuales ----------------------------- */}
          <Box pl={2} mt={2}>
            {request.residuos && request.residuos.length > 0 ? (
              request.residuos.map((r, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  mb={0.5}
                >
                  <Typography
                    variant="subtitle1"
                    display="inline"
                    color="secondary"
                    fontWeight={500}
                  >
                    {r.residuo}:
                  </Typography>
                  <Typography variant="body2" display="inline" sx={{ ml: 1 }}>
                    {r.kg} kg
                  </Typography>
                  <Typography variant="body2" display="inline" sx={{ ml: 1 }}>
                    {r.m3} m³
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">
                No hay residuos registrados.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Separador entre secciones */}
      <Divider sx={{ marginY: 2 }} />

      {/* Modal para mostrar los residuos del reporte */}
      <Dialog
        open={openResiduoModal}
        onClose={handleCloseResiduoModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Residuos del Reporte</DialogTitle>
        <DialogContent dividers>
          {residueReportInfo && residueReportInfo.length > 0 ? (
            residueReportInfo.map((residuo, index) => {
              let displayText = "No verificado";
              let displayColor = "error.main";

              // Mapeo según el status
              switch (residuo.status) {
                case "VERIFICADO":
                  displayText = "Verificado";
                  displayColor = "success.main";
                  break;
                case "REPORTADO":
                  displayText = "Reportado";
                  displayColor = "warning.main"; // o el color que prefieras
                  break;
                default:
                  displayText = "No verificado";
                  displayColor = "error.main";
              }

              return (
                <Box
                  key={index}
                  marginBottom={1}
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Typography
                    variant="subtitle1"
                    display="inline"
                    color="secondary"
                    fontWeight={500}
                  >
                    Nombre:{" "}
                  </Typography>
                  <Typography variant="body1" display="inline">
                    {residuo.residue}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    display="inline"
                    color="secondary"
                    fontWeight={500}
                    sx={{ marginLeft: 2 }}
                  >
                    Cantidad:{" "}
                  </Typography>
                  <Typography variant="body1" display="inline">
                    {residuo.peso} Kg
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    display="inline"
                    color="secondary"
                    fontWeight={500}
                    sx={{ marginLeft: 2 }}
                  >
                    Volumen:{" "}
                  </Typography>
                  <Typography variant="body1" display="inline">
                    {residuo.volumen}
                  </Typography>

                  {/* Botón para verificar el residuo */}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ marginLeft: 2 }}
                    onClick={() => handleOpenConfirmModal(index)}
                  >
                    Verificar
                  </Button>

                  {/* Mostrar el estado en función del status */}
                  <Typography
                    variant="body2"
                    color={displayColor}
                    sx={{ marginLeft: 1 }}
                  >
                    {displayText}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography variant="body1">
              No hay residuos para este reporte.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResiduoModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para verificar el residuo */}
      <Dialog
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      >
        <DialogTitle>Verificar Residuo</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">¿El residuo está correcto?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmCorrect} color="primary">
            Sí, es correcto
          </Button>
          <Button onClick={handleOpenEditModal} color="secondary">
            No, editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edición para actualizar los datos del residuo */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Residuo</DialogTitle>
        <DialogContent dividers>
          {/* Select para escoger el residuo a partir de la data obtenida */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Nombre del Residuo</InputLabel>
            <Select
              value={editedResidueName}
              onChange={(e) => setEditedResidueName(e.target.value)}
              label="Nombre del Residuo"
            >
              {residues.map((item, index) => (
                <MenuItem key={index} value={item.nombre}>
                  {item.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            label="Cantidad (Kg)"
            type="number"
            value={editedPeso}
            onChange={(e) => {
              // Convertimos a número
              const valor = parseFloat(e.target.value);

              // Permitir vaciar el campo
              if (e.target.value === "") {
                setEditedPeso("");
                return;
              }

              // Validar rango
              if (!isNaN(valor) && valor >= 0 && valor <= 1000) {
                setEditedPeso(e.target.value);
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            inputProps={{
              min: 0,
              max: 1000,
              step: 0.001,
            }}
          />

          {/* Volumen en m³ */}
          <TextField
            fullWidth
            margin="dense"
            label="Volumen (m³)"
            type="number"
            value={editedVolumen}
            onChange={(e) => {
              const valor = parseFloat(e.target.value);

              if (e.target.value === "") {
                setEditedVolumen("");
                return;
              }

              if (!isNaN(valor) && valor >= 0 && valor <= 1000) {
                setEditedVolumen(e.target.value);
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">m³</InputAdornment>,
            }}
            inputProps={{
              min: 0,
              max: 1000,
              step: 0.001, // o el nivel de precisión que desees
            }}
          />
        </DialogContent>
        <DialogActions>
          {/* handleEditSubmit hará la petición HTTP para guardar cambios */}
          <Button onClick={handleEditSubmit} color="primary">
            Guardar
          </Button>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
