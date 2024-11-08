import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import "../styles/user/MenuUser.css";
import { TodoContext } from "../context/index.js";
import ResidueTable from "../components/ResidueTable";
import CUDButtons from "../containers/CUDButtons";

import {
  Box,
  Grid,
  Paper,
  Container,
  CssBaseline,
} from "@mui/material";
import Title from "../components/Title";
import { ModalResidue } from "./ModalResidue";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import BarsCharResidue from "../components/graph/BarsCharResidue";
import useAuth from "../hooks/useAuth.js";
import LoadingComponent from "./Menus/LoadingComponent.jsx";

function MenuResidue() {
  const {
    openModalCreateResidue,
    openModalEditResidue,
    openModalDeleteResidue,
    textOpenModalText,
    setOpenModalText,
    openModalText,
  } = useContext(TodoContext);

  const dataUser = useAuth();
  const [clientes, setClientes] = useState([]);
  const { updateResidueInfo } = useContext(TodoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
      .then(response => {
        const data = response.data;
        setClientes(data);
      })
      .catch(error => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
  }, [updateResidueInfo]);


  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "90vh", width: "100vw" }}>
        {dataUser && dataUser.groups[0] === "Administrador" && !loading ? (
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
                  <Title>Residuos</Title>
                  <CUDButtons model="Residue" />
                  <Title>Tabla de Residuos</Title>
                  <ResidueTable clientes={clientes} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    height: 580,
                  }}
                >
                  <BarsCharResidue />
                </Paper>
              </Grid>
            </Grid>
            {openModalCreateResidue && (
              <ModalResidue mode={"CREAR"} creatorUser={dataUser.user}>
                La funcionalidad de agregar TODO
              </ModalResidue>
            )}
            {openModalEditResidue && (
              <ModalResidue mode={"EDITAR"} creatorUser={dataUser.user}>
                La funcionalidad de editar TODO
              </ModalResidue>
            )}
            {openModalDeleteResidue && (
              <ModalResidue mode={"BORRAR"} creatorUser={dataUser.user}>
                La funcionalidad de borrar TODO
              </ModalResidue>
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
                  <Button onClick={() => setOpenModalText(false)}>
                    Aceptar
                  </Button>
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
      </Box>
    </>
  );
}

export { MenuResidue };
