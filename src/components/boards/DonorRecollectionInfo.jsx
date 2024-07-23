import { Box, Typography, Divider } from "@mui/material";

export default function DonorRecollectionInfo({ request }) {
    return (
        <Box display="flex" justifyContent="start" gap={10} padding={4} py={6} flexWrap="nowrap" overflow="scroll">
            <Box flexShrink={0}>
                <Typography variant="h6" gutterBottom>Información del donador</Typography>
                <Box paddingLeft={2}>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Nombre completo: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.nombre}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Teléfono: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.telefono}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Correo electrónico: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.donador}</Typography>
                    </Box>
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem />

            <Box flexShrink={0}>
                <Typography variant="h6" gutterBottom>Dirección</Typography>
                <Box paddingLeft={2}>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Calle: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.calle}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Número exterior: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.num_ext}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Número interior: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.num_int}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Colonia: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.localidad}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Código postal: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.codigo_postal}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Ciudad: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.ciudad}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Estado: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.estado}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Referencias: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.referencia}</Typography>
                    </Box>
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box flexShrink={0}>
                <Typography variant="h6" gutterBottom>Recolección</Typography>
                <Box paddingLeft={2}>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Peso estimado: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{`${request.peso_estimado} kg`}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Hora de recolección preferente: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{`${request.hora_preferente_recoleccion} hrs`}</Typography>
                    </Box>
                    {
                        request.comment_cancelation &&
                        <Box>
                            <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Comentarios de recolección: </Typography>
                            <Typography variant="body1" display="inline" gutterBottom>{request.comment_cancelation}</Typography>
                        </Box>
                    }
                    {
                        request.conductor_asignado &&
                        <Box>
                            <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Conductor asignado: </Typography>
                            <Typography variant="body1" display="inline" gutterBottom>{request.conductor_asignado}</Typography>
                        </Box>
                    }
                    {
                        request.fecha_estimada_recoleccion &&
                        <Box>
                            <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>fecha de recolección estimada: </Typography>
                            <Typography variant="body1" display="inline" gutterBottom>{request.fecha_estimada_recoleccion}</Typography>
                        </Box>
                    }
                    
                </Box>
            </Box>
        </Box>
    )
}