import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { TodoContext } from '../context/index.js';
import { Modal, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import SignatureComponent from "../components/FirmaDocument";

function ModalFirmar({ id, type }) {
    const { 
        openModalEditFirma, 
        setOpenModalEditFirma, 
        setUpdateReportInfo,
        setUpdateDonorReports
    } = useContext(TodoContext);

    const closeModal = () => {
        if (type === "Receptor" || type === "Generador") {
            setUpdateReportInfo(prev => !prev);
        } else if (type === "Donador" || type === "Recolector") {
            setUpdateDonorReports(prev => !prev);
        }
        setOpenModalEditFirma(false);
    };

    return ReactDOM.createPortal(
        <Modal open={openModalEditFirma} onClose={closeModal}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', md: 600 },  // Ajuste de tamaño para dispositivos móviles y de escritorio
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
            }}>
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Close />
                </IconButton>
                <Box mt={2}>
                    <SignatureComponent id={id} type={type} />
                </Box>
            </Box>
        </Modal>,
        document.getElementById('modal')
    );
}

export { ModalFirmar };
