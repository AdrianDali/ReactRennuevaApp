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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Person,
  Phone,
  Email,
  Home,
  Map,
  LocationOn,
  Event,
  CalendarToday,
  ChatBubbleOutline,
} from '@mui/icons-material';
import cancelationReassonText from '../../helpers/cancelationReassonText';

export default function EnhancedDonorRecollectionInfo({ request }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grow in>
      <Card elevation={3} sx={{ mt: 2, position: 'relative' }}>
        {request.status === 'cancelado' && (
          <Chip
            label={`Solicitud cancelada: ${cancelationReassonText(
              request.comment_cancelation
            )}`}
            color="error"
            sx={{
              position: 'absolute',
              top: theme.spacing(2),
              right: theme.spacing(2),
            }}
          />
        )}

        <CardHeader
          avatar={<Avatar>{request.nombre.charAt(0)}</Avatar>}
          title={
            <Typography variant={isSm ? 'h6' : 'h5'}>
              Información del Donador
            </Typography>
          }
          subheader={request.nombre}
        />

        <Divider />

        <CardContent>
          <Grid container spacing={2}>
            {/* Donor Info */}
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Person color="primary" />
                  <Typography>
                    <strong>Nombre:</strong> {request.nombre}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone color="primary" />
                  <Typography>
                    <strong>Teléfono:</strong> {request.telefono}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email color="primary" />
                  <Typography>
                    <strong>Email:</strong> {request.donador}
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
                    <strong>Calle:</strong> {request.calle} {request.num_ext}
                    {request.num_int ? ` int. ${request.num_int}` : ''}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Map color="primary" />
                  <Typography>
                    <strong>Colonia:</strong> {request.localidad}, CP{' '}
                    {request.codigo_postal}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Home color="primary" />
                  <Typography>
                    <strong>Municipio:</strong>{' '}
                    {request.alcaldia || request.ciudad}, {request.estado}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Tooltip title="Referencias">
                    <ChatBubbleOutline color="primary" />
                  </Tooltip>
                  <Typography>
                    <strong>Referencias:</strong>{' '}
                    {request.referencia || '—'}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Collection */}
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Event color="primary" />
                  <Typography>
                    <strong>Peso Est.:</strong> {request.peso_estimado} kg
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday color="primary" />
                  <Typography>
                    <strong>Hora Pref.:</strong>{' '}
                    {request.hora_preferente_recoleccion} hrs
                  </Typography>
                </Stack>
                {request.conductor_asignado && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Person color="primary" />
                    <Typography>
                      <strong>Conductor:</strong> {request.conductor_asignado}
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday color="primary" />
                  <Typography>
                    <strong>F. Estimada:</strong>{' '}
                    {request.fecha_estimada_recoleccion !== '2000-01-01'
                      ? request.fecha_estimada_recoleccion
                      : 'Sin asignar'}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday color="primary" />
                  <Typography>
                    <strong>F. Reporte:</strong>{' '}
                    {request.fecha_creacion_reporte !== 'No recolectado aun'
                      ? request.fecha_creacion_reporte
                      : 'Sin asignar'}
                  </Typography>
                </Stack>
                {request.comment_cancelation && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Comentarios">
                      <ChatBubbleOutline color="primary" />
                    </Tooltip>
                    <Typography>
                      {cancelationReassonText(
                        request.comment_cancelation
                      ) ===
                      'Consulte comentarios de cancelación'
                        ? request.comment_cancelation
                        : cancelationReassonText(request.comment_cancelation)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grow>
  );
}