import React, { useState, useEffect, useContext } from "react";
import "../../styles/user/MenuUser.css";
import { TodoContext } from "../../context/index.js";
import { ModalGroup } from "./ModalGroup";
import { OptionButton } from "../../components/OptionButton";
import UserTable from "../../components/Table";
import CUDButtons from "../../containers/CUDButtons";
import BarsChart from "../../components/BarsChart";
import BarsChartGroup from "../../components/BarsChartGroup";
import GroupTable from "../../components/GroupTable";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
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

import Title from "../../components/Title";

function MenuGroups() {
  const {
    openModalCreateGroup,
    openModalText,
    setOpenModalText,
    textOpenModalText,
    openModalEditGroup,
    openModalDeleteGroup,
    setOpenModalEditGroup,
    setOpenModalDeleteGroup,
  } = useContext(TodoContext);

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mb: 2.5 }}>
            {" "}
            {/* Agregado margen inferior */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {" "}
                {/* Cambiado a xs={12} para ocupar todo el ancho */}
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Title>Grupos</Title>
                  <CUDButtons model="Group" />

                  <Title>Grupos Creados</Title>
                  <GroupTable />
                  
                </Paper>
              </Grid>
              <Grid item xs={12}>
                {" "}
                {/* Asegurado que ocupe todo el ancho */}
                <Paper
                  sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    height: 580,
                  }}
                >
                  <BarsChartGroup />
                </Paper>
              </Grid>
            </Grid>
          </Container>

          {openModalCreateGroup && (
            <ModalGroup mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ModalGroup>
          )}

          {openModalEditGroup && (
            <ModalGroup mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ModalGroup>
          )}
          {openModalDeleteGroup && (
            <ModalGroup mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ModalGroup>
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
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export { MenuGroups };
