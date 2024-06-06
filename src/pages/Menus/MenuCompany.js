import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from '../../context/index.js';
import { ModalUser } from '../Users/ModalUser';
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
} from '@mui/material';
import Title from '../../components/Title';
import CUDButtons from "../../containers/CUDButtons";
//import { ModalCompany } from "../ModalCompany.js";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CompanyTable from "../../components/boards/CompanyTable.jsx";
import useAuth from "../../hooks/useAuth.js";
import {ModalCompany} from "../../components/modals/ModalCompany.js";



function MenuCompany() {
  const { 
    openModalCreateCompany, setOpenModalCreateCompany,
    openModalEditCompany, setOpenModalEditCompany, 
    openModalDeleteCompany, setOpenModalDeleteCompany, 
    openModalText, setOpenModalText,
    textOpenModalText,setTextOpenModalText
  } = useContext(TodoContext);

  const dataUser = useAuth();



  return (
    <>
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
                  <Title>Compañias</Title>
                  <CUDButtons model="Company" />
                  <Title>Compañias Creadas</Title>
                  <CompanyTable />
                </Paper>
              </Grid>
              
            </Grid>
          

          {openModalCreateCompany && (
            <ModalCompany mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ ModalCompany >
          )}
          {openModalEditCompany && (
            <ModalCompany mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ ModalCompany >
          )}
          {openModalDeleteCompany && (
            <ModalCompany mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ ModalCompany >
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
     
    </>
  );
}

export { MenuCompany };
