import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Modal, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, IconButton, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { TodoContext } from '../context/index.js';
import { Close } from '@mui/icons-material';

export default function VerificationReportModal({ report, open, setOpen }) {
    const [residues, setResidues] = useState([]);
    const [entries, setEntries] = useState([{ user: report.nombre_usuario, report: report.id_report, residue: '', peso: '', volumen: '' }]);
    const [reportWasCorrect, setReportWasCorrect] = useState(false);
    const { setUpdateReportInfo } = useContext(TodoContext);

    const closeModal = () => {
        setUpdateReportInfo(prev => !prev);
        setOpen(false);
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
        <Modal open={open} onClose={closeModal}>
            <Box
                sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', md: 700 }, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2,
                }}
            >
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Close />
                </IconButton>
                <Typography variant="h6" component="h2" mb={2}>Verificar Reporte</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel id="verification-label">¿El pesaje fue correcto?</InputLabel>
                            <Select
                                required
                                labelId="verification-label"
                                id="verification-select"
                                value={reportWasCorrect}
                                label="¿El pesaje fue correcto?"
                                onChange={(e) => setReportWasCorrect(e.target.value)}
                            >
                                <MenuItem value={true}>Si</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </Select>
                        </FormControl>
                        {!reportWasCorrect && 
                        <TextField
                            label="Observaciones"
                            variant="outlined"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Escribe aquí tus observaciones"
                        />}
                        <Button type="submit" variant="contained" fullWidth>
                            Enviar
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Modal>,
        document.getElementById('modal')
    );
}

