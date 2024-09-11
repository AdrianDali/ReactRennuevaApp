import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from "../context/index.js";
import {
  Box,
  Grid,
  Paper,
  Container,
  CssBaseline,
} from "@mui/material";
import Title from "../components/Title";
import CUDButtons from "../containers/CUDButtons";
import { ModalCarrier } from "./ModalCarrier.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CarrierTable from "../components/CarrierTable.jsx";
import BarsChartCarrier from "../components/graph/BarsCharCarrier.js";
import useAuth from "../hooks/useAuth.js";
import CarriersTable from "../components/boards/CarriersTable.jsx";
import axios from "axios";

function MenuCarrier() {
  const {
    openModalCreateCarrier,
    openModalEditCarrier,
    openModalDeleteCarrier,
    openModalText,
    setOpenModalText,
    textOpenModalText,
    updateCarrierInfo,
  } = useContext(TodoContext);
  const [carriers, setCarriers] = useState([]);
  const dataUsers = useAuth();

  useEffect(() => {
    axios
        .get(`${process.env.REACT_APP_API_URL}/get-all-carrier/`)
        .then(response => {
          console.log(response.data);
            setCarriers(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}, [updateCarrierInfo]);

  // ... otros handlers y useEffect ...

  return (
    <>
      <CssBaseline />
      {dataUsers && (dataUsers.groups[0] === "Administrador"  || dataUsers.groups[0] === "Calidad" || dataUsers.groups[0] === "Registro" ) ? (
        <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
          <CarriersTable data={carriers}/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  height: 580,
                }}
              >
                <BarsChartCarrier />
              </Paper>
            </Grid>
          </Grid>
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

export { MenuCarrier };
