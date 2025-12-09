// -------------------------------------------
// VehicleInfoSubTable.jsx
// -------------------------------------------

import { Box, Typography, Table, TableBody, TableCell, TableRow, Paper } from "@mui/material";
import React from "react";

export default function VehicleInfoSubTable({ vehicle }) {
  return (
    <Paper
      sx={{
        m: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: "grey.50",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Información detallada
      </Typography>

      <Table size="small">
        <TableBody>

          <TableRow>
            <TableCell variant="head">Modelo</TableCell>
            <TableCell>{vehicle.modelo}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Placas</TableCell>
            <TableCell>{vehicle.placas}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Capacidad</TableCell>
            <TableCell>{vehicle.capacidad}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Conductor asignado</TableCell>
            <TableCell>{vehicle.conductor}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Permiso / External ID</TableCell>
            <TableCell>{vehicle.permiso}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Origen</TableCell>
            <TableCell>{vehicle.source}</TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </Paper>
  );
}
