import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import CentroStatusReportsTable from "../../components/boards/CentroStatusReportsTable";
import LoadingComponent from "./LoadingComponent";


export function MenuStatusFolio() {
  const [collectedReports, setCollectedReports] = useState([]);
  const { updateReportInfo} = useContext(TodoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-collected-reports/`)
      .then((response) => {
        setCollectedReports(response.data);
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
  }, [updateReportInfo]);


  return (
    loading ? <LoadingComponent/> :
    <Container
      maxWidth={false}
      sx={{
        flexGrow: 1,
        overflow: "auto",
        py: 3,
        height: "100%",
      }}
    > 
    <CentroStatusReportsTable data={collectedReports} />
     
     
    </Container>
  );
}
