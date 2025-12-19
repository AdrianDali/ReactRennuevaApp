// -------------------------------------------
// VehicleInfoSubTable.jsx  (estilo tipo referencia)
// -------------------------------------------

import React from "react";
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
  Chip,
  Tooltip,
  useMediaQuery,
  Box,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  LocalShippingOutlined,
  BadgeOutlined,
  NumbersOutlined,
  PersonOutline,
  KeyOutlined,
  HubOutlined,
  StorageOutlined,
  InfoOutlined,
} from "@mui/icons-material";

export default function VehicleInfoSubTable({ vehicle }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

  const isRoutal = vehicle?.source === "Routal";
  const sourceColor = isRoutal ? "primary" : "success";
  const sourceIcon = isRoutal ? <HubOutlined /> : <StorageOutlined />;

  const initial = (vehicle?.modelo || "V").charAt(0).toUpperCase();

  return (
    <Grow in>
      <Card
        elevation={3}
        sx={{
          mt: 2,
          mx: { xs: 1, sm: 2 },
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Chip flotante (estilo referencia) */}
        <Box
          sx={{
            position: "absolute",
            top: theme.spacing(2),
            right: theme.spacing(2),
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            zIndex: 1,
          }}
        >
          <Chip
            icon={sourceIcon}
            label={`Origen: ${safe(vehicle?.source)}`}
            color={sourceColor}
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
          {vehicle?.placas && (
            <Chip
              icon={<BadgeOutlined />}
              label={vehicle.placas}
              variant="outlined"
              sx={{ fontWeight: 800 }}
              size="small"
            />
          )}
        </Box>

        <CardHeader
          avatar={<Avatar sx={{ fontWeight: 900 }}>{initial}</Avatar>}
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <InfoOutlined />
              <Typography variant={isSm ? "h6" : "h5"} sx={{ fontWeight: 900 }}>
                Información detallada
              </Typography>
            </Stack>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {safe(vehicle?.modelo)}
            </Typography>
          }
          sx={{
            bgcolor: "background.paper",
            "& .MuiCardHeader-content": { minWidth: 0 },
          }}
        />

        <Divider />

        <CardContent>
          <Grid container spacing={2}>
            {/* Bloque 1: Datos del vehículo */}
            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: "background.paper",
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 900 }}
                >
                  Datos del vehículo
                </Typography>

                <Stack spacing={1.1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalShippingOutlined color="primary" />
                    <Typography variant="body2">
                      <strong>Modelo:</strong> {safe(vehicle?.modelo)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BadgeOutlined color="primary" />
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-word",
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      }}
                    >
                      <strong>Placas:</strong> {safe(vehicle?.placas)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <NumbersOutlined color="primary" />
                    <Typography variant="body2">
                      <strong>Capacidad:</strong> {safe(vehicle?.capacidad)}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            {/* Bloque 2: Asignación / Origen */}
            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: "background.paper",
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 900 }}
                >
                  Asignación y origen
                </Typography>

                <Stack spacing={1.1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PersonOutline color="primary" />
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-word" }}
                    >
                      <strong>Conductor asignado:</strong>{" "}
                      {safe(vehicle?.conductor)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <Tooltip title="Permiso / External ID">
                      <KeyOutlined color="primary" sx={{ mt: "2px" }} />
                    </Tooltip>
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-word",
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      }}
                    >
                      <strong>Permiso / External ID:</strong>{" "}
                      {safe(vehicle?.permiso)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 0.5 }}>
                    <Chip
                      size="small"
                      icon={sourceIcon}
                      label={safe(vehicle?.source)}
                      color={sourceColor}
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                    {vehicle?.external_id && (
                      <Chip
                        size="small"
                        icon={<KeyOutlined />}
                        label={`external_id: ${vehicle.external_id}`}
                        variant="outlined"
                        sx={{
                          fontWeight: 700,
                          fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Footer microcopy */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Tip: revisa origen y external_id para validar sincronización con Routal.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
}
