import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from "../context/index.js";

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
import { ModalDonor } from "./ModalDonor.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import useAuth from "../hooks/useAuth.js";

import DonorRecolectionTable from "../components/boards/DonorRecolectionTable.jsx";

function MenuDonorRecolection() {
  const {
    openModalCreateDonor,
    openModalEditDonor,
    openModalDeleteDonor,
    openModalText,
    setOpenModalText,
    textOpenModalText,
  } = useContext(TodoContext);

  // ... otros handlers y useEffect ...
  const dataUser = useAuth();



  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "90vh", width: "100vw" }}>
      {dataUser && (dataUser.groups[0] === "Administrador" || dataUser.groups[0] === "Comunicacion" || dataUser.groups[0] === "Logistica" || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Produccion" ) ? (
        
          <Container
            maxWidth={false}
            sx={{ flexGrow: 1, overflow: "auto", py: 3 }}
          >
            <Grid container spacing={1}>
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
                  <Title>Ordenes de Recoleccion</Title>

                  <CUDButtons model="DonorRecolection" />

                  <DonorRecolectionTable />
                </Paper>
              </Grid>
            </Grid>

            {openModalCreateDonor && (
              <ModalDonor mode={"CREAR"}>
                La funcionalidad de agregar TODO
              </ModalDonor>
            )}
            {openModalEditDonor && (
              <ModalDonor mode={"EDITAR"}>
                La funcionalidad de editar TODO
              </ModalDonor>
            )}
            {openModalDeleteDonor && (
              <ModalDonor mode={"BORRAR"}>
                La funcionalidad de borrar TODO
              </ModalDonor>
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
                  <Button onClick={() => setOpenModalText(false)}>
                    Aceptar
                  </Button>
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
      </Box>
    </>
  );
}

export { MenuDonorRecolection };
