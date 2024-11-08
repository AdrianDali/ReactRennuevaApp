import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from '../../context/index.js';
import {
  Box,
  Grid,
  Paper,
  Container,
  CssBaseline,
} from '@mui/material';
import Title from '../../components/Title';
import CUDButtons from "../../containers/CUDButtons";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CompanyTable from "../../components/boards/CompanyTable.jsx";
import useAuth from "../../hooks/useAuth.js";
import { ModalCompany } from "../../components/modals/ModalCompany.js";
import LoadingComponent from "./LoadingComponent.jsx";



function MenuCompany() {
  const {
    openModalCreateCompany,
    openModalEditCompany,
    openModalDeleteCompany,
    openModalText, setOpenModalText,
    textOpenModalText, 
  } = useContext(TodoContext);

  const dataUser = useAuth();
  const [clientes, setClientes] = useState([]);
  const { updateCompanyInfo} = useContext(TodoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-companies/`)
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
  }, [updateCompanyInfo]);



  return (
    <>
      <CssBaseline />
      {dataUser && dataUser.groups[0] === "Administrador" && !loading? (


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
                <Title>Compañías</Title>
                <CUDButtons model="Company" />
                <Title>Compañías Creadas</Title>
                <CompanyTable clientes={clientes} />
              </Paper>
            </Grid>

          </Grid>


          {openModalCreateCompany && (
            <ModalCompany mode={"CREAR"} creatorUser={dataUser.user}>
              La funcionalidad de agregar TODO
            </ ModalCompany >
          )}
          {openModalEditCompany && (
            <ModalCompany mode={"EDITAR"} creatorUser={dataUser.user}>
              La funcionalidad de editar TODO
            </ ModalCompany >
          )}
          {openModalDeleteCompany && (
            <ModalCompany mode={"BORRAR"} creatorUser={dataUser.user}>
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

      ) : loading? <LoadingComponent/>: (
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
