import { Box, Typography, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

import { format } from "date-fns";
import { da } from "date-fns/locale";
import axios from "axios";

export default function ReportInfoRecycling({ request }) {
  const [residueReportInfo, setResidueReportInfo] = useState([]);

  console.log("request", request);

  const [openResiduoModal, setOpenResiduoModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

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
  
    // Abre el modal de confirmación para el residuo seleccionado.
    const handleOpenConfirmModal = (index) => {
      setSelectedResiduoIndex(index);
      setOpenConfirmModal(true);
    };
  
    // Si el usuario confirma que el residuo es correcto, se marca como verificado.
    const handleConfirmCorrect = () => {
      // llamado https a la API para marcar el residuo como verificado
      axios.post( `${process.env.REACT_APP_SERVER_URL}/Rennueva/driver-collected-status-residue/` , {
        residueId: residueReportInfo[selectedResiduoIndex].id_report_residue,
        status : "VERIFICADO",
      })
      .then((response) => {
        console.log("Residuo verificado:", response.data);
      
        // Actualiza el estado del residuo verificado
        setResidueReportInfo((prev) => {
          const newResidues = [...prev];
          newResidues[selectedResiduoIndex] = {
            ...newResidues[selectedResiduoIndex],
            verified: true,
          };
          return newResidues;
        });

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
    const reportId = parseInt(report.folio.split('-').pop(), 10);
    
    // Realiza la petición POST para obtener los residuos asociados al reporte
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-residues-per-report/`,
      { reportId }
    );
    
    console.log("Órdenes asignadas:", response.data);
    
    // Verifica que la respuesta sea un arreglo y contenga al menos un elemento
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.error("Datos de respuesta inválidos o vacíos:", response.data);
      return;
    }
    
    // Se utiliza directamente la respuesta para actualizar el estado,
    // ya que setResidueReportInfo es asíncrono, evitamos depender del estado actualizado.
    const residuesData = response.data;
    
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
    setResidueReportInfo((prev) => {
      const newResidues = [...prev];
      newResidues[selectedResiduoIndex] = {
        ...newResidues[selectedResiduoIndex],
        residue: editedResidueName,
        peso: editedPeso,
        volumen: editedVolumen,
      };
      return newResidues;
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
            Información del Reporte
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
                Nombre completo: {request.nombre_donador}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.nombre_donador}{" "}
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
                Teléfono: {request.telefono}
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
                Correo electrónico: {request.correo_donador}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.nombre_usuario}
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
            Recolección
          </Typography>
          <Box paddingLeft={2}>
            <Box>
              <Typography
                variant="subtitle1"
                display="inline"
                color="secondary"
                fontWeight={500}
                gutterBottom
              >
                Centro Recolección:
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.nombre_centro}
              </Typography>
            </Box>
            {/* <Box>
              <Typography
                variant="subtitle1"
                display="inline"
                color="secondary"
                fontWeight={500}
                gutterBottom
              >
                Fecha Inicio:
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.fecha_inicio_reporte
                  ? format(
                      new Date(request.fecha_inicio_reporte),
                      "dd/MM/yyyy HH:mm:ss"
                    )
                  : "No cuenta con fecha de inicio"}
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </Box>

      {/* Separador entre secciones */}
      <Divider sx={{ marginY: 2 }} />

      {/* Sección de reportes asociados */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Reportes Asociados
        </Typography>
        {request.reports && request.reports.length > 0 ? (
          request.reports.map((report, index) => (
            <Box
              key={index}
              marginBottom={1}
              display="flex"
              alignItems="center"
            >
              <Typography
                variant="subtitle1"
                display="inline"
                fontWeight={500}
                color="secondary"
              >
                Folio:{" "}
              </Typography>
              <Typography variant="body1" display="inline">
                {report.folio}
              </Typography>
              <Typography
                variant="subtitle1"
                display="inline"
                fontWeight={500}
                color="secondary"
                sx={{ marginLeft: 2 }}
              >
                Estado:{" "}
              </Typography>
              <Typography variant="body1" display="inline">
                {report.estado_reporte}
              </Typography>
              {/* Botón para abrir modal de residuos */}
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ marginLeft: 2 }}
                onClick={() => handleOpenResiduoModal(report)}
              >
                Ver Residuos
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No hay reportes asociados.</Typography>
        )}
      </Box>

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
            residueReportInfo.map((residuo, index) => (
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
                {residuo && (
                  <Typography
                  variant="body2"
                  color={residuo.verified ? "success.main" : "error.main"}
                  sx={{ marginLeft: 1 }}
                >
                  {residuo.verified ? "Verificado" : "No verificado"}
                </Typography>
                
                ) }

              </Box>
            ))
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
          <Typography variant="body1">
            ¿El residuo está correcto?
          </Typography>
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
          <TextField
            fullWidth
            margin="dense"
            label="Nombre del Residuo"
            value={editedResidueName}
            onChange={(e) => setEditedResidueName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Cantidad (Kg)"
            value={editedPeso}
            onChange={(e) => setEditedPeso(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Volumen"
            value={editedVolumen}
            onChange={(e) => setEditedVolumen(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
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
