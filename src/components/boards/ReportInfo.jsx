import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Chip,
  Grid,
  Stack,
  Typography,
  Avatar,
  Tooltip,
  Grow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  Home,
  Map,
  LocationOn,
  CalendarToday,
  Event,
  ChatBubbleOutline,
} from '@mui/icons-material';
import { format } from 'date-fns';
import cancelationReassonText from '../../helpers/cancelationReassonText';

export default function EnhancedReportInfo({ request }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grow in>
      <Card elevation={3} sx={{ mt: 2, position: 'relative' }}>
        {/* If the report has been canceled and there's a comment */}
        {request.status === 'cancelado' && request.comment_cancelation && (
          <Chip
            label={`Reporte cancelado: ${cancelationReassonText(request.comment_cancelation)}`}
            color="error"
            sx={{
              position: 'absolute',
              top: theme.spacing(2),
              right: theme.spacing(2),
            }}
          />
        )}

        <CardHeader
          avatar={<Avatar>{request.nombre_real_usuario.charAt(0)}</Avatar>}
          title={
            <Typography variant={isSm ? 'h6' : 'h5'}>
              Información del Reporte
            </Typography>
          }
          subheader={`${request.nombre_real_usuario} ${request.apellido_usuario}`}
        />

        <Divider />

        <CardContent>
          <Grid container spacing={2}>
            {/* Personal Info */}
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Person color="primary" />
                  <Typography>
                    <strong>Nombre completo:</strong> {request.nombre_real_usuario} {request.apellido_usuario}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone color="primary" />
                  <Typography>
                    <strong>Teléfono:</strong> {request.telefono_usuario}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email color="primary" />
                  <Typography>
                    <strong>Correo electrónico:</strong> {request.nombre_usuario}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Map color="primary" />
                  <Typography>
                    <strong>RFC:</strong> {request.rfc_usuario}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ChatBubbleOutline color="primary" />
                  <Typography>
                    <strong>Grupo:</strong> {request.grupo_usuario}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Address */}
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" />
                  <Typography>
                    <strong>Calle:</strong> {request.calle_reporte}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Home color="primary" />
                  <Typography>
                    <strong>Colonia:</strong> {request.colonia_reporte}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Map color="primary" />
                  <Typography>
                    <strong>Código postal:</strong> {request.cp_reporte}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" />
                  <Typography>
                    <strong>Ciudad:</strong> {request.ciudad_reporte}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Home color="primary" />
                  <Typography>
                    <strong>Estado:</strong> {request.estado_reporte}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Collection Details */}
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Person color="primary" />
                  <Typography>
                    <strong>Transportista:</strong>{' '}
                    {request.transportista ?? 'No cuenta con transportista'}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Map color="primary" />
                  <Typography>
                    <strong>Centro Recolección/Reciclaje:</strong>{' '}
                    {request.centro_recoleccion ?? request.centro_reciclaje}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday color="primary" />
                  <Typography>
                    <strong>Fecha de Inicio:</strong>{' '}
                    {request.fecha_inicio_reporte
                      ? format(new Date(request.fecha_inicio_reporte), 'dd/MM/yyyy HH:mm:ss')
                      : 'No cuenta con fecha de inicio'}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Event color="primary" />
                  <Typography>
                    <strong>Fecha de Creación:</strong>{' '}
                    {request.fecha_creacion_reporte
                      ? format(new Date(request.fecha_creacion_reporte), 'dd/MM/yyyy HH:mm:ss')
                      : 'No especificada'}
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
