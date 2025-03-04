import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import DriverCenterAssignedTable from "../../components/boards/DriverCenterAssignedTable";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
//import useAuth from "../../hooks/useAuth";

export default function MenuAssignedAcopioOrders() {

  //const dataUser = useAuth();
  const [reports, setReports] = useState([]);
  const { updateReportInfo, setUpdateReportInfo } = useContext(TodoContext);
  const[loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [auxClientes, setAuxClientes] = useState([]);
  const [correoCliente, setCorreoCliente] = useState([]);
  const [updateDonorInfo, setUpdateDonorInfo] = useState(true);
  const [orderRecollection, setOrderRecollection] = useState([]);


  // console.log("dataUser", dataUser);


    useEffect(() => {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-centers-orders-assigned-to-driver/`,
          {
            user: "newConductor@mailinator.com",
            status: "pendienteRecoleccion",
          }
        )
        .then((response) => {
          console.log("Órdenes asignadas:", response.data);
          setOrderRecollection(response.data.ordenes);
          setAuxClientes(response.data.ordenes);
          const cli = response.data.ordenes.map((cliente) => {
            return { email: cliente.correo_donador };
          });
          setCorreoCliente(cli);
          setUpdateDonorInfo(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [updateDonorInfo]);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/get-all-reports/`)
  //     .then((response) => {
  //       console.log(response.data);
  //       setReports(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     }).finally(() => {
  //       setLoading(false);
  //     });
  // }, [updateReportInfo]);

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
      <DriverCenterAssignedTable data = {orderRecollection} />
    </Container>
  );
}