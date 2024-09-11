import React, { useContext, useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { Box, Typography, List, ListItem } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import deleteUsers from '../../services/deleteUsers';
import { TodoContext } from '../../context';
import NotificationModal from './NotificationModal';
import deleteDrivers from '../../services/deleteDrivers';

export default function DeleteDriverModal({ drivers }) {
    const [opneNotification, setOpenNotification] = useState(false);
    const {
        setUpdateDriverInfo,
        openModalDeleteDriver,
        setOpenModalDeleteDriver,
    } = useContext(TodoContext);
    const userData = useAuth();
    const title = `¿Está seguro de realizar esta operación?`;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);

    const handleDeleteDrivers = async () => {
        setLoading(true);
        if (userData === null) return;
        const creator = userData.user;
        const usersToDelete = drivers.map(driver => ({ user: driver, user_permissions: "Escritura", 'creator_user': creator }));
        const promises = deleteDrivers(usersToDelete);
        await promises.then(async (response) => {
            setResult(response);
            setLoading(false);
            setSuccess(response.every(res => res.status === 'fulfilled'));
            setOpenNotification(true);
            setOpenModalDeleteDriver(false);
        })

    }

    const body = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>Se eliminarán los siguientes conductores:</Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {drivers.map(driver => <ListItem sx={{ p: 0 }} key={driver}>
                    <Typography variant='body1'>{driver}</Typography>
                </ListItem>)}
            </List>
        </Box>
    )


    const notificationBody = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>
                {success ? "Los conductores se eliminaron correctamente." : "Ocurrió un error al realizar la operación. No se pudo eliminar a los siguientes conductores:"}
            </Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {result.map(res => {
                    if (res.status === 'fulfilled') return null;
                    const user = JSON.parse(res.reason.config.data);
                    const errorMessage = res.reason.response.data.errorMessage? res.reason.response.data.errorMessage : res.reason.response.statusText;
                    return (
                        <ListItem sx={{ p: 0 }} key={user.user}>
                            <Typography variant='body1'>{`${user.user} - ${errorMessage}`}</Typography>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )

    return (
        <>
            <ConfirmationModal isOpen={openModalDeleteDriver} setOpen={setOpenModalDeleteDriver} title={title} severity='error' loading={loading} onConfirm={async () => {
                await handleDeleteDrivers();
            }}>
                {body}
            </ConfirmationModal>

            <NotificationModal 
                isOpen={opneNotification} 
                setOpen={setOpenNotification}
                title={success ? "Conductores eliminados con éxito" : "Ocurrió un error"} 
                severity={success ? "success" : "error"} 
                onAccept={()=>{
                    setUpdateDriverInfo(prev => !prev)
                    }}>
                {success ? "Los generadores se eliminaron correctamente" : notificationBody}
            </NotificationModal>
        </>
    )
}