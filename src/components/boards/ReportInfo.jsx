import { Box, Typography, Divider } from "@mui/material";
import { format } from "date-fns";

export default function ReportInfo({ request }) {
  console.log("ReportInfo");
  console.log(request);
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
          <Box>
            <Typography
              variant="subtitle1"
              color="secondary"
              display="inline"
              fontWeight={500}
              gutterBottom
            >
              Grupo:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.grupo_usuario}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider orientation="vertical" flexItem />

      <Box flexShrink={0}>
        <Typography variant="h6" gutterBottom>
          Dirección
        </Typography>
        <Box paddingLeft={2}>
          <Box>
            <Typography
              variant="subtitle1"
              display="inline"
              color="secondary"
              fontWeight={500}
              gutterBottom
            >
              Calle:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.calle_reporte}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              display="inline"
              color="secondary"
              fontWeight={500}
              gutterBottom
            >
              Colonia:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.colonia_reporte}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              display="inline"
              color="secondary"
              fontWeight={500}
              gutterBottom
            >
              Código postal:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.cp_reporte}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              display="inline"
              color="secondary"
              fontWeight={500}
              gutterBottom
            >
              Ciudad:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.ciudad_reporte}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              display="inline"
              color="secondary"
              fontWeight={500}
              gutterBottom
            >
              Estado:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.estado_reporte}
            </Typography>
          </Box>
          {/* <Box>
                        <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Referencias: </Typography>
                        <Typography variant="body1" display="inline" gutterBottom>{request.referencia}</Typography>
                    </Box> */}
        </Box>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box flexShrink={0}>
        <Typography variant="h6" gutterBottom>
          Recolección
        </Typography>
        <Box paddingLeft={2}>
          <Box>
            <Typography
              variant="subtitle1"
              display="inline"
              color="secondary"
              fontWeight={500}
              gutterBottom
            >
              Transportista:{" "}
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.transportista
                ? request.transportista
                : "No cuenta con transportista"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              display="inline"
              color="secondary"
              fontWeight={500}
              gutterBottom
            >
              Centro Recolección/Reciclaje:
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.centro_recoleccion
                ? request.centro_recoleccion
                : request.centro_reciclaje}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              display="inline"
              color="secondary"
              fontWeight={500}
              gutterBottom
            >
              Fecha Inicio:
            </Typography>
            <Typography variant="body1" display="inline" gutterBottom>
              {request.fecha_inicio_reporte
                ? format(
                  new Date(request.fecha_inicio_reporte),
                  "dd/MM/yyyy HH:mm:ss"
                )
                : "No cuenta con fecha de inicio"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
