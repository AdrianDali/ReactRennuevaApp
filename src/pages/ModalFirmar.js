import React, { useState, useContext, useEffect, } from 'react';
import ReactDOM from 'react-dom';
import '../styles/user/CreateUser.css';
import { TodoContext } from '../context/index.js';
import axios from 'axios';
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel, IconButton } from '@mui/material';
import Title from '../components/Title';
import Grid from '@mui/material/Grid';
import SignatureComponent from "../components/FirmaDocument";
import { Close } from '@mui/icons-material';
import { ContainerMenuContext } from './Menus/ContainerMenu.jsx';
function ModalFirmar({ id, type }) {
    const { 
        openModalEditFirma, 
        setOpenModalEditFirma, 
        setUpdateReportInfo,
        setUpdateDonorReports
    } = useContext(TodoContext);
    console.log("ID DE QUIERN SE FIRMA", id)

    const closeModal = () => {
        if(type === "Receptor" || type === "Generador"){
            setUpdateReportInfo(prev => !prev);
        }else if(type === "Donador" || type === "Recolector"){
            setUpdateDonorReports(prev => !prev);
        }
        setOpenModalEditFirma(false)
    };

    return ReactDOM.createPortal(
        <Modal open={openModalEditFirma} onClose={closeModal}>

            <Box className="ModalContent" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,

            }}>
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <Box>
                    <SignatureComponent id={id} type={type} />
                </Box>
            </Box>

        </Modal>

        , document.getElementById('modal')

    )

}

export { ModalFirmar };