import React, { useContext, useState} from 'react';
import ConfirmationModal from './ConfirmationModal';
import { Box, Typography, List, ListItem } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { TodoContext } from '../../context';
import NotificationModal from './NotificationModal';
import deleteCarriers from '../../services/deleteCarriers';

export default function DeleteCarrierModal({ carriers }) {
    const [opneNotification, setOpenNotification] = useState(false);
    const {
        setUpdateCarrierInfo,
        openModalDeleteCarrier,
        setOpenModalDeleteCarrier,
    } = useContext(TodoContext);
    const userData = useAuth();
    const title = `¿Está seguro de realizar esta operación?`;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);

    const handleDeleteCarriers = async () => {
        setLoading(true);
        if (userData === null) return;
        const creator = userData.user;
        const usersToDelete = carriers.map(carrier => ({ email: carrier, 'creator_user': creator }));
        const promises = deleteCarriers(usersToDelete);
        await promises.then(async (response) => {
            setResult(response);
            setLoading(false);
            setSuccess(response.every(res => res.status === 'fulfilled'));
            setOpenNotification(true);
            setOpenModalDeleteCarrier(false);
        })

    }

    const body = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>Se eliminarán los siguientes transportistas:</Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {carriers.map(carrier => <ListItem sx={{ p: 0 }} key={carrier}>
                    <Typography variant='body1'>{carrier}</Typography>
                </ListItem>)}
            </List>
        </Box>
    )


    const notificationBody = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>
                {success ? "Los transportistas se eliminaron correctamente." : "Ocurrió al realizar la operación. No se pudo eliminar a los siguientes transportistas:"}
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
            <ConfirmationModal isOpen={openModalDeleteCarrier} setOpen={setOpenModalDeleteCarrier} title={title} severity='error' loading={loading} onConfirm={async () => {
                await handleDeleteCarriers();
            }}>
                {body}
            </ConfirmationModal>

            <NotificationModal 
                isOpen={opneNotification} 
                setOpen={setOpenNotification}
                title={success ? "Transportistas eliminados con éxito" : "Ocurrió un error"} 
                severity={success ? "success" : "error"} 
                onAccept={()=>{
                    setUpdateCarrierInfo(prev => !prev)
                    }}>
                {success ? "Los transportistas se eliminaron correctamente" : notificationBody}
            </NotificationModal>
        </>
    )
}