import { Box, Typography, Divider, Chip } from "@mui/material";
import cancelationReassonText from "../../helpers/cancelationReassonText";

export default function UserInfoSubTable({ request }) {
  console.log("request", request);
  return (
    <Box mt={2}>
      {request.status === "cancelado" && (
        <Chip
          label={`Solicitud cancelada: ${cancelationReassonText(
            request.comment_cancelation
          )}`}
          color="error"
        />
      )}
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
            Información del Usuario
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
                {request.complete_name}
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
                {request.phone}
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
                {request.user}
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
                {request.groups[0]}
              </Typography>
            </Box>
            {request.groups[0] === "Centro" && (
              <Box>
                <Typography
                  variant="subtitle1"
                  color="secondary"
                  display="inline"
                  fontWeight={500}
                  gutterBottom
                >
                  Centro:
                </Typography>
                {request.collection_center !== "NO APLICA" ? (
                  <Typography variant="body1" display="inline" gutterBottom>
                    {request.collection_center}
                  </Typography>
                ) : (
                  <Typography variant="body1" display="inline" gutterBottom>
                    {request.recycling_center}
                  </Typography>
                )}
              </Box>
            )}
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
                {request.address_street}
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
                Número exterior:{" "}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.address_num_ext}
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
                Número interior:{" "}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.address_num_int}
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
                {request.address_locality}
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
                {request.address_postal_code}
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
                {request.address_city}
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
                {request.address_state}
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
                Referencias:{" "}
              </Typography>
              <Typography variant="body1" display="inline" gutterBottom>
                {request.address_references}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* <Divider orientation="vertical" flexItem />
                <Box flexShrink={0}>
                    <Typography variant="h6" gutterBottom>Recolección</Typography>
                    <Box paddingLeft={2}>
                        <Box>
                            <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Peso estimado: </Typography>
                            <Typography variant="body1" display="inline" gutterBottom>{`${request.peso_estimado} kg`}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Hora de recolección preferente: </Typography>
                            <Typography variant="body1" display="inline" gutterBottom>{`${request.hora_preferente_recoleccion} hrs`}</Typography>
                        </Box>
                        {
                            request.comment_cancelation &&
                            <Box>
                                <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Comentarios de recolección: </Typography>
                                <Typography variant="body1" display="inline" gutterBottom>{cancelationReassonText(request.comment_cancelation) === "Consulte comentarios de cancelación"? request.comment_cancelation:cancelationReassonText(request.comment_cancelation)}</Typography>
                            </Box>
                        }
                        {
                            request.conductor_asignado &&
                            <Box>
                                <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>Conductor asignado: </Typography>
                                <Typography variant="body1" display="inline" gutterBottom>{request.conductor_asignado}</Typography>
                            </Box>
                        }
                        <Box>
                            <Typography variant="subtitle1" display="inline" color="secondary" fontWeight={500} gutterBottom>fecha de recolección estimada: </Typography>
                            <Typography variant="body1" display="inline" gutterBottom>{request.fecha_estimada_recoleccion !== "2000-01-01" ? request.fecha_estimada_recoleccion : "Sin asignar"}</Typography>
                        </Box>
                    </Box>
                </Box> */}
      </Box>
    </Box>
  );
}
