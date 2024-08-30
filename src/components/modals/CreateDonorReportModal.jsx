import {
    Modal,
    TextField,
    Box,
    Button,
    IconButton,
    Autocomplete,
    Typography
} from "@mui/material"

import Title from "../Title"
import { Close } from "@mui/icons-material"
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import useAuth from "../../hooks/useAuth";
import NotificationModal from "./NotificationModal";
import { TodoContext } from "../../context";


export default function CreateDonorReportModal({ isOpen, setOpen }) {
    const [correoCliente, setCorreoCliente] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [openNotificationModal, setOpenNotificationModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successAtCreating, setSuccessAtCreating] = useState(false);
    const [error, setError] = useState({});
    const { setUpdateDonorReports } = useContext(TodoContext);
    const dataUser = useAuth();

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
                setError(error)
            });
    }, []);

    const closeModal = () => {
        setOpen(false)
    }

    const handleCreateDonorReport = async () => {
        setLoading(true);
        //console.log(dataUser)
        if (selectedDonor === null) return
        const data = {
            username: selectedDonor,
            creator_user: dataUser.user,
            report_for : "Donor"
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/donor-create-initial-report/`, data);
            console.log(response.data);
            setSuccessAtCreating(true);
            setError({});
        } catch (error) {
            console.error(error);
            setSuccessAtCreating(false);
        } finally {
            setLoading(false);
            setOpenNotificationModal(true);
        }

    }

    const notificationBody = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>
                {successAtCreating ? "El reporte se creó exitosamente." : "Ocurrió un error al intentar crear el reporte."}
            </Typography>
            <Typography variant='body1'>{error.errorMessage}</Typography>
        </Box>
    )

    return (
        <>
        <Modal open={isOpen} onClose={closeModal} >
            <Box className="ModalContent" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
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
                            <TextField {...params} label="Donador" required error={selectedDonor === null} />
                        )}
                        onChange={(event, value) => {
                            if (value) {
                                setSelectedDonor(value.email);
                            } else {
                                setSelectedDonor(null);
                            }
                        }}
                    />
                    <Button disabled={loading || selectedDonor === null} color="success" variant="contained" onClick={() => {
                        handleCreateDonorReport()
                    }}>{loading ? "Cargando..." : "Crear"}</Button>
                </Box>
            </Box>
        </Modal>
        <NotificationModal isOpen={openNotificationModal} setOpen={setOpenNotificationModal} title="Creación de reporte de donador" severity={successAtCreating ? 'success' : 'error'} onAccept={()=>{
            setUpdateDonorReports(prev => !prev)
            setOpen(false)
        }}>
            {notificationBody}
        </NotificationModal>
        </>
    )
}