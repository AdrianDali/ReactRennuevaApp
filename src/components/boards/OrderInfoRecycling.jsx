import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  useMediaQuery,
  Slide,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Home as HomeIcon,
  Phone as PhoneIcon,
  Group as GroupIcon,
  Inbox as ResidueIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReportInfoRecycling({ request }) {
  console.log("request", request);
  
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [residueReportInfo, setResidueReportInfo] = useState([]);
  const [residues, setResidues] = useState([]);
  const [openResiduoModal, setOpenResiduoModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedResiduoIndex, setSelectedResiduoIndex] = useState(null);
  const [editedResidueName, setEditedResidueName] = useState("");
  const [editedPeso, setEditedPeso] = useState("");
  const [editedVolumen, setEditedVolumen] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-residue/`)
      .then(({ data }) => setResidues(data))
      .catch(console.error);
  }, []);

  const handleOpenResiduoModal = async (report) => {
    try {
      const reportId = parseInt(report.folio.split("-").pop(), 10);
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-residues-per-report/`,
        { reportId }
      );
      const statusValue = data[0]?.status;
      const updated = data.map((r, i) =>
        i === 0 ? { ...r, verified: statusValue === "VERIFICADO" } : r
      );
      setResidueReportInfo(updated);
      setOpenResiduoModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenConfirmModal = (index) => {
    setSelectedResiduoIndex(index);
    setOpenConfirmModal(true);
  };

  const handleConfirmCorrect = () => {
    const idx = selectedResiduoIndex;
    const payload = {
      residue_name: "editedResidueName",
      residueId: request.id,
      status: "VERIFICADO",
    };
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/driver-collected-status-residue/`,
        payload
      )
      .then(() => {
        setResidueReportInfo((prev) =>
          prev.map((r, i) =>
            i === idx ? { ...r, verified: true, status: "VERIFICADO" } : r
          )
        );
      })
      .catch(console.error);
    setOpenConfirmModal(false);
  };

  const handleOpenEditModal = () => {
    const residuo = residueReportInfo[selectedResiduoIndex];
    setEditedResidueName(residuo.residue);
    setEditedPeso(residuo.peso);
    setEditedVolumen(residuo.volumen);
    setOpenEditModal(true);
    setOpenConfirmModal(false);
  };

  const handleEditSubmit = () => {
    const idx = selectedResiduoIndex;
    const jsonRequest = [
      {
        residue_id: residueReportInfo[idx].id_report_residue,
        checker_username: request.conductor_asignado,
        status: "REPORTADO",
        comments: "Residuo reportado por el recolector",
        new_weight: editedPeso,
        new_m3: editedVolumen,
        measurement_comments: "Mediciones actualizadas por el recolector",
      },
    ];
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/Rennueva/checker-verified-report/`,
        jsonRequest
      )
      .then(() => {
        setResidueReportInfo((prev) =>
          prev.map((r, i) =>
            i === idx ? { ...r, verified: false, status: "REPORTADO" } : r
          )
        );
      })
      .catch(console.error);
    setOpenEditModal(false);
  };

  return (
    <Card elevation={3} sx={{ mt: 2, borderRadius: 2 }}>
      <CardHeader
        avatar={<InfoIcon color="primary" />}
        title={
          <Typography variant={isSm ? "h6" : "h5"}>
            Información del Centro de Acopio
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={isSm ? 1 : 3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={500}>
                  Nombre Centro:
                </Typography>
                <Typography variant="body1">
                  {request.reportes[0].centro_recoleccion}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={500}>
                  Teléfono:
                </Typography>
                <Typography variant="body1">
                  {request.reportes[0].telefono_centro_recoleccion}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <HomeIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={500}>
                  Dirección:
                </Typography>
                <Typography variant="body1">
                  {request.reportes[0].direccion_centro_recoleccion}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon color="secondary" />
                <Typography variant="subtitle1" fontWeight={500}>
                  Grupo:
                </Typography>
                <Typography variant="body1">Acopio</Typography>
              </Stack>
            </Stack>
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom>
              Residuos de la Orden
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
              <Chip
                label={`${request.kg_total} kg`}
                icon={<CheckIcon />}
                color="success"
              />
              <Chip
                label={`${request.m3_total} m³`}
                icon={<CheckIcon />}
                color="primary"
              />
            </Stack>

            <Stack spacing={1}>
              {request.residuos && request.residuos.length > 0 ? (
                request.residuos.map((r, idx) => (
                  <Box
                    key={idx}
                    onClick={() => handleOpenResiduoModal(r)}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.light,
                          0.2
                        ),
                      },
                    }}
                  >
                    <ResidueIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      {r.residuo}:
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {r.kg} kg
                    </Typography>
                    <Typography variant="body2">{r.m3} m³</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">
                  No hay residuos registrados.
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      {/* Modal: Residuos del Reporte */}
      <Dialog
        open={openResiduoModal}
        onClose={() => setOpenResiduoModal(false)}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Transition}
      >
        <DialogTitle>Residuos del Reporte</DialogTitle>
        <DialogContent dividers>
          {residueReportInfo.map((res, idx) => {
            let color =
              res.status === "VERIFICADO"
                ? "success.main"
                : res.status === "REPORTADO"
                ? "warning.main"
                : "error.main";
            return (
              <Box
                key={idx}
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                mb={1}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ width: "25%" }}
                >
                  {res.residue}
                </Typography>
                <Typography variant="body2" sx={{ width: "20%" }}>
                  {res.peso} kg
                </Typography>
                <Typography variant="body2" sx={{ width: "20%" }}>
                  {res.volumen} m³
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CheckIcon />}
                  onClick={() => handleOpenConfirmModal(idx)}
                >
                  Verificar
                </Button>
                <Typography
                  variant="body2"
                  sx={{ ml: 1, color }}
                >
                  {res.status === "VERIFICADO"
                    ? "Verificado"
                    : res.status === "REPORTADO"
                    ? "Reportado"
                    : "No verificado"}
                </Typography>
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResiduoModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Confirmación */}
      <Dialog
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      >
        <DialogTitle>¿El residuo está correcto?</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmCorrect} startIcon={<CheckIcon />}>
            Sí
          </Button>
          <Button onClick={handleOpenEditModal} startIcon={<EditIcon />}>
            No, editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Edición */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Transition}
      >
        <DialogTitle>Editar Residuo</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="dense">
            <InputLabel>Nombre del Residuo</InputLabel>
            <Select
              value={editedResidueName}
              onChange={(e) => setEditedResidueName(e.target.value)}
              label="Nombre del Residuo"
            >
              {residues.map((item, i) => (
                <MenuItem key={i} value={item.nombre}>
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
            onChange={(e) => setEditedPeso(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            inputProps={{ min: 0, max: 1000, step: 0.001 }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Volumen (m³)"
            type="number"
            value={editedVolumen}
            onChange={(e) => setEditedVolumen(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">m³</InputAdornment>,
            }}
            inputProps={{ min: 0, max: 1000, step: 0.001 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSubmit}>Guardar</Button>
          <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
