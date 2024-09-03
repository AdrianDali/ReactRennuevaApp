import React, { useContext, useState} from 'react';
import ConfirmationModal from './ConfirmationModal';
import { Box, Typography, List, ListItem } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import deleteUsers from '../../services/deleteUsers';
import { TodoContext } from '../../context';
import NotificationModal from './NotificationModal';

export default function DeleteDonorModal({ donors }) {
    const [opneNotification, setOpenNotification] = useState(false);
    const {
        setUpdateDonorInfo,
        openModalDeleteDonor,
        setOpenModalDeleteDonor,
    } = useContext(TodoContext);
    const userData = useAuth();
    const title = `¿Está seguro de realizar esta operación?`;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);

    const handleDeleteDonors = async () => {
        setLoading(true);
        if (userData === null) return;
        const creator = userData.user;
        const usersToDelete = donors.map(donor => ({ email: donor, 'creator_user': creator }));
        const promises = deleteUsers(usersToDelete);
        await promises.then(async (response) => {
            setResult(response);
            setLoading(false);
            setSuccess(response.every(res => res.status === 'fulfilled'));
            setOpenNotification(true);
            setOpenModalDeleteDonor(false);
        })

    }

    const body = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>Se eliminarán los siguientes donadores:</Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {donors.map(donor => <ListItem sx={{ p: 0 }} key={donor}>
                    <Typography variant='body1'>{donor}</Typography>
                </ListItem>)}
            </List>
        </Box>
    )


    const notificationBody = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>
                {success ? "Los donadores se eliminaron correctamente." : "Ocurrió un error. No se pudo eliminar a los siguientes donadores:"}
            </Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {result.map(res => {
                    if (res.status === 'fulfilled') return null;
                    const user = JSON.parse(res.reason.config.data);
                    const errorMessage = res.reason.response.data.errorMessage? res.reason.response.data.errorMessage : res.reason.response.statusText;
                    return (
                        <ListItem sx={{ p: 0 }} key={user.email}>
                            <Typography variant='body1'>{`${user.email} - ${errorMessage}`}</Typography>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )

    return (
        <>
            <ConfirmationModal isOpen={openModalDeleteDonor} setOpen={setOpenModalDeleteDonor} title={title} severity='error' loading={loading} onConfirm={async () => {
                await handleDeleteDonors();
            }}>
                {body}
            </ConfirmationModal>

            <NotificationModal 
                isOpen={opneNotification} 
                setOpen={setOpenNotification}
                title={success ? "Donadores eliminados con éxito" : "Ocurrió un error"} 
                severity={success ? "success" : "error"} 
                onAccept={()=>{
                    setUpdateDonorInfo(prev => !prev)
                    }}>
                {success ? "Los donadores se eliminaron correctamente" : notificationBody}
            </NotificationModal>
        </>
    )
}