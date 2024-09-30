import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Modal, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, IconButton, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { TodoContext } from '../context/index.js';
import { Close } from '@mui/icons-material';

export default function ModalWatchResidueReport({ report }) {
    const [residues, setResidues] = useState([]);
    const [entries, setEntries] = useState([{ user: report.nombre_usuario, report: report.id_report, residue: '', peso: '', volumen: '' }]);
    const { openModalEditResidueReport, setOpenModalEditResidueReport, setUpdateReportInfo } = useContext(TodoContext);

    const closeModal = () => {
        setUpdateReportInfo(prev => !prev);
        setOpenModalEditResidueReport(false);
    };

    useEffect(() => {
        const getResidues = { reportId: report.id_report? report.id_report : report.id };

        axios.get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
            .then(response => {
                setResidues(response.data);
            })
            .catch(error => {
                console.error('Hubo un problema al obtener los residuos:', error);
            });

        axios.post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, getResidues)
            .then(response => {
                const data = response.data;
                setEntries(data);

            })
            .catch(error => {
                console.error('Hubo un problema al obtener los residuos:', error);
            });
    }, [report]);

    const handleInputChange = (index, event) => {
        const values = [...entries];
        values[index][event.target.name] = event.target.value;
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
        <Modal open={openModalEditResidueReport} onClose={closeModal}>
            <Box
                sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', md: 700 }, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2,
                }}
            >
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Close />
                </IconButton>
                <Typography variant="h6" component="h2" mb={2}>Reporte de Residuos</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        {entries.length > 0? entries.map((entry, index) => (
                            <Box key={index} display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center">
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <InputLabel>Residuo</InputLabel>
                                    <Select
                                        inputProps={{ readOnly: true }}
                                        name="residue"
                                        value={entry.residue}
                                        onChange={event => handleInputChange(index, event)}
                                    >
                                        {residues.map((residue, idx) => (
                                            <MenuItem key={idx} value={residue.nombre}>{residue.nombre}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    sx={{ m: 1, flexBasis: { xs: '100%', md: '25%' } }}
                                    name="peso"
                                    label="Peso en kg"
                                    variant="outlined"
                                    type="number"
                                    value={entry.peso}
                                    onChange={event => handleInputChange(index, event)}
                                    inputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    sx={{ m: 1, flexBasis: { xs: '100%', md: '25%' } }}
                                    name="volumen"
                                    label="Volumen en m³"
                                    variant="outlined"
                                    type="number"
                                    value={entry.volumen}
                                    onChange={event => handleInputChange(index, event)}
                                    inputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Box>
                        )): <Typography variant="h6" color="GrayText" component="h6" mb={2}>No hay residuos en este reporte</Typography>}
                    </Stack>
                </form>
            </Box>
        </Modal>,
        document.getElementById('modal')
    );
}

