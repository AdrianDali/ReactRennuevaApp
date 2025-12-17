import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TodayIcon from "@mui/icons-material/Today";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RouteIcon from "@mui/icons-material/Route";
import NewPlanModal from "../modals/NewPlanModal";
import { searchPlans } from "../../services/routal/searchPlans";

const ROUTAL_GREEN_DARK = "#689F38";
const WEEK_DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

// Helpers sencillos para fechas
const getCalendarGrid = (year, monthIndex) => {
  const days = [];
  const firstOfMonth = new Date(year, monthIndex, 1);
  const firstDayWeekIndex = (firstOfMonth.getDay() + 6) % 7;

  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = firstDayWeekIndex - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    days.push({ date: new Date(year, monthIndex - 1, day), isCurrentMonth: false });
  }

  const thisMonthLastDay = new Date(year, monthIndex + 1, 0).getDate();
  for (let d = 1; d <= thisMonthLastDay; d++) {
    days.push({ date: new Date(year, monthIndex, d), isCurrentMonth: true });
  }

  const remaining = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, monthIndex + 1, d), isCurrentMonth: false });
  }

  return days;
};

const formatMonthYear = (date) =>
  new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(date);

const formatFullDate = (date) =>
  new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

const toKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;


const isoToYmd = (iso) => {
  if (!iso) return "";
  return String(iso).slice(0, 10);
};

const mapPlanFromApi = (p) => ({
  id: p.id,
  date: isoToYmd(p.execution_date),
  name: p.label,
  vehicles: p.total_drivers ?? 0,
  routes: p.total_routes ?? 0,
  status: p.status, 
});

