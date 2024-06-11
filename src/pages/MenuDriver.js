import React, { useContext, useState } from "react";
import { TodoContext } from "../context/index.js";
import { ModalUser } from "./Users/ModalUser";
import ResidueTable from "../components/ResidueTable";
import BarsChartVehicle from "../components/BarsChartVehicle";
import {
  ThemeProvider,
  createTheme,
  Box,
  Grid,
  Paper,
  Container,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import Title from "../components/Title";
import CUDButtons from "../containers/CUDButtons";
import { ModalDriver } from "./ModalDriver.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DriverTable from "../components/DriverTable.js";
import BarsChartCarrier from "../components/graph/BarsCharCarrier.js";

import useAuth from "../hooks/useAuth.js";

function MenuDriver() {
  const {
    openModalText,
    setOpenModalText,
    textOpenModalText,
    openModalCreateDriver,
    setOpenModalCreateDriver,
    setOpenModalEditDriver,
    openModalEditDriver,
    setOpenModalDeleteDriver,
    openModalDeleteDriver,
  } = useContext(TodoContext);

  const dataUser = useAuth();



  return (
    <>
      <CssBaseline />
      {dataUser && (dataUser.groups[0] === "Administrador"  || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Registro" ) ? (
        <Container
          maxWidth={false}
          sx={{ flexGrow: 1, overflow: "auto", py: 3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Title>Conductores</Title>
                <CUDButtons model="Driver" />
                <Title>Lista de Conductores</Title>
                <DriverTable />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  height: 580,
                }}l
              >
                <BarsChartCarrier />
              </Paper>
            </Grid>
          </Grid>

          {openModalCreateDriver && (
            <ModalDriver mode={"CREAR"} creatorUser={dataUser.user}>
              La funcionalidad de agregar TODO
            </ModalDriver>
          )}
          {openModalEditDriver && (
            <ModalDriver mode={"EDITAR"} creatorUser={dataUser.user}>
              La funcionalidad de editar TODO
            </ModalDriver>
          )}
          {openModalDeleteDriver && (
            <ModalDriver mode={"BORRAR"} creatorUser={dataUser.user}>
              La funcionalidad de borrar TODO
            </ModalDriver>
          )}
          {openModalText && (
            <Dialog
              open={openModalText}
              onClose={() => setOpenModalText(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {textOpenModalText}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {textOpenModalText}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModalText(false)}>Aceptar</Button>
              </DialogActions>
            </Dialog>
          )}
        </Container>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Title>No tienes permisos para ver esta página</Title>
        </Box>
      )}
    </>
  );
}

export { MenuDriver };
