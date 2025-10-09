import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Avatar,
  Stack,
  Typography,
  Grow,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Person,
  Phone,
  Email,
  Business,
} from '@mui/icons-material';

export default function EnhancedShortenedReportInfo({ request }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grow in>
      <Card elevation={3} sx={{ mt: 2 }}>
        <CardHeader
          avatar={<Avatar>{request.nombre_real_usuario.charAt(0)}</Avatar>}
          title={
            <Typography variant={isSm ? 'h6' : 'h5'}>
              Información del Reporte
            </Typography>
          }
        />

        <Divider />

        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Person color="primary" />
              <Typography>
                <strong>Nombre completo:</strong> {request.nombre_real_usuario}{' '}
                {request.apellido_usuario}
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
                <strong>Correo electrónico:</strong> {request.email_usuario}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Business color="primary" />
              <Typography>
                <strong>RFC:</strong> {request.rfc_usuario}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grow>
  );
}