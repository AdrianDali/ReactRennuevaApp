import React, { useContext, useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { Box, Typography, List, ListItem } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { TodoContext } from '../../context';
import NotificationModal from './NotificationModal';
import deleteReports from '../../services/deleteReports';
import deleteDonorReports from '../../services/deleteDonorReports';

export default function DeleteDonorReportsModal({ reports}) {
    const [opneNotification, setOpenNotification] = useState(false);
    const {
        setOpenModalDeleteReport,
        openModalDeleteReport,
        setUpdateDonorReports
    } = useContext(TodoContext);

    const title = `¿Está seguro de realizar esta operación?`;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const userData = useAuth();
    console.log("reports to delete: ", reports)
    const handleDeleteReports = async () => {
        setLoading(true);
        const reportsToDelete = reports.map(report => {
            return { reportId: report, creator_user: userData.user}});
        const promises = deleteDonorReports(reportsToDelete);
        await promises.then(async (response) => {
            setResult(response);
            setLoading(false);
            setSuccess(response.every(res => res.status === 'fulfilled'));
            setOpenNotification(true);
            setOpenModalDeleteReport(false);
        })

    }

    const body = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>Se eliminarán los siguientes reportes:</Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {reports.map(report => <ListItem sx={{ p: 0 }} key={report}>
                    <Typography variant='body1'>{`Reporte con ID ${report}`}</Typography>
                </ListItem>)}
            </List>
        </Box>
    )


    const notificationBody = (
        <Box px={1} pt={1}>
            <Typography variant='body1'>
                {success ? "El reporte de elinó correctamente." : "Ocurrió un error al realizar la operación. No se pudo eliminar los siguinetes reportes:"}
            </Typography>
            <List sx={{ p: 0, pt: 1, pl: 1 }} >
                {result.map(res => {
                    if (res.status === 'fulfilled') return null;
                    //TODO: Change this to the correct key
                    //const user = JSON.parse(res.reason.config.data);
                    const request = JSON.parse(res.reason.config.data);
                    const requestId = request.reportId;
                    const errorMessage = res.reason.response.data.errorMessage? res.reason.response.data.errorMessage : res.reason.response.statusText;
                    return (
                        <ListItem sx={{ p: 0 }} key={requestId}>
                            <Typography variant='body1'>{`no se puedo eliminar el reporte con el ID ${requestId} - ${errorMessage}`}</Typography>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )

    return (
        <>
            <ConfirmationModal isOpen={openModalDeleteReport} setOpen={setOpenModalDeleteReport} title={title} severity='error' loading={loading} onConfirm={async () => {
                await handleDeleteReports();
            }}>
                {body}
            </ConfirmationModal>

            <NotificationModal 
                isOpen={opneNotification} 
                setOpen={setOpenNotification}
                title={success ? "Reporte eliminado con éxito" : "Ocurrió un error"} 
                severity={success ? "success" : "error"} 
                onAccept={()=>{
                    setUpdateDonorReports(prev=>!prev)
                    }}>
                {success ? "Los reportes se eliminaron correctamente" : notificationBody}
            </NotificationModal>
        </>
    )
}