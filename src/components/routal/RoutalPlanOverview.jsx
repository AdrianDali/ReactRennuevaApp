// src/pages/RoutalPlanOverview.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const ROUTAL_GREEN_DARK = "#689F38";

const MOCK_PLAN = {
  id: "68ae453653164a7da0f1f857",
  label: "2025/12/26 - Plan",
  execution_date: "2025-12-26",
  stats: { totalTime: "5h 59m", km: "111km", stops: 6 },
  vehicles: [
    {
      id: "veh-1",
      name: "Hino",
      distance: "44.5km",
      window: "09:30-14:00",
      progressPct: 80,
      color: "#29b6f6",
    },
    {
      id: "veh-2",
      name: "Kangoo",
      distance: "67.3km",
      window: "09:30-16:30",
      progressPct: 55,
      color: "#689F38",
    },
  ],
  unassignedStops: 0,
};

function a11yProps(index) {
  return { id: `plan-tab-${index}`, "aria-controls": `plan-tabpanel-${index}` };
}

const MetricChip = ({ label }) => (
  <Chip
    size="small"
    label={label}
    variant="outlined"
    sx={{ borderRadius: 2, bgcolor: "white" }}
  />
);

const ProgressBar = ({ value }) => (
  <Box sx={{ height: 6, borderRadius: 999, bgcolor: "#eeeeee", overflow: "hidden" }}>
    <Box sx={{ height: "100%", width: `${value}%`, bgcolor: ROUTAL_GREEN_DARK }} />
  </Box>
);

export default function RoutalPlanOverview() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const plan = useMemo(() => {
    // luego aquí será "data from hook"
    if (planId === MOCK_PLAN.id) return MOCK_PLAN;
    return { ...MOCK_PLAN, id: planId, label: `${MOCK_PLAN.label} (mock)` };
  }, [planId]);

  return (
    <Box sx={{ p: 0, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* SIDEBAR IZQUIERDA */}
        <Box
          sx={{
            width: 360,
            bgcolor: "white",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate("/routal/planner")}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <Box>
              <Typography variant="caption" sx={{ color: "#9e9e9e" }}>
                {plan.execution_date}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {plan.label}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
            }}
          >
            <Tab label="Visión general" {...a11yProps(0)} />
            <Tab label={`Vehículos ${plan.vehicles.length}`} {...a11yProps(1)} />
            <Tab label={`Paradas ${plan.stats.stops}`} {...a11yProps(2)} />
          </Tabs>

          <Divider />

          {/* Contenido sidebar */}
          <Box sx={{ p: 2, overflow: "auto", flex: 1 }}>
            {/* Vehículos (como en la vista real, en overview se ven arriba) */}
            <Stack spacing={1.5}>
              {plan.vehicles.map((v) => (
                <Paper
                  key={v.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 700 }}>{v.name}</Typography>
                    <Typography variant="caption" sx={{ color: "#9e9e9e" }}>
                      {/* placeholder */}
                      11:22
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 0.5, mb: 1 }}>
                    <MetricChip label={v.distance} />
                    <MetricChip label={v.window} />
                  </Stack>

                  <ProgressBar value={v.progressPct} />
                </Paper>
              ))}

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography variant="subtitle2" sx={{ color: "#9e9e9e", fontWeight: 700 }}>
                  No asignadas
                </Typography>
                <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                  {plan.unassignedStops} paradas
                </Typography>
              </Box>

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 999,
                  backgroundColor: ROUTAL_GREEN_DARK,
                  "&:hover": { backgroundColor: "#558B2F" },
                }}
              >
                Crear rutas ✨
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* MAPA / PANEL CENTRAL */}
        <Box sx={{ flex: 1, position: "relative" }}>
          {/* Topbar (métricas) */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              zIndex: 10,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                border: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Chip size="small" label={plan.stats.totalTime} />
              <Chip size="small" label={plan.stats.km} />
              <Chip size="small" label={`${plan.stats.stops} paradas`} />
            </Paper>

            <Stack direction="row" spacing={1}>
              <IconButton sx={{ bgcolor: "white", border: "1px solid #e0e0e0" }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ bgcolor: "white", border: "1px solid #e0e0e0" }}>
                <CalendarMonthIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Placeholder del mapa */}
          <Box
            sx={{
              height: "100%",
              bgcolor: "#dfe7e3",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px dashed #9e9e9e",
                bgcolor: "rgba(255,255,255,0.8)",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>MAP VIEW (placeholder)</Typography>
              <Typography variant="body2" sx={{ color: "#616161" }}>
                Plan ID: {planId}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
