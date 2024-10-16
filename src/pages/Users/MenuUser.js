import React, { useContext, useEffect , useState} from "react";
import "../../styles/user/MenuUser.css";
import { TodoContext } from "../../context/index.js";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Title from "../../components/Title";
import useAuth from "../../hooks/useAuth.js";
import axios from "axios";
import UserInfoTable from "../../components/boards/UsersInfoTable.jsx";

function MenuUser() {

  const {
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
