import { Box, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Divider } from "@mui/material";

export default function DonorSubtable({ report }) {
    return (
        <Box display="flex" justifyContent="start" gap={10} padding={4} py={6} flexWrap="wrap">
            <Box>
                <Typography variant="h6" gutterBottom>Información del donador</Typography>
                <Box paddingLeft={2}>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Nombre: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.first_name}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Apellidos: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.last_name}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Teléfono: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.phone}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color="secondary" display="inline" fontWeight={500} gutterBottom>Correo electrónico: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.email}</Typography>
                    </Box>
                </Box>
                
            </Box>
            <Divider orientation="vertical" flexItem />

            <Box>
                <Typography variant="h6" gutterBottom>Información del contenedor</Typography>
                <Box paddingLeft={2}>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Calle: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.recollection_address_street}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Número exterior: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.recollection_address_num_ext}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Número interior: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.recollection_address_num_int}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Colonia: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.recollection_address_locality}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Código postal: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.recollection_address_postal_code}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Ciudad: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.recollection_address_city}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Estado: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{report.recollection_address_state}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}