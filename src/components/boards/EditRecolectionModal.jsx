import { createPortal } from "react-dom";
import Title from "../Title";
import {
  Modal,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  FormControlLabel,
  FormGroup,
  TextField,
  FormLabel,
  Typography,
  Radio,
  RadioGroup,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import ConfirmationModal from "../modals/ConfirmationModal";
import { Close, Cookie } from "@mui/icons-material";
import cancelationReassonText from "../../helpers/cancelationReassonText";
import { set } from "date-fns";
import generateDonorTalonPDF from "../../services/DonorTalonReportPDF";
import getReportInfo from "../../services/getReportInfo";
import generateQR from "../../services/generateQR";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function EditRecolectionModal({
  open,
  setOpen,
  recolection,
  setMessage,
  setOpenMessageModal,
  update,
  setUpdate,
}) {
  const [isDateCorrect, setIsDateCorrect] = useState(false);
  const [status, setStatus] = useState("");
  const [conductores, setConductores] = useState([]);
  const [conductorAsignado, setConductorAsignado] = useState();
  const [Date, setDate] = useState(null);
  const userData = useAuth();
  const [value, setValue] = useState("");
  const [otroTexto, setOtroTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  useEffect(() => {
    //console.log(userData);
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-drivers/`)
      .then((response) => {
        //console.log(response.data);
        setConductores(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (recolection === null) return;
    switch (recolection?.status) {
      case null:
        setStatus("");
      case "solicitada":
        setStatus("solicitada");
        break;
      case "pendienteRecoleccion":
        if (userData?.groups[0] === "Conductor") {
          setStatus("");
        } else {
          setStatus("pendienteRecoleccion");
          setDate(
            recolection.fecha_estimada_recoleccion
              ? dayjs(recolection.fecha_estimada_recoleccion)
              : null
          );
          setConductorAsignado(recolection.conductor_asignado);
        }
        break;
      case "recolectada":
        setStatus("recolectado");
        break;
      case "entregadaCentro":
        setStatus("entregado");
        break;
      case "cancelada":
        setStatus("cancelado");
        break;
      default:
        setStatus(recolection.status);
        break;
    }

    if (
      cancelationReassonText(recolection.comment_cancelation) ===
      "Consulte comentarios de cancelación"
    ) {
      setValue("otro");
      setOtroTexto(recolection.comment_cancelation);
    } else {
      setValue(recolection.comment_cancelation);
    }
  }, [recolection, open]);
  const handleSubmit = async (e) => {
    if (status === "pendienteRecoleccion") {
      if (!isDateCorrect) return;
      const reformattedDate = e.target.date.value
        .split("/")
        .reverse()
        .join("-");
      const data = {
        user: recolection.donador,
        id_order: recolection.id,
        fecha_estimada_recoleccion: reformattedDate,
        conductor: conductorAsignado,
      };
      console.log(data);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/change-recollection-pendiente/`,
          data
        )
        .then((response) => {
          console.log(response);
          setMessage(
            "Se ha actualizado la fecha de recolección y el estado de la solicitud"
          );
          setOpenMessageModal(true);
          setUpdate(!update);
          setOpen(false);
        })
        .catch((error) => {
          console.error(error);
          setMessage(
            "Ha ocurrido un error al actualizar la fecha de recolección"
          );
          setOpenMessageModal(true);
        });
    } else if (status === "recolectado") {
      console.log("########### Cambiando a recolectado ############");
      const data = {
        user: recolection.donador,
        id_order: recolection.id,
      };

      try {
        const changeStatusResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/change-recollection-recolectada/`,
          data
        );
        console.log(
          "######### respuesta del cambio de status a recolectado #########"
        );
        console.log(changeStatusResponse);

        const reportInfo = await getReportInfo(
          changeStatusResponse.data.reportId
        );
        const qrImage = await generateQR(
          "https://rewards.rennueva.com/tracking-external/" +
            changeStatusResponse.data.reportFolio // Aquí deberías poner la URL correcta para el reporte
        );
        console.log("######### QR image #########");
        console.log(qrImage);
        const reportObject = { id_report: changeStatusResponse.data.reportId };
        console.log("######### object report ##############");
        console.log(reportObject);

        await generateDonorTalonPDF(reportObject, reportInfo, qrImage);

        setMessage("Se ha actualizado el estado de la recolección");
        setOpenMessageModal(true);
        setUpdate(!update);
        setOpen(false);
      } catch (error) {
        setMessage("Ha ocurrido un error al actualizar la recolección");
        setOpenMessageModal(true);
      }
    } else if (status === "entregado") {
      const data = {
        user: recolection.donador,
        id_order: recolection.id,
      };
      console.log(data);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/change-recollection-entregada-centro/`,
          data
        )
        .then((response) => {
          console.log(response);
          setMessage("Se ha actualizado el estado de la recolección");
          setOpenMessageModal(true);
          setUpdate(!update);
          setOpen(false);
        })
        .catch((error) => {
          console.error(error);
          setMessage("Ha ocurrido un error al actualizar la recolección");
          setOpenMessageModal(true);
        });
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value);
    if (event.target.value !== "otro") {
      setOtroTexto(""); // Limpiar el texto si "Otro" no está seleccionado
    }
  };

  const handleTextChange = (event) => {
    console.log(event.target.value);
    setOtroTexto(event.target.value);
  };
  return createPortal(
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 2, top: 2 }}
          >
            <Close />
          </IconButton>
          <Title>Editar Recolección</Title>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit(e);
            }}
          >
            <FormControl fullWidth margin="dense">
              <InputLabel id="select-status-label">Estado</InputLabel>
              <Select
                labelId="select-status-label"
                id="select-status"
                value={status}
                label="Estado"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                {/* Mostrar las opciones según el valor actual de `status` */}
                {status === "solicitado" ||
                status === "pendienteRecoleccion" ? (
                  <MenuItem value="pendienteRecoleccion">
                    Recolección pendiente
                  </MenuItem>
                ) : null}
                {status === "solicitado" ||
                status === "pendienteRecoleccion" ||
                status === "recolectado" ? (
                  <MenuItem value="recolectado">Recolectada</MenuItem>
                ) : null}
                {status === "recolectado" ||
                status === "pendienteRecoleccion" ? (
                  <MenuItem value="entregado">Entregado</MenuItem>
                ) : null}
                {status === "solicitado" ||
                status === "pendienteRecoleccion" ? (
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                ) : null}
              </Select>
            </FormControl>

            {status === "cancelado" && (
              <FormControl component="fieldset" fullWidth margin="dense">
                <FormLabel component="legend">Motivo de cancelación</FormLabel>
                <FormGroup>
                  <RadioGroup
                    name="cancelation-reason"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="noDisponible"
                      control={<Radio />}
                      label="La persona no se encuentra disponible"
                    />
                    <FormControlLabel
                      value="bajaBateria"
                      control={<Radio />}
                      label="Batería baja en camioneta"
                    />
                    <FormControlLabel
                      value="faltaEspacio"
                      control={<Radio />}
                      label="Falta de espacio en camioneta"
                    />
                    <FormControlLabel
                      value="activoEspontaneo"
                      control={<Radio />}
                      label="Actividad espontánea"
                    />
                    <FormControlLabel
                      value="otro"
                      control={<Radio />}
                      label="Otro"
                    />
                  </RadioGroup>
                  {value === "otro" && (
                    <TextField
                      fullWidth
                      margin="dense"
                      label="Especifique otro motivo"
                      variant="outlined"
                      value={otroTexto}
                      onChange={handleTextChange}
                    />
                  )}
                </FormGroup>
              </FormControl>
            )}

            {status === "pendienteRecoleccion" &&
              userData?.groups[0] !== "Conductor" && (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      onChange={(newDate) => {
                        setDate(newDate);
                      }}
                      value={Date}
                      disablePast
                      format="DD/MM/YYYY"
                      onAccept={(date) => {
                        setIsDateCorrect(true);
                      }}
                      onError={(reason, value) => {
                        if (reason === null) {
                          setIsDateCorrect(true);
                        } else {
                          setIsDateCorrect(false);
                        }
                      }}
                      slotProps={{
                        field: {
                          margin: "normal",
                          fullWidth: true,
                          required: true,
                          name: "date",
                        },
                        textField: {
                          label: "Fecha de recolección",
                          name: "date",
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <FormControl fullWidth margin="normal">
                    <InputLabel id="select-status-label">
                      Conductor Asignado
                    </InputLabel>
                    <Select
                      labelId="select-status-label"
                      id="select-status"
                      value={conductorAsignado}
                      label="Conductor Asignado"
                      onChange={(e) => {
                        //console.log(e.target.value);
                        setConductorAsignado(e.target.value);
                      }}
                      fullWidth
                      required
                    >
                      {conductores.map((conductor) => (
                        <MenuItem key={conductor.id} value={conductor.user}>
                          {conductor.first_name} {conductor.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

            {status === "pendienteRecoleccion" ? (
              <Button
                fullWidth
                color="success"
                variant="contained"
                type="submit"
                disabled={!isDateCorrect || status === ""}
              >
                Guardar cambios
              </Button>
            ) : status === "cancelado" ? (
              <Button
                fullWidth
                color="error"
                variant="contained"
                type="submit"
                disabled={loading}
                onClick={() => {
                  if (userData?.groups[0] === "Conductor") {
                    console.log(
                      "No tienes permisos para cancelar la recolección"
                    );
                    setOpenConfirmation(true);
                    //setOpen(false)
                  } else {
                    setLoading(true);
                    const data = {
                      user: recolection.donador,
                      id_order: recolection.id,
                      comment_cancelation: value === "otro" ? otroTexto : value,
                    };
                    //console.log(data);
                    axios
                      .post(
                        `${process.env.REACT_APP_API_URL}/cancel-donor-recollection/`,
                        data
                      )
                      .then((response) => {
                        console.log(response);
                        setMessage("Se ha cancelado la recolección");
                        setOpenMessageModal(true);
                        setUpdate(!update);
                        setOpen(false);
                      })
                      .catch((error) => {
                        console.error(error);
                        setMessage(
                          "Ha ocurrido un error al cancelar la recolección"
                        );
                        setOpenMessageModal(true);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }
                }}
              >
                {!loading ? "Cancelar recolección" : "Cargando..."}
              </Button>
            ) : (
              <Button
                fullWidth
                color="success"
                variant="contained"
                type="submit"
                disabled={status === ""}
              >
                Guardar cambios
              </Button>
            )}

            {status === "cancelado" && value === "otro" && otroTexto === "" && (
              <p style={{ color: "red" }}>
                Especifique el motivo de cancelación
              </p>
            )}
          </form>
        </Box>
      </Modal>
      <ConfirmationModal
        title="Confirmar acción"
        isOpen={openConfirmation}
        setOpen={setOpenConfirmation}
        severity="error"
        onConfirm={async () => {
          setLoading(true);
          const data = {
            user: recolection.donador,
            id_order: recolection.id,
            comment_cancelation: value === "otro" ? otroTexto : value,
          };
          axios
            .post(
              `${process.env.REACT_APP_API_URL}/cancel-donor-recollection/`,
              data
            )
            .then((response) => {
              console.log(response);
              setMessage("Se ha cancelado la recolección");
              setOpenMessageModal(true);
              setUpdate(!update);
              setOpen(false);
            })
            .catch((error) => {
              console.error(error);
              setMessage("Ha ocurrido un error al cancelar la recolección");
              setOpenMessageModal(true);
            })
            .finally(() => {
              setLoading(false);
              setOpenConfirmation(false);
            });
        }}
        onCancel={async () => {
          setOpenConfirmation(false);
        }}
        loading={loading}
      >
        <Typography variant="body1">
          ¿Está seguro de cancelar esta solicitud de recolección?. Esta acción
          no se puede deshacer.
        </Typography>
      </ConfirmationModal>
    </>,
    document.getElementById("modal")
  );
}
