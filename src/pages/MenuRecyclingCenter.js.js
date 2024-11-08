import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from "../context/index.js";
import { ModalUser } from "./Users/ModalUser";
import RecyclingCenterTable from "../components/RecyclingCenterTable";

import {
  Box,
  Grid,
  Paper,
  Container,
  CssBaseline,
} from "@mui/material";
import Title from "../components/Title";
import CUDButtons from "../containers/CUDButtons";
import { ModalRecyclingCenter } from "./ModalRecyclingCenter.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import useAuth from "../hooks/useAuth.js";
import LoadingComponent from "./Menus/LoadingComponent.jsx";

function MenuRecyclingCenter() {
  const {
    openModalCreateRecyclingCenter,
    openModalEditRecyclingCenter,
    openModalDeleteRecyclingCenter,
    openModalText,
    setOpenModalText,
    textOpenModalText,
  } = useContext(TodoContext);

  const dataUser = useAuth();

  const [clientes, setClientes] = useState([]);
  const { updateRecyclingCenterInfo } = useContext(TodoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-recycling-center/`)
      .then(response => {
        setClientes(response.data);
       
      })
      .catch(error => {
        console.error(error);
      }).finally(()=>{
        setLoading(false);
      });
  }, [updateRecyclingCenterInfo]);


  return (
    <>
      <CssBaseline />

      {dataUser && (dataUser.groups[0] === "Administrador" || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Registro") && !loading? (
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
                <Title>Centros de Reciclaje</Title>
                <CUDButtons model="RecyclingCenter" />
                <Title>Centros Creados</Title>
                <RecyclingCenterTable clientes={clientes} />
              </Paper>
            </Grid>
          </Grid>

          {openModalCreateRecyclingCenter && (
            <ModalRecyclingCenter mode={"CREAR"} creatorUser={dataUser.user}>
              La funcionalidad de agregar TODO
            </ModalRecyclingCenter>
          )}
          {openModalEditRecyclingCenter && (
            <ModalRecyclingCenter mode={"EDITAR"} creatorUser={dataUser.user}>
              La funcionalidad de editar TODO
            </ModalRecyclingCenter>
          )}
          {openModalDeleteRecyclingCenter && (
            <ModalRecyclingCenter mode={"BORRAR"} creatorUser={dataUser.user}>
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
      ) :loading? <LoadingComponent/>: (
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

export { MenuRecyclingCenter };
