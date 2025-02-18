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
}, [dataUser]);

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

  Promise.all(requests).then((results) => {
    let total = 0;
    results.forEach((data) => {
      data.forEach((residue) => {
        total += residue.peso;
      });
    });
    setPesoTotal(total);
    console.log("Peso total calculado:", total);

    if (total === 0) return;

    // Se calcula el umbral de alerta según el porcentaje configurado (por defecto 80%)
    const alertPercent = dataUser.collection_center_alert_porcent || 80;
    const threshold = (dataUser.collection_center_kg_max * alertPercent) / 100;

    console.log("Porcentaje de alerta:", alertPercent);
    console.log("Peso máximo permitido:", dataUser.collection_center_kg_max);
    console.log("Umbral de alerta calculado:", threshold);

    // Si el peso total supera o alcanza el umbral, se crea la orden de recolección
    if (total >= threshold) {
      console.log("######### Se ha alcanzado el peso máximo permitido #########");
      const reqBody = {
        user: dataUser.user,
        peso_estimado: total,
        hora_preferente_recoleccion: "14:30:00"
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}/create-center-recollection/`, reqBody)
        .then((response) => {
          console.log("Solicitud de recolección para centro creada:");
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Hubo un error al crear la solicitud de recolección para centro:", error);
        });
    } else {
      console.log("No se ha alcanzado el peso máximo permitido");
    }
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
