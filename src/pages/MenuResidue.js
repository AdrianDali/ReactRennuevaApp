import React, { useContext } from "react";
import '../styles/user/MenuUser.css';
import { TodoContext } from '../context/index.js';
import { ModalUser } from './Users/ModalUser';
import ResidueTable from "../components/ResidueTable";
import BarsChartVehicle from "../components/BarsChartVehicle";
import CUDButtons from "../containers/CUDButtons";

import { ThemeProvider, createTheme, Box, Grid, Paper, Container, Toolbar, CssBaseline } from '@mui/material';
import Title from '../components/Title';
import { ModalResidue } from "./ModalResidue";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function MenuResidue() {
  const {
    openModalCreateResidue,
    setOpenModalCreateResidue,
    setOpenModalEditResidue,
    openModalEditResidue,
    setOpenModalDeleteResidue,
    openModalDeleteResidue,
    textOpenModalText,
    setOpenModalText,
    openModalText
  } = useContext(TodoContext);

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]),
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Title>Residuos</Title>
                  <CUDButtons model="Residue" />
                  <Title>Tabla de Residuos</Title>
                  <ResidueTable />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 580,
                  }}
                >
                  <BarsChartVehicle />
                </Paper>
              </Grid>
            </Grid>
          </Container>

          {openModalCreateResidue && (
            <ModalResidue mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ ModalResidue >
          )}
          {openModalEditResidue && (
            <ModalResidue mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ ModalResidue >
          )}
          {openModalDeleteResidue && (
            <ModalResidue mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ ModalResidue >
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

export { MenuResidue };