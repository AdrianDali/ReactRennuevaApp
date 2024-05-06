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


function MenuUser() {

  const defaultTheme = createTheme();

  const {
    textOpenModalText,
    openModalCreate,
    openModalEdit,
    openModalDelete,
    openModalText,
    setOpenModalText,
  } = useContext(TodoContext);
  const [dataUser, setDataUser] = useState(null);

  
  useEffect(() => {
    async function fetchData(user,access, refresh) {
      const { dataUser, successUser, messageUser } = await GetUser(user, access, refresh);
      setDataUser(dataUser);
      console.log("data", dataUser);
      console.log("success", successUser);  
      console.log("message", messageUser);  
      if (successUser) {
        setDataUser(dataUser);
      }

    }

    const user = getCookieValue("user");
    console.log("user", user);
    const refreshToken = getCookieValue("refresh");
    console.log("refresh", refreshToken);
    const accessToken = getCookieValue("access");
    console.log("access", accessToken);
    fetchData(user, accessToken, refreshToken);
    

  } 
  , []);


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {dataUser && dataUser.groups[0] === "Administrador" ? (
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[100],
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" >
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
        </Container>

        {openModalCreate && (
          <ModalUser mode={"CREAR"}>
            La funcionalidad de agregar TODO
          </ModalUser>
        )}
        {openModalEdit && (
          <ModalUser mode={"EDITAR"}>
            La funcionalidad de editar TODO
          </ModalUser>
        )}
        {openModalDelete && (
          <ModalUser mode={"BORRAR"}>
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
      </Box>
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

export { MenuUser };
