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
  Slide,
  Fade,
  useMediaQuery,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Person,
  Phone,
  Email,
  Group,
  LocationOn,
  Home,
  Business,
} from '@mui/icons-material';
import cancelationReassonText from '../../helpers/cancelationReassonText';

export default function EnhancedUserInfoSubTable({ request }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredSection, setHoveredSection] = React.useState(null);

  return (
    <Slide direction="down" in mountOnEnter unmountOnExit>
      <Card
        elevation={3}
        sx={{
          mt: 2,
          position: 'relative',
          borderRadius: 2,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[6],
          },
        }}
      >
        {request.status === 'cancelado' && (
          <Chip
            label={`Solicitud cancelada: ${cancelationReassonText(
              request.comment_cancelation
            )}`}
            color="error"
            sx={{ position: 'absolute', top: theme.spacing(2), right: theme.spacing(2) }}
          />
        )}

        <CardHeader
          avatar={<Avatar>{request.complete_name.charAt(0)}</Avatar>}
          title={
            <Typography variant={isSm ? 'h6' : 'h5'}>
              Información del Usuario
            </Typography>
          }
          subheader={
            <Fade in timeout={500}>
              <Typography variant="body2">
                Grupo: {request.groups[0]}
              </Typography>
            </Fade>
          }
        />

        <Divider />

        <CardContent>
          <Grid container spacing={2}>
            {/* Usuario */}
            <Grid
              item
              xs={12}
              md={6}
              onMouseEnter={() => setHoveredSection('user')}
              onMouseLeave={() => setHoveredSection(null)}
              sx={{
                p: 2,
                borderRadius: 1,
                transition: 'background-color 0.3s ease',
                backgroundColor:
                  hoveredSection === 'user'
                    ? alpha(theme.palette.primary.light, 0.2)
                    : 'transparent',
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Detalles del Usuario
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Person color="primary" />
                  <Typography>
                    <strong>Nombre completo:</strong> {request.complete_name}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Phone color="primary" />
                  <Typography>
                    <strong>Teléfono:</strong> {request.phone}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email color="primary" />
                  <Typography>
                    <strong>Correo electrónico:</strong> {request.user}
                  </Typography>
                </Stack>
                {request.groups[0] === 'Centro' && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Group color="primary" />
                    <Typography>
                      <strong>Centro:</strong>{' '}
                      {request.collection_center !== 'NO APLICA'
                        ? request.collection_center
                        : request.recycling_center}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Grid>

            {/* Dirección */}
            <Grid
              item
              xs={12}
              md={6}
              onMouseEnter={() => setHoveredSection('address')}
              onMouseLeave={() => setHoveredSection(null)}
              sx={{
                p: 2,
                borderRadius: 1,
                transition: 'background-color 0.3s ease',
                backgroundColor:
                  hoveredSection === 'address'
                    ? alpha(theme.palette.primary.light, 0.2)
                    : 'transparent',
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Dirección
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Home color="primary" />
                  <Typography>
                    <strong>Calle:</strong> {request.address_street}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Business color="primary" />
                  <Typography>
                    <strong>Número ext.:</strong> {request.address_num_ext}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Business color="primary" />
                  <Typography>
                    <strong>Número int.:</strong> {request.address_num_int}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" />
                  <Typography>
                    <strong>Colonia:</strong> {request.address_locality}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" />
                  <Typography>
                    <strong>CP:</strong> {request.address_postal_code}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" />
                  <Typography>
                    <strong>Ciudad:</strong> {request.address_city}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" />
                  <Typography>
                    <strong>Estado:</strong> {request.address_state}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" />
                  <Typography>
                    <strong>Referencias:</strong> {request.address_references}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Slide>
  );
}
