import React, { useState, useEffect, useContext } from "react";
import "../../styles/user/MenuUser.css";
import { TodoContext } from "../../context/index.js";
import { ModalUser } from "./ModalUser.js";
import UserTable from "../../components/Table";
import CUDButtons from "../../containers/CUDButtons";
import BarsChart from "../../components/BarsChart";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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

function MenuUser() {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const defaultTheme = createTheme();
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const [datos, setDatos] = useState([]);
  const {
    textOpenModalText,
    totalListlUsers,
    openModalCreate,
    setOpenModalCreate,
    setOpenModalEdit,
    openModalEdit,
    setOpenModalDelete,
    openModalDelete,
    openModalText,
    setOpenModalText,
  } = useContext(TodoContext);

  useEffect(() => {
    setDatos(totalListlUsers);
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            flexGrow: 1,
            height: "100vh",
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
      </Box>
    </ThemeProvider>
  );
}

export { MenuUser };
