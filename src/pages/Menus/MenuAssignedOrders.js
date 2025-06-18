import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import DriverCenterAssignedTable from "../../components/boards/DriverCenterAssignedTable";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
//import useAuth from "../../hooks/useAuth";
 
import getCookieValue from "../../services/GetCookie"; 
import ReportInfoDonor from "../../components/boards/ReportInfoDonor";


export default function MenuAssignedOrders() {

  
  const [reports, setReports] = useState([]);
  const { updateReportInfo, setUpdateReportInfo, updStatusResiduesGeneric,setUpdStatusResiduesGeneric } = useContext(TodoContext);
  const[loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [auxClientes, setAuxClientes] = useState([]);
  const [correoCliente, setCorreoCliente] = useState([]);
  const [updateDonorInfo, setUpdateDonorInfo] = useState(true);
  const [orderRecollection, setOrderRecollection] = useState([]);

  const user = getCookieValue("user");

    useEffect(() => {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-pickup-orders-assigned-to-driver/`,
          {
            user: user,
            status: "pendienteRecoleccion",
          }
        )
        .then((response) => {
          console.log("Órdenes asignadas:", response.data);
          setOrderRecollection(response.data);
          setAuxClientes(response.data);
          const cli = response.data.map((cliente) => {
            return { email: cliente.correo_donador };
          });
          setCorreoCliente(cli);
          setUpdateDonorInfo(false);
          setUpdStatusResiduesGeneric(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [updateDonorInfo, updStatusResiduesGeneric]);

  return (
    <Container
      maxWidth={false}
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        py: 3,
        height: '100%',
      }}
    >
      <ReportInfoDonor data = {orderRecollection} />
    </Container>
  );
}