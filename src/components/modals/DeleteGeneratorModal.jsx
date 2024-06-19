import React, { useContext, useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { Box, Typography, List, ListItem } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import deleteUsers from '../../services/deleteUsers';
import { TodoContext } from '../../context';
import axios from 'axios';
import NotificationModal from './NotificationModal';

export default function DeleteGeneratorModal({ generators }) {
    const [opneNotification, setOpenNotification] = useState(false);
    const {
        setUpdateGeneratorInfo,
        openModalCreateGenerator,
        setOpenModalCreateGenerator,
        openModalEditGenerator,
        setOpenModalEditGenerator,
        openModalDeleteGenerator,
        setOpenModalDeleteGenerator,
        openModalText,
        setOpenModalText
    } = useContext(TodoContext);
    const userData = useAuth();
    const title = `¿Está seguro de realizar esta operación?`;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);

    const handleDeleteGenerators = async () => {
        setLoading(true);
        if (userData === null) return;
        const creator = userData.user;
        const usersToDelete = generators.map(generator => ({ email: generator, 'creator_user': creator }));
        const promises = deleteUsers(usersToDelete);
        await promises.then(async (response) => {
            setResult(response);
            setLoading(false);
            setSuccess(response.every(res => res.status === 'fulfilled'));
            setOpenNotification(true);
            setOpenModalDeleteGenerator(false);
        })

    }

    const body = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>Se eliminarán los siguientes generadores:</Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {generators.map(generator => <ListItem sx={{ p: 0 }} key={generator}>
                    <Typography variant='body1'>{generator}</Typography>
                </ListItem>)}
            </List>
        </Box>
    )


    const notificationBody = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>
                {success ? "Los generadores se eliminaron correctamente." : "Ocurrió un error al intentar eliminar los generadores. No se pudo eliminar a los siguientes generadores:"}
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
            <ConfirmationModal isOpen={openModalDeleteGenerator} setOpen={setOpenModalDeleteGenerator} title={title} severity='error' loading={loading} onConfirm={async () => {
                await handleDeleteGenerators();
            }}>
                {body}
            </ConfirmationModal>

            <NotificationModal 
                isOpen={opneNotification} 
                setOpen={setOpenNotification}
                title={success ? "Generadores eliminados con éxito" : "Ocurrió un error"} 
                severity={success ? "success" : "error"} 
                onAccept={()=>{
                    setUpdateGeneratorInfo(prev => !prev)
                    }}>
                {success ? "Los generadores se eliminaron correctamente" : notificationBody}
            </NotificationModal>
        </>
    )
}