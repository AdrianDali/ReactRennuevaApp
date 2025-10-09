import { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  TextField,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import { TodoContext } from "../context/index.js";
import { PersistentAlert } from "../components/alerts/PersistentAlert.jsx";

function ModalWeightVolumeReport({ report }) {
  const {
    openModalWeightVolumeReport,
    setOpenModalWeightVolumeReport,
    setUpdateReportInfo,
    setUpdStatusResiduesGeneric,
} = useContext(TodoContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [peso, setPeso] = useState("");
  const [volumen, setVolumen] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");


  const closeModal = () => {
    setUpdateReportInfo(prev => !prev);
    setOpenModalWeightVolumeReport(false);
  };

  useEffect(() => {
    // Cargar valores existentes si hay
    axios
      .post(`${process.env.REACT_APP_API_URL}/get-weight-m3-order/`, { orderId: report.id })
      .then(res => {
        const data = res.data;
        if (data) {
          setPeso(data.totalWeight || "");
          setVolumen(data.totalM3 || "");
        }
      })
      .catch(err => console.error(err));
  }, [report]);

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      user: report.nombre,
      recollectionId: report.id,
      totalWeight: parseFloat(peso),
      totalM3: parseFloat(volumen),
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/update-recollection-total-weight-m3/`,
        payload
      )
      .then(() => {
        setAlertType("success");
        setAlertMessage("Datos guardados correctamente.");
        setAlertOpen(true);
        // Actualizar la lista de residuos genéricos
        setUpdStatusResiduesGeneric(true)
        setTimeout(() => {
          setAlertOpen(false);
          closeModal();
        }, 1000);
      })
      .catch(error => {
        console.error(error);
        setAlertType("error");
        setAlertMessage("Error al guardar datos.");
        setAlertOpen(true);
      });
  };

  return ReactDOM.createPortal(
    <>
      <PersistentAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
      <Dialog
        open={openModalWeightVolumeReport}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: isMobile ? 3 : 4,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: isMobile ? 2 : 3,
            py: isMobile ? 1 : 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6">Peso y Volumen</Typography>
          <IconButton edge="end" color="inherit" onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ px: isMobile ? 2 : 3, pt: 2, pb: 2 }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Peso (kg)"
                    variant="outlined"
                    type="number"
                    value={peso}
                    onChange={e => setPeso(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      inputProps: { min: 0, max: 1000, step: 0.001 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Volumen (m³)"
                    variant="outlined"
                    type="number"
                    value={volumen}
                    onChange={e => setVolumen(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">m³</InputAdornment>,
                      inputProps: { min: 0, max: 1000, step: 0.001 },
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                fullWidth={isMobile}
                sx={{ mt: 2 }}
              >
                Guardar
              </Button>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>,
    document.getElementById("modal-root") || document.body
  );
}

export { ModalWeightVolumeReport };
