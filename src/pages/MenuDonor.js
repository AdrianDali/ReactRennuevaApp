import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from '../context/index.js';

import BarsCharDonor from "../components/BarsCharDonor.js";
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
} from '@mui/material';
import Title from '../components/Title';
import CUDButtons from "../containers/CUDButtons";
import { ModalDonor } from "./ModalDonor.js";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DonorTable from "../components/boards/DonorTable.jsx";
import BarsCharOrderRecollection from '../components/graph/BarsCharOrderRecollection';
import useAuth from "../hooks/useAuth.js";

function MenuDonor() {
  const {
    openModalCreateDonor,
    setOpenModalCreate,
    setOpenModalEdit,
    openModalEditDonor,
    setOpenModalDelete,
    openModalDeleteDonor,
    openModalText, setOpenModalText , textOpenModalText
  } = useContext(TodoContext);

  const dataUser = useAuth();

  // ... otros handlers y useEffect ...

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      
       {dataUser && (dataUser.groups[0] === "Administrador" || dataUser.groups[0] === "Comunicacion") ? (
      
      <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
      <Grid container spacing={3}>
              <Grid item xs={12} >
                <Paper
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Title>Donadores</Title>
                  <CUDButtons model="Donor" />
                  <Title>Donadores Creados</Title>
                  <DonorTable />
                </Paper>
              </Grid>
              <Grid item xs={12} >
                <Paper
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 580,
                  }}
                >
                  <BarsCharOrderRecollection />
                </Paper>
              </Grid>
            </Grid>
         
          {openModalCreateDonor && (
            <ModalDonor mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ ModalDonor >
          )}
          {openModalEditDonor && (
            <ModalDonor mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ ModalDonor >
          )}
          {openModalDeleteDonor && (
            <ModalDonor mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ ModalDonor >
          )}
          {openModalText && (
            <Dialog
              open={openModalText}
              onClose={() => setOpenModalText(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{textOpenModalText}</DialogTitle>
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
      
    </ThemeProvider>
  );
}

export { MenuDonor };
