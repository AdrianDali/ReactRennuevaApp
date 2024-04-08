import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/user/CreateUser.css';
import { TodoContext } from '../context/index.js';
import axios from 'axios';
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel } from '@mui/material';
import Title from '../components/Title';
import Grid from '@mui/material/Grid';
import SignatureComponent from "../components/FirmaDocument";

function ModalFirmar({ children, mode,id , type}) {
    const { openModalCreateFirma, setOpenModalCreateFirma, openModalEditFirma, setOpenModalEditFirma, openModalDeleteFirma, setOpenModalDeleteFirma,
        openModalCreateFirmaReceptor, setUpdateReportInfo,setOpenModalCreateFirmaReceptor, openModalEditFirmaReceptor, setOpenModalEditFirmaReceptor, openModalDeleteFirmaReceptor, setOpenModalDeleteFirmaReceptor,
     } = useContext(TodoContext);
    console.log("ID DE QUIERN SE FIRMA",id)

    const closeModal = () => {
        if (type == "Generador"){
        if (openModalCreateFirma) {
            setOpenModalCreateFirma(false);
        }
        if (openModalEditFirma) {
            setOpenModalEditFirma(false);
        }
        if (openModalDeleteFirma) {
            setOpenModalDeleteFirma(false);
        }
    }
        
        if (type == "Receptor"){
        if (openModalCreateFirmaReceptor) {
            setOpenModalCreateFirmaReceptor(false);
        }
        if (openModalEditFirmaReceptor) {
            setOpenModalEditFirmaReceptor(false);
        }
        if (openModalDeleteFirmaReceptor) {
            setOpenModalDeleteFirmaReceptor(false);
        }
        }
        setUpdateReportInfo(true);

        


    };

    return ReactDOM.createPortal(
        <Modal open={true} onClose={closeModal}>

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
                <Button onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>&times;</Button>
                <Box>
                    <SignatureComponent id= {id} type= {type}/>
                </Box>
            </Box>

        </Modal>

        , document.getElementById('modal')

    )

}

export { ModalFirmar };