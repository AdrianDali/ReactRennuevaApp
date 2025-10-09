import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Collapse,
  Grid,
  Stack,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Person,
  Phone,
  Email,
  LocationOn,
  Home,
  CalendarToday,
  Event,
  Comment,
  Schedule,
  Scale as MonitorWeight,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, parse } from 'date-fns';

const ExpandMore = styled(({ expand, ...other }) => (
  <IconButton {...other} />
))(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function OrderInfoCollapse({ request }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded((prev) => !prev);

  // parse date strings
  const createdAt = request.fecha
    ? format(
        parse(request.fecha, 'dd/MM/yyyy HH:mm', new Date()),
        'dd/MM/yyyy HH:mm'
      )
    : '—';

  const eta = request.fecha_estimada_recoleccion
    ? format(
        parse(request.fecha_estimada_recoleccion, 'yyyy-MM-dd', new Date()),
        'dd/MM/yyyy'
      )
    : '—';

  return (
     <Card elevation={3} sx={{ mt: 2, position: 'relative' }}>
      <CardHeader
        avatar={<Avatar>{request.nombre.charAt(0)}</Avatar>}
        title={
          <Typography variant={isSm ? 'h6' : 'h5'}>
            Orden #{request.id} — {request.status}
          </Typography>
        }
        subheader={createdAt}
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
                    <strong>Donador:</strong> {request.nombre}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email color="primary" />
                  <Typography>
                    <strong>Email:</strong> {request.donador}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone color="primary" />
                  <Typography>
                    <strong>Teléfono:</strong> {request.telefono}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MonitorWeight color="primary" />
                  <Typography>
                    <strong>Peso estimado:</strong>{' '}
                    {request.peso_estimado != null
                      ? `${request.peso_estimado} kg`
                      : 'No disponible'}
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
                    <strong>Dirección:</strong> {request.direccion_completa}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Home color="primary" />
                  <Typography>
                    <strong>Código postal:</strong> {request.codigo_postal}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Comment color="primary" />
                  <Typography>
                    <strong>Comentarios:</strong> {request.comentarios}
                  </Typography>
                </Stack>
                {request.comment_cancelation &&
                  request.comment_cancelation !== 'Sin comentarios' && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Comment color="error" />
                      <Typography>
                        <strong>Cancelación:</strong>{' '}
                        {request.comment_cancelation}
                      </Typography>
                    </Stack>
                  )}
              </Stack>
            </Grid>

            {/* Schedule & Signatures */}
            <Grid item xs={12} md={4}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday color="primary" />
                  <Typography>
                    <strong>Fecha estimada:</strong> {eta}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Schedule color="primary" />
                  <Typography>
                    <strong>Hora preferente:</strong>{' '}
                    {request.hora_preferente_recoleccion ?? '—'}
                  </Typography>
                </Stack>
                
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      
    </Card>
  );
}
