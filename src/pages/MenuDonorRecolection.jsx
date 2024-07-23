
import {
  Box
} from "@mui/material";
import Title from "../components/Title.js";
import ModalDonor from "./ModalDonor.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import useAuth from "../hooks/useAuth.js";
import DonorRecollectionsTable from "../components/boards/DonorRecollectionsTable.jsx";
import { Container } from "@mui/material";
import { TodoContext } from "../context/index.js"
import { useState, useContext, useEffect } from "react";
import axios from "axios";

export default function MenuDonorRecolection() {
  const {
    openModalCreateDonor,
    openModalEditDonor,
    openModalDeleteDonor,
    openModalText,
    setOpenModalText,
    textOpenModalText,
    updateDonorInfo
  } = useContext(TodoContext);

  const [donorRequests, setDonorRequests] = useState([]);

  // ... otros handlers y useEffect ...
  const dataUser = useAuth();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-donors-recollection/`)
      .then(response => {
        console.log(response.data.ordenes);
        setDonorRequests(response.data.ordenes);
      })
      .catch(error => {
        //console.error(error);
      });
  }, [updateDonorInfo]);


  return (
    <>
      {dataUser && (dataUser.groups[0] === "Administrador" || dataUser.groups[0] === "Comunicacion" || dataUser.groups[0] === "Logistica" || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Produccion" || dataUser.groups[0] === "Registro") ? (
        <Container
          maxWidth={false}
          sx={{
            flexGrow: 1,
            overflow: "auto",
            py: 3,
            height: "100%",
          }}
        >
          <DonorRecollectionsTable data={donorRequests} />

          
          {openModalEditDonor && (
            <ModalDonor mode={"EDITAR"}>
              La funcionalidad de editar TODO
            </ModalDonor>
          )}
          {openModalDeleteDonor && (
            <ModalDonor mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ModalDonor>
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


