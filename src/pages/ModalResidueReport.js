import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import {
  Modal,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Typography,
  InputAdornment
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { TodoContext } from '../context/index.js';

function ModalResidueReport({ report }) {
  const [residues, setResidues] = useState([]);
  const [entries, setEntries] = useState([{
    user: report.nombre_usuario,
    report: report.id_report,
    residue: '',
    peso: '',
    volumen: ''
  }]);
  const [botonAdd, setBotonAdd] = useState(false);

  const {
    openModalEditResidueReport,
    setOpenModalEditResidueReport,
    setUpdateReportInfo
  } = useContext(TodoContext);

  const closeModal = () => {
    setUpdateReportInfo(prev => !prev);
    setOpenModalEditResidueReport(false);
  };

  useEffect(() => {
    const getResidues = {
      reportId: report.id_report ? report.id_report : report.id
    };

    // 1. Obtener todos los residuos
    axios.get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
      .then(response => {
        console.log("Todos los residuos:", response.data);
        setResidues(response.data);
      })
      .catch(error => {
        console.error('Hubo un problema al obtener los residuos:', error);
      });

    // 2. Obtener todos los residuos de este reporte (si existe reportId)
    if (getResidues.reportId !== undefined && getResidues.reportId !== null && getResidues.reportId !== '') {
      axios.post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, getResidues)
        .then(response => {
          const data = response.data;
          console.log("Todos los residuos del reporte:", data);
          setEntries(data);
          if (data.length < 1) {
            setBotonAdd(true);
          }
        })
        .catch(error => {
          console.error('Hubo un problema al obtener los residuos:', error);
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
        residue: '',
        peso: '',
        volumen: ''
      }
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
    axios.post(`${process.env.REACT_APP_API_URL}/create-report-residue-user/`, entries)
      .then(response => {
        e.target.reset();
        closeModal();
      })
      .catch(error => {
        console.error(error);
      });
  };

  return ReactDOM.createPortal(
    <Modal
      open={openModalEditResidueReport}
      onClose={closeModal}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: 700 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}
      >
        <IconButton
          onClick={closeModal}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
        <Typography variant="h6" component="h2" mb={2}>
          Reporte de Residuos
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {entries.map((entry, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                alignItems="center"
              >
                {/* Campo Select para el Residuo */}
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel>Residuo</InputLabel>
                  <Select
                    name="residue"
                    value={entry.residue}
                    onChange={event => handleInputChange(index, event)}
                  >
                    {residues.map((residue, idx) => (
                      <MenuItem key={idx} value={residue.nombre}>
                        {residue.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Campo de texto para el Peso con adornment y validación 0-1000 */}
                <TextField
                  sx={{ m: 1, flexBasis: { xs: '100%', md: '25%' } }}
                  name="peso"
                  label="Peso en kg"
                  variant="outlined"
                  type="number"
                  value={entry.peso}
                  onChange={(event) => {
                    const valor = parseInt(event.target.value, 10);
                    // Validar que esté dentro del rango
                    if (valor >= 0 && valor <= 1000) {
                      handleInputChange(index, event);
                    } else if (!event.target.value) {
                      // Permitir vaciar el campo
                      handleInputChange(index, event);
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  inputProps={{
                    min: 0,
                    max: 1000,
                    step: 1
                  }}
                />

                {/* Campo de texto para el Volumen con adornment y validación 0-1000 */}
                <TextField
                  sx={{ m: 1, flexBasis: { xs: '100%', md: '25%' } }}
                  name="volumen"
                  label="Volumen en m³"
                  variant="outlined"
                  type="number"
                  value={entry.volumen}
                  onChange={(event) => {
                    const valor = parseInt(event.target.value, 10);
                    // Validar que esté dentro del rango
                    if (valor >= 0 && valor <= 1000) {
                      handleInputChange(index, event);
                    } else if (!event.target.value) {
                      // Permitir vaciar el campo
                      handleInputChange(index, event);
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m³</InputAdornment>,
                  }}
                  inputProps={{
                    min: 0,
                    max: 1000,
                    step: 1
                  }}
                />

                {/* Botón para eliminar la fila */}
                <IconButton onClick={() => handleRemoveFields(index)} sx={{ m: 1 }}>
                  <RemoveCircleOutlineIcon />
                </IconButton>

                {/* Botón para agregar otra fila */}
                <IconButton onClick={handleAddFields} sx={{ m: 1 }}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
            ))}

            {!botonAdd && (
              <Button type="submit" variant="contained" fullWidth>
                Enviar
              </Button>
            )}
          </Stack>
        </form>

        {botonAdd && (
          <Button
            type='button'
            variant="contained"
            fullWidth
            onClick={handleAddFirstFields}
          >
            Agregar Residuo
          </Button>
        )}
      </Box>
    </Modal>,
    document.getElementById('modal')
  );
}

export { ModalResidueReport };
