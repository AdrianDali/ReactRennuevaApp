// -------------------------------------------
// FiltersVehicleModal.jsx
// -------------------------------------------

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";

export default function FiltersVehicleModal({
  isOpen,
  setOpen,
  data,
  setFilteredData,
  setVisibleData,
}) {
  const [filters, setFilters] = useState({
    modelo: "",
    placas: "",
    capacidad: "",
    conductor: "",
    source: "",
  });

  const unique = (field) =>
    [...new Set(data.map((v) => v[field]).filter(Boolean))];

  const handleApply = () => {
    let filtered = data;

    for (const key of Object.keys(filters)) {
      if (filters[key] !== "")
        filtered = filtered.filter((v) => String(v[key]) === String(filters[key]));
    }

    setFilteredData(filtered);
    setVisibleData(filtered);
    setOpen(false);
  };

  const handleClear = () => {
    setFilters({
      modelo: "",
      placas: "",
      capacidad: "",
      conductor: "",
      source: "",
    });
    setFilteredData(data);
    setVisibleData(data);
  };

  return (
    <Dialog open={isOpen} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>Filtros de vehículos</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Modelo</InputLabel>
              <Select
                value={filters.modelo}
                label="Modelo"
                onChange={(e) => setFilters({ ...filters, modelo: e.target.value })}
              >
                <MenuItem value="">Todos</MenuItem>
                {unique("modelo").map((v, i) => (
                  <MenuItem key={i} value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Placas</InputLabel>
              <Select
                value={filters.placas}
                label="Placas"
                onChange={(e) => setFilters({ ...filters, placas: e.target.value })}
              >
                <MenuItem value="">Todas</MenuItem>
                {unique("placas").map((v, i) => (
                  <MenuItem key={i} value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Capacidad</InputLabel>
              <Select
                value={filters.capacidad}
                label="Capacidad"
                onChange={(e) => setFilters({ ...filters, capacidad: e.target.value })}
              >
                <MenuItem value="">Todas</MenuItem>
                {unique("capacidad").map((v, i) => (
                  <MenuItem key={i} value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Conductor</InputLabel>
              <Select
                value={filters.conductor}
                label="Conductor"
                onChange={(e) => setFilters({ ...filters, conductor: e.target.value })}
              >
                <MenuItem value="">Todos</MenuItem>
                {unique("conductor").map((v, i) => (
                  <MenuItem key={i} value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Origen</InputLabel>
              <Select
                value={filters.source}
                label="Origen"
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Local">Local</MenuItem>
                <MenuItem value="Routal">Routal</MenuItem>
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClear} color="error">Limpiar</Button>
        <Button onClick={handleApply} variant="contained">Aplicar</Button>
      </DialogActions>
    </Dialog>
  );
}
