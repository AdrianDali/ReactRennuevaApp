import Title from "../components/Title.js";
import useAuth from "../hooks/useAuth.js";
import DonorRecollectionsTable from "../components/boards/DonorRecollectionsTable.jsx";
import { Container, Box, CircularProgress } from "@mui/material";
import { TodoContext } from "../context/index.js"
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import LoadingComponent from "./Menus/LoadingComponent.jsx";

export default function MenuDonorRecolection() {
  const {
    updateDonorInfo
  } = useContext(TodoContext);

  const [donorRequests, setDonorRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... otros handlers y useEffect ...
  const dataUser = useAuth();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-donors-recollection/`)
      .then(response => {
        setDonorRequests(response.data.ordenes);
        setLoading(false);
      })
      .catch(error => {
        //console.error(error);
      });
  }, [updateDonorInfo]);


  return (
    <>
      {dataUser && (dataUser.groups[0] === "Administrador" || dataUser.groups[0] === "Comunicacion" || dataUser.groups[0] === "Logistica" || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Produccion" || dataUser.groups[0] === "Registro") && !loading ? (
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
        </Container>
      ) : loading ? <LoadingComponent/>: (
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


