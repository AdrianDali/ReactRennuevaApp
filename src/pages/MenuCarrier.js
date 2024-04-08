import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from '../context/index.js';
import { ModalUser } from './Users/ModalUser';
import GeneratorTable from "../components/GeneratorTable";
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
import { ModalCarrier } from "./ModalCarrier.js";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CarrierTable from "../components/CarrierTable.jsx";
import BarsChartCarrier from "../components/graph/BarsCharCarrier.js";

function MenuCarrier() {
  const { 
    openModalCreateCarrier, 
    setOpenModalCreateCarrier, 
    setOpenModalEditCarrier,
    openModalEditCarrier, 
    setOpenModalDeleteCarrier, 
    openModalDeleteCarrier ,
    openModalText,
    setOpenModalText,
    textOpenModalText

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
                  <Title>Transportista</Title>
                  <CUDButtons model="Carrier" />
                  <Title>Transportistas Creados</Title>
                  <CarrierTable />
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
                  <BarsChartCarrier />
                </Paper>
              </Grid>
            </Grid>
          </Container>

          {openModalCreateCarrier && (
            <ModalCarrier mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ ModalCarrier >
          )}
          {openModalEditCarrier && (
            <ModalCarrier mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ ModalCarrier >
          )}
          {openModalDeleteCarrier && (
            <ModalCarrier mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ ModalCarrier >
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

export { MenuCarrier };
