import axios from "axios";
import React, {  useContext, useState, useEffect } from "react";
import "../../styles/user/MenuUser.css";
import { TodoContext } from "../../context/index.js";
import { ModalGroup } from "./ModalGroup";
import CUDButtons from "../../containers/CUDButtons";
import BarsChartGroup from "../../components/BarsChartGroup";
import GroupTable from "../../components/GroupTable";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {
  Box,
  Grid,
  Paper,
  Container,
  CssBaseline,
} from "@mui/material";
import Title from "../../components/Title";
import useAuth from "../../hooks/useAuth.js";
import LoadingComponent from "../Menus/LoadingComponent.jsx";

function MenuGroups() {
  const {
    openModalCreateGroup,
    openModalText,
    setOpenModalText,
    textOpenModalText,
    openModalEditGroup,
    openModalDeleteGroup,
  } = useContext(TodoContext);

  const dataUser = useAuth();
  const [clientes, setClientes] = useState([]);
  const { updateGroupInfo } = useContext(TodoContext);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      // Realiza una petición GET a una URL específica
      axios
          .get(`${process.env.REACT_APP_API_URL}/get-all-groups/`)
          .then(response => {
              const data = response.data;
              setClientes(data);
          })
          .catch(error => {
              console.error(error);
          }).finally(() => {
              setLoading(false);
          });
  }, [updateGroupInfo]);


  return (
    <>
      <CssBaseline />
      {dataUser && dataUser.groups[0] === "Administrador" && !loading ? (
        <Container
          maxWidth={false}
          sx={{ flexGrow: 1, overflow: "auto", py: 3 }}
        >
          {" "}
          {/* Agregado margen inferior */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {" "}
              {/* Cambiado a xs={12} para ocupar todo el ancho */}
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Title>Grupos</Title>
                <CUDButtons model="Group" />
                <Title>Grupos Creados</Title>
                <GroupTable clientes={clientes}/>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              {" "}
              {/* Asegurado que ocupe todo el ancho */}
              <Paper
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  height: 580,
                }}
              >
                <BarsChartGroup/>
              </Paper>
            </Grid>
          </Grid>
          {openModalCreateGroup && (
            <ModalGroup mode={"CREAR"} creatorUser={dataUser.user}>
              La funcionalidad de agregar TODO
            </ModalGroup>
          )}
          {openModalEditGroup && (
            <ModalGroup mode={"EDITAR"} creatorUser={dataUser.user}>
              La funcionalidad de editar TODO
            </ModalGroup>
          )}
          {openModalDeleteGroup && (
            <ModalGroup mode={"BORRAR"} creatorUser={dataUser.user}>
              La funcionalidad de borrar TODO
            </ModalGroup>
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

export { MenuGroups };
