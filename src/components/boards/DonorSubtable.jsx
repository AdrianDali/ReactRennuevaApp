import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
  Avatar,
  Grow,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Person,
  Business,
  Phone,
  Email,
  Storefront,
  LocationOn,
} from '@mui/icons-material';

export default function EnhancedDonorSubtable({ report }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grow in>
      <Card elevation={3} sx={{ mt: 2 }}>
        <CardHeader
          avatar={<Avatar>{report.nombre_real_usuario.charAt(0)}</Avatar>}
          title={
            <Typography variant={isSm ? 'h6' : 'h5'}>
              Detalles del Reporte
            </Typography>
          }
          subheader={
            <Typography variant="body2">
              Centro: {report.centro_recoleccion}
            </Typography>
          }
        />

        <Divider />

        <CardContent>
          <Grid container spacing={2}>
            {/* Información del donador */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Información del Donador
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Person color="primary" />
                  <Typography>
                    <strong>Nombre:</strong> {report.nombre_real_usuario}{' '}
                    {report.apellido_usuario}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Business color="primary" />
                  <Typography>
                    <strong>RFC:</strong> {report.rfc_usuario}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone color="primary" />
                  <Typography>
                    <strong>Teléfono:</strong> {report.telefono_usuario}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email color="primary" />
                  <Typography>
                    <strong>Email:</strong> {report.email_usuario}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Información del contenedor */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Información del Contenedor
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Storefront color="primary" />
                  <Typography>
                    <strong>Centro:</strong> {report.centro_recoleccion}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" />
                  <Typography>
                    <strong>Dirección:</strong> {report.calle_reporte}{' '}
                    {report.recollection_address_num_ext}
                    {report.recollection_address_num_int
                      ? ` int. ${report.recollection_address_num_int}`
                      : ''
                    }, {report.colonia_reporte}, CP {report.cp_reporte}, {report.estado_reporte}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grow>
  );
}