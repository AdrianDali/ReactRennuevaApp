import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/user/CreateUser.css'
import { Modal, Button, Box, IconButton, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip } from '@mui/material';
import { Close } from '@mui/icons-material';
import Title from '../Title';


export default function NotificationModal({ children, isOpen, setOpen, title, severity, onAccept }) {
    const handleClose = () => {
        if (onAccept) onAccept()
        setOpen(false)
    }

    return createPortal(
        <Modal open={isOpen} onClose={handleClose} >
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
                    <Button onClick={handleClose} variant="contained" color="success" size='medium'>
                        Aceptar
                    </Button>
                </Box>
            </Box>
        </Modal>, document.body
    )
}