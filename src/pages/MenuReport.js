import ReportsTable from "../components/boards/ReportsTable";
import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import { TodoContext } from "../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

export function MenuReport() {
  const [clientes, setClientes] = useState([]);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { 
          updateReportInfo, 
          setUpdateReportInfo } = useContext(TodoContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-reports/`)
      .then((response) => {
        console.log(response.data);
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
      <ReportsTable data={reports}/>
    </Container>
  );
}