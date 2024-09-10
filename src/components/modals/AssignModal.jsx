import { useState, useEffect, useRef } from "react";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import Title from "../Title";




export default function AssignModal({ setOpen, isOpen, folios, users }) {
    const closeModal = () => {
        setOpen(false);
    }

    return (
        <Modal open={isOpen} onClose={closeModal} >
            <Box className="ModalContent" sx={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                maxHeight: '80dvh',
                overflowY: 'auto'

            }}>
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <Title>Asignar</Title>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="select-report-label">Folio</InputLabel>
                    <Select
                        labelId="select-report-label"
                        id="select-report"
                        label="Folio"
                    >
                        {
                            folios.map(folio => (
                                <MenuItem key={folio} value={folio}>{folio}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="select-user-label">Usuario</InputLabel>
                    <Select
                        labelId="select-user-label"
                        id="select-user"
                        label="Usuario"
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={closeModal}
                >Asignar</Button>
            </Box>
        </Modal>
    )
}