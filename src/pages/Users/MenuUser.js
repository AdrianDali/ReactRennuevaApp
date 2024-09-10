import React, { useContext, useEffect , useState} from "react";
import "../../styles/user/MenuUser.css";
import { TodoContext } from "../../context/index.js";
import { ModalUser } from "./ModalUser.js";
import UserTable from "../../components/Table";
import CUDButtons from "../../containers/CUDButtons";
import BarsChart from "../../components/BarsChart";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Title from "../../components/Title";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth.js";
import axios from "axios";
import UserInfoTable from "../../components/boards/UsersInfoTable.jsx";
import { set } from "date-fns";

function MenuUser() {

  const {
    textOpenModalText,
    openModalCreate,
    openModalEdit,
    openModalDelete,
    openModalText,
    setOpenModalText,
    updateUserInfo,
    setUpdateUserInfo,
  } = useContext(TodoContext);
  
  const dataUser = useAuth();
  console.log("dataUser", dataUser);
  const [donorRequests, setDonorRequests] = useState([]);
  const [centers, setCenters] = useState([]);
  const [recyclingCenters, setRecyclingCenters] = useState([]);
  const [collectionCenters, setCollectionCenters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users with group
        const usersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-users-with-group/`);
        setDonorRequests(usersResponse.data.users);
        // Fetch centers
        const centersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-centers/`);
        setCenters(centersResponse.data);

        const recyclingCenters = await axios.get(`${process.env.REACT_APP_API_URL}/new-get-all-recycling-center/`);
        console.log("recyclingCenters", recyclingCenters.data);
        setRecyclingCenters(recyclingCenters.data); 
        
        const collectionCenters = await axios.get(`${process.env.REACT_APP_API_URL}/new-get-all-collection-center/`);  
        console.log("collectionCenters", collectionCenters.data); 
        setCollectionCenters(collectionCenters.data);
        
        setUpdateUserInfo(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [updateUserInfo]);

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
          <UserInfoTable data={donorRequests} centers={centers} recyclingCenters={recyclingCenters} collectionCenters={collectionCenters} />  
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

export { MenuUser };
