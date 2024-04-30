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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FormControlLabel,
  FormGroup,
  Checkbox,
  TextField,
  FormLabel,
} from "@mui/material";
import { act } from "react";
import { Radio, RadioGroup } from "@mui/material";

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

  useEffect(() => {
    if (recolection != null) {
      setStatus(recolection.status);
    } else {
      setStatus("");
    }
  }, [recolection]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
    }
  };

  const [value, setValue] = useState("");
  const [otroTexto, setOtroTexto] = useState("");

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
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style}>
        <Button
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", right: 2, top: 2 }}
        >
          &times;
        </Button>
        <Title>Editar Recolección</Title>
        <form onSubmit={handleSubmit}>
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
              <MenuItem value="solicitado">Solicitada</MenuItem>
              <MenuItem value="pendienteRecoleccion">
                Recolección pendiente
              </MenuItem>
              <MenuItem value="recolectado">Recolectada</MenuItem>
              <MenuItem value="entregado">Entregado</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
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

          {status === "pendienteRecoleccion" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
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
                    margin: "dense",
                    fullWidth: "true",
                    required: "true",
                    name: "date",
                  },
                  textField: {
                    label: "Fecha de recolección",
                    name: "date",
                  },
                }}
              />
            </LocalizationProvider>
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
          ) : status === "cancelado"  ? (
            <Button
              fullWidth
              color="success"
              variant="contained"
              type="submit"
              onClick={() => {
                const data = {
                  user: recolection.donador,
                  id_order: recolection.id,
                  comment_cancelation: value === "otro" ? otroTexto : value,
                };
                console.log(data);
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
                  });
              }
                }

            >
              Cancelar recolección
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
          )
            }
           

          {status === "cancelado" && value === "otro" && otroTexto === "" && (
            <p style={{ color: "red" }}>Especifique el motivo de cancelación</p>
          )
            }

        </form>
      </Box>
    </Modal>,

    document.getElementById("modal")
  );
}
