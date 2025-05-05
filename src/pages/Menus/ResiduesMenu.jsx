import ResiduesReportsTable from "../../components/boards/ResiduesReportsTable";
import { Container } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

export default function ResiduesMenu() {
  const [reports, setReports] = useState([]);
  const { updateReportInfo, setUpdateReportInfo } = useContext(TodoContext);
  const dataUser = useAuth();
  const [pesoTotal, setPesoTotal] = useState(0);

  // useEffect(() => {
  //   if (!dataUser) return;
  //   console.log("datos del usuario");
  //   console.log(dataUser);
  // }, []);


  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/get-all-reports-finish/`)
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, [updateReportInfo]);
  

  // 1. Efecto para obtener los reportes del contenedor del donante
useEffect(() => {
  if (!dataUser) return;
  axios
    .post(`${process.env.REACT_APP_API_URL}/get-all-donor-reports-user-container/`, {
      creator_user: dataUser.user
    })
    .then((response) => {
      console.log("Datos de los reportes:");
      console.log(response.data);
      setReports(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, [dataUser,updateReportInfo]);

// 2. Efecto para obtener residuos, calcular el peso total y crear la orden
useEffect(() => {
  // Este efecto se ejecutará cuando updateReportInfo se dispare.
  // Verificamos que existan dataUser y reportes antes de proceder.
  if (!dataUser || reports.length === 0) return;

  // Para cada reporte, se obtienen los residuos asociados y se acumula el peso total
  const requests = reports.map((report) => {
    const reqBody = { reportId: report.id_report ? report.id_report : report.id };
    return axios
      .post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, reqBody)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Hubo un problema al obtener los residuos:", error);
        return [];
      });
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


      {/* <FinishReportsTable data={reportsFinish} /> */}
      <ResiduesReportsTable data={reports} />

    </Container>
  );
}
