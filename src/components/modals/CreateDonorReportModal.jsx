import {
    Modal,
    TextField,
    Box,
    Button,
    IconButton,
    Autocomplete
} from "@mui/material"

import Title from "../Title"
import { Close } from "@mui/icons-material"
import axios from "axios";
import { useEffect, useState } from "react";


export default function CreateDonorReportModal({ isOpen, setOpen }) {
    const [correoCliente, setCorreoCliente] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);

    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/get-all-donor-email/`)
          .then((response) => {
            console.log("Donor recolection data");
            console.log(response.data);
            setCorreoCliente(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

    const closeModal = () => {
        setOpen(false)
    }

    return (
        <Modal open={isOpen} onClose={closeModal} >
            <Box className="ModalContent" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: 500,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,

            }}>
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <Title>Nuevo reporte de donador</Title>
                <Box display='flex' flexDirection='column' gap={2} sx={{ padding: 2 }} >
                    <Autocomplete
                        disablePortal
                        id="autocomplete-donor"
                        options={correoCliente}
                        noOptionsText="No se encontrarón coincidencias"
                        sx={{ width: "100%" }} // Usa el ancho completo del Grid item
                        getOptionLabel={(option) => option.email}
                        renderInput={(params) => (
                            <TextField {...params} label="Donador" />
                        )}
                        onChange={(event, value) => {
                            if (value) {
                                setSelectedDonor(value.email);
                            }
                        }}
                    />



                    <Button color="success" variant="contained">Crear</Button>
                </Box>
            </Box>
        </Modal>
    )
}