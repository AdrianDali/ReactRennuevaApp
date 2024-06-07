import React, { useState, useEffect, useContext } from "react";
import "../../styles/user/MenuUser.css";
import { TodoContext } from "../../context/index.js";
import { ModalUser } from "./ModalUser.js";
import UserTable from "../../components/Table";
import CUDButtons from "../../containers/CUDButtons";
import BarsChart from "../../components/BarsChart";
import {createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Title from "../../components/Title";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import getCookieValue from "../../services/GetCookie.js";
import GetUser from "../../services/ApiGetUser.js"
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { CommentsDisabledOutlined } from "@mui/icons-material";
import theme from '../../context/theme';

function MenuUser() {

  const defaultTheme = createTheme();
  const navigate = useNavigate();
  const {
    textOpenModalText,
    openModalCreate,
    openModalEdit,
    openModalDelete,
    openModalText,
    setOpenModalText,
  } = useContext(TodoContext);
  
  const dataUser = useAuth();
  console.log("dataUser", dataUser)
  


  return (
    <>
      <CssBaseline />
      {dataUser && dataUser.groups[0] === "Administrador" ? (
      
      <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
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
                <Title>Usuarios</Title>
                <CUDButtons model="User" />
                <Title>Usuarios Creados</Title>
                <UserTable />
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
                <BarsChart />
              </Paper>
            </Grid>
          </Grid>
        

        {openModalCreate && (
          <ModalUser mode={"CREAR"} creatorUser={dataUser.user}>
            La funcionalidad de agregar TODO
          </ModalUser>
        )}
        {openModalEdit && (
          <ModalUser mode={"EDITAR"}  creatorUser={dataUser.user} >
            La funcionalidad de editar TODO
          </ModalUser>
        )}
        {openModalDelete && (
          <ModalUser mode={"BORRAR"}  creatorUser={dataUser.user} >
            La funcionalidad de borrar TODO
          </ModalUser>
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
    </>
  );
}

export { MenuUser };
