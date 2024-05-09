import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from '../context/index.js';
import { ModalCollectionCenter } from './ModalCollectionCenter';
import RecyclingCenterTable from "../components/RecyclingCenterTable";
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CollectionCenterTable from "../components/CollectionCenterTable.jsx";
import useAuth from "../hooks/useAuth.js";
import { Typography } from "@mui/material";



function MenuCollectionCenter() {
  const { 
    openModalCreateCollectionCenter, 
    setOpenModalCreateCollectionCenter, 
    setOpenModalEditCollectionCenter,
    openModalEditCollectionCenter, 
    setOpenModalDeleteCollectionCenter, 
    openModalDeleteCollectionCenter , openModalText, setOpenModalText ,textOpenModalText,setTextOpenModalText
  } = useContext(TodoContext);

  const dataUser = useAuth();

  // ... otros handlers y useEffect ...

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {dataUser && dataUser.groups[0] === "Administrador" ? (
      
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
                  <Title>Centros de Recoleccion</Title>
                  <CUDButtons model="CollectionCenter" />
                  <Title>Centros Creados</Title>
                  <CollectionCenterTable />
                </Paper>
              </Grid>
              
            </Grid>
          
          {openModalCreateCollectionCenter && (
            < ModalCollectionCenter mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ ModalCollectionCenter >
          )}
          {openModalEditCollectionCenter && (
            < ModalCollectionCenter mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ ModalCollectionCenter >
          )}
          {openModalDeleteCollectionCenter && (
            <ModalCollectionCenter mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ ModalCollectionCenter >
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
              margin: "auto",
              
            }}
          >
            <Typography variant="h5">No Access</Typography>
          </Box>
        )}

    </ThemeProvider>
  );
}

export { MenuCollectionCenter };
