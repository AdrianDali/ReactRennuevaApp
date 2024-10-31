import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from '../context/index.js';
import axios from "axios";
import {

  Box,
  Grid,
  Paper,
  Container,

} from '@mui/material';
import Title from '../components/Title';
import ModalDonor from "./ModalDonor.js";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DonorsTable from "../components/boards/DonorsTable.jsx";
import BarsCharOrderRecollection from '../components/graph/BarsCharOrderRecollection';
import useAuth from "../hooks/useAuth.js";
import LoadingComponent from "./Menus/LoadingComponent.jsx";

export default function MenuDonor() {
  const {
    openModalCreateDonor,
    openModalEditDonor,
    openModalDeleteDonor,
    openModalText,
    setOpenModalText,
    textOpenModalText,
    updateDonorInfo,
  } = useContext(TodoContext);
  const [donors, setDonors] = useState([]);
  const dataUser = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-donors/`)
      .then(response => {
        setDonors(response.data);
      })
      .catch(error => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
  }, [updateDonorInfo]);


  return (
    <>
      {dataUser && (dataUser.groups[0] === "Administrador" || dataUser.groups[0] === "Comunicacion" || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Logistica" || dataUser.groups[0] === "Produccion" || dataUser.groups[0] === "Registro") && !loading ? (

        <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
          <DonorsTable data={donors} />
          <Grid container spacing={3}>
            <Grid item xs={12} >
              <Paper
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 580,
                }}
              >
                <BarsCharOrderRecollection />
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


