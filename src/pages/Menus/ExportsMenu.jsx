import GeneratorTable from "../../components/GeneratorTable";
import GeneratorsTable from "../../components/boards/GeneratorsTable";
import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
//import ReportsTable from "../../components/boards/ReportsTable";

export default function ExportsMenu() {
  const [clientes, setClientes] = useState([]);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { updateGeneratorInfo,
          setUpdateGeneratorInfo, 
          updateReportInfo, 
          setUpdateReportInfo } = useContext(TodoContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-generator/`)
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [updateGeneratorInfo]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-reports/`)
      .then((response) => {
        setReports(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [updateReportInfo]);
  
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
      <GeneratorsTable data={clientes}/>
      {/*<ReportsTable data={reports}/>*/}
    </Container>
  );
}