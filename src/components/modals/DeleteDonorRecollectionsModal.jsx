import React, { useContext, useState} from 'react';
import ConfirmationModal from './ConfirmationModal';
import { Box, Typography, List, ListItem } from '@mui/material';
import { TodoContext } from '../../context';
import NotificationModal from './NotificationModal';
import deleteDonorRecollections from '../../services/deleteDonorRecollections';

export default function DeleteDonorRecollectionsModal({ recollections }) {
    const [opneNotification, setOpenNotification] = useState(false);
    const {
        setUpdateDonorInfo,
        openModalDeleteGenerator,
        setOpenModalDeleteGenerator,
    } = useContext(TodoContext);
    const title = `¿Está seguro de realizar esta operación?`;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);

    const handleDeleteDonorRecollections = async () => {
        setLoading(true);
        const recollectionsToDelete = recollections.map(recollection => ({ user: recollection.donador, id_order: recollection.id }));
        const promises = deleteDonorRecollections(recollectionsToDelete);
        await promises.then(async (response) => {
            console.log(response);
            setResult(response);
            setLoading(false);
            setSuccess(response.every(res => res.status === 'fulfilled'));
            setOpenNotification(true);
            setOpenModalDeleteGenerator(false);
        })

    }

    const body = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>Se eliminarán las siguientes ordenes de recolección:</Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {recollections.map(recollection => <ListItem sx={{ p: 0 }} key={recollection.id}>
                    <Typography variant='body1'>{`orden de recolección con id: ${recollection.id}`}</Typography>
                </ListItem>)}
            </List>
        </Box>
    )


    const notificationBody = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>
                {success ? "Las ordenes de recolección se eliminaron correctamente." : "Ocurrió un error al eliminar las ordenes de recolección. No se pudo eliminar las siguientes ordenes de recolección:"}
            </Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {result.map(res => {
                    if (res.status === 'fulfilled') return null;
                    const req = JSON.parse(res?.reason?.config?.data);
                    const errorMessage = res?.reason?.response?.data?.errorMessage? res?.reason?.response?.data?.errorMessage : res?.reason?.response?.statusText;
                    return (
                        <ListItem sx={{ p: 0 }} key={req?.id_order}>
                            <Typography variant='body1'>{`${req?.id_order} - ${errorMessage? errorMessage : "Error desconocido"}`}</Typography>
                        </ListItem>
                    )
                })}                   
            </List>
        </Box>
    )

    return (
        <>
            <ConfirmationModal isOpen={openModalDeleteGenerator} setOpen={setOpenModalDeleteGenerator} title={title} severity='error' loading={loading} onConfirm={async () => {
                await handleDeleteDonorRecollections();
            }}>
                {body}
            </ConfirmationModal>

            <NotificationModal 
                isOpen={opneNotification} 
                setOpen={setOpenNotification}
                title={success ? "Operación exitosa" : "Ocurrió un error"} 
                severity={success ? "success" : "error"} 
                onAccept={()=>{
                    setUpdateDonorInfo(prev => !prev)
                    }}>
                {success ? "Las ordenes de recolección se eliminaron correctamente." : notificationBody}
            </NotificationModal>
        </>
    )
}