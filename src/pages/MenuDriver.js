import React, { useContext, useState } from "react";
import { TodoContext } from '../context/index.js';
import { ModalUser } from './Users/ModalUser';
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
} from '@mui/material';
import Title from '../components/Title';
import CUDButtons from "../containers/CUDButtons";
import { ModalDriver } from "./ModalDriver.js";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DriverTable from "../components/DriverTable.js";
import BarsChartCarrier from "../components/graph/BarsCharCarrier.js";



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
    openModalDeleteDriver 
  } = useContext(TodoContext);

  const [datos, setDatos] = useState([]);

  //... otros handlers y useEffect ...

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            flexGrow: 1,
            pt: 8,
          }}
        >
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
                  <Title>Conductores</Title>
                  <CUDButtons model="Driver" />
                  <Title>Lista de Conductores</Title>
                  <DriverTable />
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

          {openModalCreateDriver && (
            <ModalDriver mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ ModalDriver >
          )}
          {openModalEditDriver && (
            <ModalDriver mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ ModalDriver >
          )}
          {openModalDeleteDriver && (
            <ModalDriver mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ ModalDriver >
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
    </ThemeProvider>
  );
}

export { MenuDriver };
