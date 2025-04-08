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
    console.log("ModalWatchResidueReport");
    console.log("report", report);

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

    const handleConfirmClose = () => {
        console.log("handleConfirmClose");
        console.log("report", report.id);
        const data = {
          orderId: report.id,
            
        }
        axios.post(`${process.env.REACT_APP_API_URL}/driver-recollected-order-reports/`, data)
            .then(response => {
                console.log(response.data);
                closeModal();
            })
            .catch(error => {
                console.error('Hubo un problema al cerrar el reporte:', error);
            });
    };


    return ReactDOM.createPortal(
        <>
          <NotificationModal
            children={
              success ? (
                <p>La verificación se guardó correctamente.</p>
              ) : (
                <p>Ocurrió un error al realizar la verificación.</p>
              )
            }
            onConfirm={() => setOpenNotification(false)}
            isOpen={openNotification}
            setOpen={setOpenNotification}
            severity={success ? "success" : "error"}
            title={success ? "Operación exitosa" : "Ocurrió un error"}
          />
          <Modal open={openModalEditResidueReport} onClose={closeModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "95%", md: 700, boxSizing: "border-box" },
                bgcolor: "background.paper",
                boxShadow: 24,
                py: 4,
                px: 4,
                borderRadius: 2,
              }}
            >
              <IconButton onClick={closeModal} sx={{ position: "absolute", right: 8, top: 8 }}>
                <Close />
              </IconButton>
              <Typography variant="h6" component="h2" mb={2}>
                Cerrar Verificación y Recolección
              </Typography>
              <Typography variant="body1" mb={4}>
                ¿Seguro que quieres cerrar la verificación y recolección de esta orden de recolección? Una vez hecho esto no podrás cambiar ni editar los pesos ya registrados.
              </Typography>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleConfirmClose}>
                  Confirmar
                </Button>
              </Box>
            </Box>
          </Modal>
        </>,
        document.getElementById("modal")
      );
      
}