const RoutalPlanner = () => {
  const [openNewPlanModal, setOpenNewPlanModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 10, 25));
  const [search, setSearch] = useState("");

  // ✅ planes reales del backend
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plansError, setPlansError] = useState("");

  const calendarDays = useMemo(
    () => getCalendarGrid(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  // ✅ FETCH: cada vez que cambie el mes, traemos planes
  useEffect(() => {
    const controller = new AbortController();

    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        setPlansError("");

        // Si Dalí luego agrega filtros month/year, aquí se los pasas:
        // const month = currentMonth.getMonth(); // ojo: 0-11
        // const year = currentMonth.getFullYear();

        const data = await searchPlans(
          { page: 1, limit: 500 }, // por ahora traemos "muchos" para poblar calendario
          { signal: controller.signal }
        );

        const mapped = (data?.docs || []).map(mapPlanFromApi);
        setPlans(mapped);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setPlansError(err?.message || "Error cargando planes");
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
    return () => controller.abort();
  }, [currentMonth]);

  const plansByDate = useMemo(() => {
    const map = {};
    plans.forEach((p) => {
      if (!p.date) return;
      if (!map[p.date]) map[p.date] = [];
      map[p.date].push(p);
    });
    return map;
  }, [plans]);

  const selectedDateKey = toKey(selectedDate);
  const plansForSelectedDate = plansByDate[selectedDateKey] || [];

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box
        sx={{
          maxWidth: "100%",
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: 3,
          mx: "auto",
          p: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* COLUMNA IZQUIERDA: CALENDARIO */}
        <Box
          sx={{
            flex: { xs: "1 1 auto", md: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<TodayIcon />}
                onClick={handleToday}
                sx={{ borderRadius: 20, textTransform: "none" }}
              >
                Hoy
              </Button>

              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <IconButton onClick={handlePrevMonth}>
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" sx={{ mx: 1, textTransform: "capitalize" }}>
                  {formatMonthYear(currentMonth)}
                </Typography>
                <IconButton onClick={handleNextMonth}>
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* ✅ feedback loading/error */}
              {loadingPlans && <CircularProgress size={18} sx={{ ml: 1 }} />}
              {plansError && (
                <Typography variant="caption" sx={{ ml: 1, color: "error.main" }}>
                  {plansError}
                </Typography>
              )}
            </Box>

            <TextField
              size="small"
              placeholder="Buscar plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 260 } }}
            />
          </Box>

          {/* Encabezado días */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
              mb: 1,
            }}
          >
            {WEEK_DAYS.map((day) => (
              <Typography key={day} align="center" sx={{ fontWeight: 600, color: "#9e9e9e" }}>
                {day}
              </Typography>
            ))}
          </Box>

          {/* Grid días */}
          <Box
            sx={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gridAutoRows: 90,
              columnGap: 1,
              rowGap: 3,
            }}
          >
            {calendarDays.map(({ date: day, isCurrentMonth }) => {
              const key = toKey(day);
              const plans = plansByDate[key] || [];
              const isSelected = key === selectedDateKey;
              const isToday = toKey(day) === toKey(new Date());

              const filteredPlans = plans.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              );

              const handleClickDay = () => {
                setSelectedDate(day);
                if (!isCurrentMonth) setCurrentMonth(new Date(day.getFullYear(), day.getMonth(), 1));
              };

              return (
                <Paper
                  key={key}
                  onClick={handleClickDay}
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 3,
                    cursor: "pointer",
                    height: "100%",
                    border: isSelected ? `2px solid ${ROUTAL_GREEN_DARK}` : "1px solid #e0e0e0",
                    backgroundColor: isSelected
                      ? "#e0f2f1"
                      : isToday
                      ? "#e8f5e9"
                      : isCurrentMonth
                      ? "#fafafa"
                      : "#f2f2f2",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    opacity: isCurrentMonth ? 1 : 0.6,
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: isSelected
                        ? ROUTAL_GREEN_DARK
                        : isCurrentMonth
                        ? "#616161"
                        : "#9e9e9e",
                    }}
                  >
                    {day.getDate()}
                  </Typography>

                  {filteredPlans.length > 0 && (
                    <Chip
                      size="small"
                      label={filteredPlans[0].name}
                      sx={{
                        mt: 1,
                        fontSize: "0.7rem",
                        bgcolor: "rgba(41, 182, 246, 0.1)",
                        borderRadius: 2,
                        maxWidth: "100%",
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  )}

                  {filteredPlans.length > 1 && (
                    <Typography variant="caption" sx={{ mt: 0.5, color: "#9e9e9e" }}>
                      + {filteredPlans.length - 1} evento{filteredPlans.length - 1 > 1 && "s"}
                    </Typography>
                  )}
                </Paper>
              );
            })}
          </Box>
        </Box>

        {/* COLUMNA DERECHA */}
        <Box
          sx={{
            flex: { xs: "1 1 auto", md: 1.3 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: { xs: 2, md: 0 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              minHeight: 260,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: "#9e9e9e", textTransform: "capitalize" }}>
              {formatFullDate(selectedDate)}
            </Typography>

            {plansForSelectedDate.length === 0 && (
              <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                No hay planes para esta fecha.
              </Typography>
            )}

            {plansForSelectedDate.map((plan) => (
              <Box
                key={plan.id}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${ROUTAL_GREEN_DARK}`,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    bgcolor:
                      plan.status === "finished"
                        ? "#4caf50"
                        : plan.status === "in_progress"
                        ? "#29b6f6"
                        : "#ffb300",
                  }}
                />
                <Box sx={{ p: 2, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {plan.name}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      size="small"
                      icon={<DirectionsBusFilledIcon fontSize="small" />}
                      label={plan.vehicles}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      icon={<RouteIcon fontSize="small" />}
                      label={plan.routes}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      icon={<AccessTimeIcon fontSize="small" />}
                      label="Progreso"
                      variant="outlined"
                    />
                  </Stack>

                  <Box sx={{ mt: 1, height: 6, borderRadius: 999, bgcolor: "#eeeeee" }}>
                    <Box
                      sx={{
                        height: "100%",
                        width: plan.status === "finished" ? "100%" : "40%",
                        borderRadius: 999,
                        bgcolor: ROUTAL_GREEN_DARK,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>

          <Divider />

          <Box sx={{ mt: "auto", textAlign: { xs: "center", md: "right" } }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 999,
                px: { xs: 2, md: 4 },
                width: { xs: "100%", md: "auto" },
                backgroundColor: ROUTAL_GREEN_DARK,
                "&:hover": { backgroundColor: "#558B2F" },
              }}
              onClick={() => setOpenNewPlanModal(true)}
            >
              Crear un plan nuevo
            </Button>
          </Box>

          <NewPlanModal
            open={openNewPlanModal}
            onClose={() => setOpenNewPlanModal(false)}
            selectedDate={selectedDate}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RoutalPlanner;
