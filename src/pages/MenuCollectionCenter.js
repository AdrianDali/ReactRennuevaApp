import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from '../context/index.js';
import { ModalCollectionCenter } from './ModalCollectionCenter';
import {
  Box,
  Grid,
  Paper,
  Container,
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
import LoadingComponent from "./Menus/LoadingComponent.jsx";



function MenuCollectionCenter() {
  const {
    openModalCreateCollectionCenter,
    openModalEditCollectionCenter,
    openModalDeleteCollectionCenter, openModalText, setOpenModalText, textOpenModalText
  } = useContext(TodoContext);
  const dataUser = useAuth();
  const [clientes, setClientes] = useState([]);
  const { updateCollectionCenterInfo} = useContext(TodoContext);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-collection-center/`)
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
  }, [updateCollectionCenterInfo]);




  return (
    <>
      <CssBaseline />
      {dataUser && (dataUser.groups[0] === "Administrador" || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Registro") && !loading ? (

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
                <Title>Centros de Acopio</Title>
                <CUDButtons model="CollectionCenter" />
                <Title>Centros de acopio creados</Title>
                <CollectionCenterTable clientes={clientes} />
              </Paper>
            </Grid>

          </Grid>

          {openModalCreateCollectionCenter && (
            < ModalCollectionCenter mode={"CREAR"} creatorUser={dataUser.user}>
              La funcionalidad de agregar TODO
            </ ModalCollectionCenter >
          )}
          {openModalEditCollectionCenter && (
            < ModalCollectionCenter mode={"EDITAR"} creatorUser={dataUser.user}>
              La funcionalidad de editar TODO
            </ ModalCollectionCenter >
          )}
          {openModalDeleteCollectionCenter && (
            <ModalCollectionCenter mode={"BORRAR"} creatorUser={dataUser.user}>
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
      ) : loading? <LoadingComponent/>: (
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

export { MenuCollectionCenter };
