import { Box, Typography} from "@mui/material";

export default function ShortenedReportInfo({ request }) {
  return (
    <Box
      display="flex"
      justifyContent="start"
      gap={10}
      padding={4}
      py={6}
      flexWrap="nowrap"
      overflow="scroll"
    >
      <Box flexShrink={0}>
        <Typography variant="h6" gutterBottom>
          Información del Reporte
        </Typography>
        <Box paddingLeft={2}>
          <Box>
            <Typography
              variant="subtitle1"
              color="secondary"
              display="inline"
              fontWeight={500}
              gutterBottom
            >
              Nombre completo:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.nombre_real_usuario} {request.apellido_usuario}{" "}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              color="secondary"
              display="inline"
              fontWeight={500}
              gutterBottom
            >
              Teléfono:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.telefono_usuario}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              color="secondary"
              display="inline"
              fontWeight={500}
              gutterBottom
            >
              Correo electrónico:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.nombre_usuario}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              color="secondary"
              display="inline"
              fontWeight={500}
              gutterBottom
            >
              RFC:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.rfc_usuario}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
