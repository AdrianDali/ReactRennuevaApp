import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Modal, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, IconButton, Stack, Typography, CircularProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { TodoContext } from '../../context/index.js';
import { Close } from '@mui/icons-material';
import { tr } from 'date-fns/locale';
import { set } from 'date-fns';


export default function GeneralWeighingModal({ report }) {
    const { openModalEditResidueReport, setOpenModalEditResidueReport, setUpdateReportInfo } = useContext(TodoContext);
    const [pesoTotal, setPesoTotal] = useState('');
    const [volumenTotal, setVolumenTotal] = useState('');
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setUpdateReportInfo(prev => !prev);
        setOpenModalEditResidueReport(false);
        setPesoTotal('');
        setVolumenTotal('');
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("report", report);

        const data = {
            recollectionId: report.id,
            totalWeight: isNaN(parseFloat(pesoTotal)) ? 0 : parseFloat(pesoTotal),
            totalM3: isNaN(parseFloat(volumenTotal)) ? 0 : parseFloat(volumenTotal),
        };
        
        axios.post(`${process.env.REACT_APP_API_URL}/update-recollection-total-weight-m3/`, [data])
            .then(response => {
                console.log(response.data);
                closeModal();
            })
            .catch(error => {
                console.error('Hubo un problema al obtener los residuos:', error);
            }).finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        setPesoTotal(report.peso !== null ? report.peso : '');
    }, [report]);

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
                <Typography variant="h6" component="h2" mb={2}>Pesaje general</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField 
                        label="Peso total"
                        name="peso"
                        type="number"
                        fullWidth
                        required
                        margin='dense'
                        value={pesoTotal}
                        onChange={(e) => setPesoTotal(e.target.value)}
                    />
                    <TextField 
                        label="Volumen total (m3)"
                        name="volumen"
                        type="number"
                        fullWidth
                        required
                        margin='dense'
                        value={volumenTotal}
                        onChange={(e) => setVolumenTotal(e.target.value)}
                    />
                    <Button
                        color='primary'
                        variant='contained'
                        type='submit'
                        sx={{ mt: 2 }}
                        fullWidth
                        disabled={pesoTotal === '' || volumenTotal === '' || loading}
                    >
                        {loading ? <CircularProgress/> : 'Guardar'}
                    </Button>
                </form>
            </Box>
        </Modal>,
        document.getElementById('modal')
    );
}




