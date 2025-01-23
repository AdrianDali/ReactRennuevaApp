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

  useEffect(() => {
    if(!dataUser) return;
    console.log("datos del usuario")
    console.log(dataUser);
    console.log("Se actualizó el Peso total a: ", pesoTotal);
    if (pesoTotal === 0) return;
    let porcent = dataUser.collection_center_alert_porcent ? dataUser.collection_center_alert_porcent : 80;
    const regla = (dataUser?.collection_center_kg_max * porcent) 

    console.log("Multiplicacion Regla 3: ", regla);
    console.log("Division: ", regla / 100 );

    if (pesoTotal >= dataUser?.collection_center_kg_max) {
      console.log("######### Se ha llegado al peso total #########");
      const reqBody = {
        "user": dataUser.user,
        "peso_estimado": pesoTotal,
        "hora_preferente_recoleccion": "14:30:00"
      }
      axios.post(`${process.env.REACT_APP_API_URL}/create-center-recollection/`, reqBody).then((response) => {
        console.log("Solicitud de recolección par centro creada");
        console.log(response.data)
      }).catch((error) => {
        console.log("Hubo un error al crear la solicitud de recolección para centro");
      })
    } else {
      console.log("No se ha llegado al peso total");
    }
  }, [pesoTotal]);

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
        console.log("datos de los reportes");
        console.log(response.data);
        setReports(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    if (reports.length === 0) return;
    let total = 0;
    reports.forEach((report) => {
      const reqBody = { reportId: report.id_report ? report.id_report : report.id };
      axios.post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, reqBody)
        .then(response => {
          const data = response.data;
          data.forEach((residue, index) => {
            total += residue.peso;
            if (index === data.length - 1) setPesoTotal(total);
          });
        })
        .catch(error => {
          console.error('Hubo un problema al obtener los residuos:', error);
        });
    });
  }, [updateReportInfo, dataUser]);

  useEffect(() => {

  }, [reports])

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
