
import React, { useContext, useState, useEffect } from "react";
import { TodoContext } from "../context/index.js";
import { ModalUser } from "./Users/ModalUser.js";
import ResidueTable from "../components/ResidueTable.jsx";
import BarsChartVehicle from "../components/BarsChartVehicle.js";
import {
  ThemeProvider,
  createTheme,
  Box,
  Grid,
  Paper,
  Container,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import Title from "../components/Title.js";
import CUDButtons from "../containers/CUDButtons.jsx";
import  ModalDriver  from "./ModalDriver.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DriverTable from "../components/DriverTable.js";
import BarsChartCarrier from "../components/graph/BarsCharCarrier.js";
import DriversTable from "../components/boards/DriversTable.jsx";
import useAuth from "../hooks/useAuth.js";
import axios from "axios";
import LoadingComponent from "./Menus/LoadingComponent.jsx";

function MenuDriver() {
  const {
    openModalText,
    setOpenModalText,
    textOpenModalText,
    updateDriverInfo, 
  } = useContext(TodoContext);

  const dataUser = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-drivers/`)
      .then(response => {
        setDrivers(response.data);
      })
      .catch(error => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
  }, [updateDriverInfo]);


  return (
    <>
      <CssBaseline />
      {dataUser && (dataUser.groups[0] === "Administrador"  || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Registro" ) && !loading ? (
        <Container
          maxWidth={false}
          sx={{ flexGrow: 1, overflow: "auto", py: 3 }}
        >
          <DriversTable data={drivers}/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  height: 580,
                }}l
              >
                <BarsChartCarrier />
              </Paper>
            </Grid>
          </Grid>
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

export { MenuDriver };
