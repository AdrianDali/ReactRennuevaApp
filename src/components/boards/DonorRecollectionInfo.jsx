import { Box, Typography, Divider } from "@mui/material";

export default function DonorRecollectionInfo({ request }) {
    return (
        <Box display="flex" justifyContent="start" gap={10} padding={4} py={6} flexWrap="nowrap" overflow="scroll">
            <Box flexShrink={0}>
                <Typography variant="h6" gutterBottom>Información del usuario</Typography>
                <Box paddingLeft={2}>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Nombre completo: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.first_name + " " + request.last_name}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Teléfono: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.phone }</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Correo electrónico: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.email }</Typography>
                    </Box>
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem />

            <Box flexShrink={0}>
                <Typography variant="h6" gutterBottom>Dirección</Typography>
                <Box paddingLeft={2}>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Calle: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.address_street}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Número exterior: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.address_num_ext}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Número interior: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.address_num_int}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Colonia: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.address_locality}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Código postal: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.address_postal_code}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Ciudad: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.address_city}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Estado: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.address_street}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Referencias: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.address_reference}</Typography>
                    </Box>
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box flexShrink={0}>
                <Typography variant="h6" gutterBottom>Direccion completa</Typography>
                <Box paddingLeft={2}>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Peso estimado: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{`${request.direccion_completa} kg`}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}