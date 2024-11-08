import ReportsTable from "../components/boards/ReportsTable";
import { Container } from "@mui/material";
import { TodoContext } from "../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import LoadingComponent from "./Menus/LoadingComponent";
export function MenuReport() {
  const [reports, setReports] = useState([]);
  const { updateReportInfo, setUpdateReportInfo } = useContext(TodoContext);
  const[loading, setLoading] = useState(true);

  

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-reports/`)
      .then((response) => {
        console.log(response.data);
        setReports(response.data);
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
      
      
      {/* <FinishReportsTable data={reportsFinish} /> */}
      <ReportsTable data={reports} />
     
    </Container>
  );
}
