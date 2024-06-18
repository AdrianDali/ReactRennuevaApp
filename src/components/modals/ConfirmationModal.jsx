import React, { useState, useContext, useEffect } from 'react';
import '../../styles/user/CreateUser.css'
import { Modal, Button, Box, IconButton, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip } from '@mui/material';
import { Close } from '@mui/icons-material';
import Title from '../Title';


export default function ConfirmationModal({ children, isOpen, setOpen, title, severity, onConfirm, onCancel, loading=false}) {
    const handleClose = () => {
        setOpen(false);
    }

    const handleCancel = async () => {
        if (onCancel !== undefined && onCancel !== null) {
            await onCancel();
        }
        handleClose();
    }

    const handleConfirm = async () => {
        if (onConfirm !== undefined && onConfirm !== null) {
            await onConfirm();
        }
    }


    return (
        <Modal keepMounted open={isOpen} onClose={handleClose} >
            <Box className="ModalContent" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,

            }}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <Title color={severity}>{title}</Title>
                {children}
                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1, pt: 2 }}>
                    <Button onClick={handleCancel} variant="text" color={severity === "error" ? "success" : "error"} size='small'>Cancelar</Button>
                    <Button onClick={async ()=>{
                        await handleConfirm();
                    }} variant="contained" color={severity} size='small' disabled={loading}>{loading ? "Cargando..." : "Confirmar"}</Button>
                </Box>
            </Box>
        </Modal>
    )
}