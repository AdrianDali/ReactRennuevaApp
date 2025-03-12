import { useState, useEffect, useRef } from "react";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";

function SearchBar({ filteredData, setVisibleData, closeModal }) {
    const searchInputRef = useRef();
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e) => {
        const search = searchValue.trim().toLowerCase();
        if (search === "") {
            setVisibleData(filteredData);
        } else {
            const newData = filteredData.filter((report) => {
                return (
                    report.nombre_real_usuario.toLowerCase().includes(search) ||
                    report.apellido_usuario.toLowerCase().includes(search) ||
                    report.rfc_usuario.toLowerCase().includes(search) ||
                    report.email_usuario.toLowerCase().includes(search) ||
                    report.telefono_usuario.toLowerCase().includes(search) ||
                    report.calle_usuario.toLowerCase().includes(search) ||
                    report.colonia_usuario.toLowerCase().includes(search)
                    //report.grupo_usuario.toLowerCase().includes(search)
                );
            });
            setVisibleData(newData);
        }

        closeModal()

    };

    return (
        <>
            <TextField
                color="info"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                id="search-field"
                inputRef={searchInputRef}
                label="Buscar"
                variant="standard"
                size="small"
                fullWidth
                sx={{
                    width: "100%",
                    maxWidth: 400,
                }}
                placeholder="Nombre, Apellido, Correo electrónico, RFC, Teléfono"
            />
            <Button fullWidth onClick={handleSearch} variant="contained" color="info" sx={{ mt: 2 }}>Buscar</Button>
        </>
    );
}



export default function SearchingModal({ setOpen, isOpen, filteredData, setVisibleData }) {
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
                <SearchBar filteredData={filteredData} setVisibleData={setVisibleData} closeModal={closeModal}/>
            </Box>
        </Modal>
    )
}