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
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { updateGeneratorInfo,
          setUpdateGeneratorInfo, 
          updateReportInfo, 
          setUpdateReportInfo } = useContext(TodoContext);
  const [drivers , setDrivers] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [successUser, setSuccessUser] = useState(false);
  const [messageUser, setMessageUser] = useState(null);
  //const { auth } = useAuth();

  

  useEffect(() => {
    const fetchData = async () => {
      const { dataUser, successUser, messageUser } = await GetDriverOrderRecollection();
      console.log(dataUser);
      console.log(successUser);
      console.log(messageUser);
      setDataUser(dataUser);
      setSuccessUser(successUser);
      setMessageUser(messageUser);
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