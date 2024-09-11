import ResiduesReportsTable from "../../components/boards/ResiduesReportsTable";
import { Container} from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

export default function ResiduesMenu() {
  const [reports, setReports] = useState([]);
  const { updateReportInfo, setUpdateReportInfo } = useContext(TodoContext);
  const dataUser = useAuth();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-reports-finish/`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [updateReportInfo]);

  useEffect(() => {
    if (!dataUser) return;
    axios
      .post(`${process.env.REACT_APP_API_URL}/get-all-donor-reports-user-container/`, {
        creator_user: dataUser.user
      })
      .then((response) => {
        console.log(response.data);
        setReports(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [updateReportInfo, dataUser]);

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
      
      
      {/* <FinishReportsTable data={reportsFinish} /> */}
      <ResiduesReportsTable data={reports} />
     
    </Container>
  );
}
