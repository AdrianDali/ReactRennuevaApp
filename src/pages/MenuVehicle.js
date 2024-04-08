import React, { useContext, useState, useEffect } from "react";
import { TodoContext } from '../context/index.js';
import { ModalUser } from './Users/ModalUser';
import VehicleTable from "../components/VehicleTable";
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

import CUDButtons from "../containers/CUDButtons";
import { ModalVehicle } from "./ModalVehicle.js";
import Title from '../components/Title';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function MenuVehicle() {
  const { 
    openModalCreateVehicle, 
    setOpenModalCreateVehicle, 
    setOpenModalEditVehicle,
    openModalEditVehicle, 
    setOpenModalDeleteVehicle, 
    openModalDeleteVehicle,
    openModalText,
    setOpenModalText,
    textOpenModalText,
    setTextOpenModalText

  } = useContext(TodoContext);

  const [datos, setDatos] = useState([]);

  // ... otros handlers y useEffect ...

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl">
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
                  <Title>Vehículos</Title>
                  <CUDButtons model="Vehicle" />
                  <Title>Vehículos Creados</Title>
                  <VehicleTable />
                </Paper>
              </Grid>
              
            </Grid>
          </Container>

          {openModalCreateVehicle && (
            <ModalVehicle mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ ModalVehicle >
          )}
          {openModalEditVehicle && (
            <ModalVehicle mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ ModalVehicle >
          )}
          {openModalDeleteVehicle && (
            <ModalVehicle mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ ModalVehicle >
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
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export { MenuVehicle };
