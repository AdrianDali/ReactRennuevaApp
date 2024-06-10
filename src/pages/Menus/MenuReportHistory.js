import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from "../../context/index.js";
import { ModalUser } from "../Users/ModalUser";
import RecyclingCenterTable from "../../components/RecyclingCenterTable";
import BarsChartVehicle from "../../components/BarsChartVehicle";
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
import CUDButtons from "../../containers/CUDButtons";
import { ModalRecyclingCenter } from "../ModalRecyclingCenter.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CompanyTable from "../../components/boards/CompanyTable.jsx";
import ReportTable from "../../components/ReportTable.jsx";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

function MenuReportHistory() {
  const {
    openModalCreateRecyclingCenter,
    openModalEditRecyclingCenter,
    setOpenModalDeleteRecyclingCenter,
    openModalDeleteRecyclingCenter,
    openModalText,
    setOpenModalText,
    textOpenModalText,
    setTextOpenModalText,
  } = useContext(TodoContext);
  const dataUser = useAuth();
  console.log("dataUser", dataUser);

  const defaultTheme = createTheme();

  return (
    <>
      <CssBaseline />

      {dataUser && (dataUser.groups[0] === "Administrador"  || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Produccion" || dataUser.groups[0] === "Registro" ) ? (
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
                <Title>Responsivas</Title>
                <CUDButtons model="ReportHistory" />
                <Title>Historial de Responsivas</Title>
                <ReportTable />
              </Paper>
            </Grid>
          </Grid>

          {openModalCreateRecyclingCenter && (
            <ModalRecyclingCenter mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ModalRecyclingCenter>
          )}
          {openModalEditRecyclingCenter && (
            <ModalRecyclingCenter mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ModalRecyclingCenter>
          )}
          {openModalDeleteRecyclingCenter && (
            <ModalRecyclingCenter mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ModalRecyclingCenter>
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
            margin: "auto",
          }}
        >
          <Typography variant="h5">No Access</Typography>
        </Box>
      )}
    </>
  );
}

export { MenuReportHistory };
