import GeneratorTable from "../../components/GeneratorTable";
import GeneratorsTable from "../../components/boards/GeneratorsTable";
import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import ReportsTable from "../../components/boards/ReportsTable";
import GetDriverOrderRecollection from "../../services/ApiGetDriverOrderRecollection";
import DriverOrderAssignedTable from "../../components/boards/DriverOrderAssignedTable";

export default function MenuAssignedOrders() {
  //const [dataUser, setDataUser] = useState([]);
  const dataUser = useAuth();

  const [userInfo, setUserInfo] = useState([]);
  

  useEffect(() => {
    console.log("dataUser", dataUser);
    
    const fetchData = async () => {
      const { dataUser } = await GetDriverOrderRecollection();
      setUserInfo(dataUser);
    };
    fetchData();
  }
  , []);

  
  return (
    <Container
      maxWidth={false}
      sx={{
        flexGrow: 1,
        overflow: "auto",
        py: 3,
        height: "100%",
      }}
    >
      <DriverOrderAssignedTable data={dataUser} />
    </Container>
  );
}