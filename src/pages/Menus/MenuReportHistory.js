import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import FinishReportsTable from "../../components/boards/FinishReportsTable";
import CUDButtons from "../../containers/CUDButtons";
import LoadingComponent from "./LoadingComponent";

export function MenuReportHistory() {
  const [reportsFinish, setReportsFinish] = useState([]);
  const { updateReportInfo, setUpdateReportInfo } = useContext(TodoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-reports-finish/`)
      .then((response) => {
        //console.log(response.data);
        setReportsFinish(response.data);
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
    <FinishReportsTable data={reportsFinish} />
     
     
    </Container>
  );
}
