import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Modal, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, IconButton, Stack, Typography, FormControlLabel, RadioGroup, FormLabel, Radio, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';
import { TodoContext } from '../context/index.js';
import { Close } from '@mui/icons-material';
import VerificationComponent from '../components/VerificationComponent.jsx';
import useAuth from "../hooks/useAuth.js";
import ConfirmationModal from '../components/modals/ConfirmationModal.jsx';
import NotificationModal from '../components/modals/NotificationModal.jsx';

export default function ModalWatchResidueReport({ report }) {
    const [residues, setResidues] = useState([]);
    const [entries, setEntries] = useState([report !== null ? { user: report.nombre_usuario, report: report.id_report, residue: '', peso: '', volumen: '' } : null]);
    const { openModalEditResidueReport, setOpenModalEditResidueReport, setUpdateReportInfo } = useContext(TodoContext);
    const [verifiedEntries, setVerifiedEntries] = useState([])
    const userData = useAuth()
    const [openNotification, setOpenNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);




    const closeModal = () => {
        setUpdateReportInfo(prev => !prev);
        setOpenModalEditResidueReport(false);
    };

    useEffect(() => {
        if (report === null) return;
        const getResidues = { reportId: report.id_report ? report.id_report : report.id };

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
                console.log(response.data)
                setEntries([...data]);
            })
            .catch(error => {
                console.error('Hubo un problema al obtener los residuos:', error);
            });
    }, [report]);

    /*

    const handleInputChange = (index, event) => {
        const values = [...entries];
        values[index][event.target.name] = event.target.value;
        setEntries(values);
    };

    */



    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/checker-verified-report/`, verifiedEntries)
            .then(response => {
                e.target.reset();
                setSuccess(true);
            })
            .catch(error => {
                console.error(error);
                setSuccess(false);
            }).finally(() => {
                setLoading(false);
                closeModal()
                setOpenNotification(true);
            });
    };

    return ReactDOM.createPortal(
        <>
            <NotificationModal children={success? <p>La verificación se guardó correctamente.</p>:<p>Ocurrió un error al realizar la verificación.</p> } onConfirm={()=> setOpenNotification(false)} isOpen={openNotification} setOpen={setOpenNotification} severity={success? "success": "error"} title={success? "Operación exitosa":"Ocurrió un error"}/>
            <Modal open={openModalEditResidueReport} onClose={closeModal}>
                <Box
                    sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: { xs: '95%', md: 700, boxSizing: 'border-box' }, bgcolor: 'background.paper', boxShadow: 24, py: 4, px: 4, borderRadius: 2,
                    }}
                >
                    <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <Close />
                    </IconButton>
                    <Typography variant="h6" component="h2" mb={2}>Reporte de Residuos</Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {entries?.length > 0 ? entries?.map((entry, index) => (
                            entry !== null && <VerificationComponent key={`entry-${index}`} entry={entry} residues={residues} index={index} setVerifiedEntries={setVerifiedEntries} verifiedEntries={verifiedEntries} checker={userData?.user} />
                        )) : <Typography variant="h6" color="GrayText" component="h6" mb={2}>No hay residuos en este reporte</Typography>}
                        <Button disabled={loading} variant='contained' color='primary' fullWidth sx={{ marginY: 2 }} type="submit">
                            {loading ? <CircularProgress /> : "Enviar"}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </>,
        document.getElementById('modal')
    );
}

