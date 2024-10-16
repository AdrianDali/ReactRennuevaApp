import GeneratorTable from "../../components/GeneratorTable";
import GeneratorsTable from "../../components/boards/GeneratorsTable";
import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import ReportsTable from "../../components/boards/ReportsTable";
import GetDriverOrderRecollection from "../../services/ApiGetDriverOrderRecollection";
import DriverOrderAssignedTable from "../../components/boards/DriverOrderAssignedTable";
import DriverCenterAssignedTable from "../../components/boards/DriverCenterAssignedTable";

export default function MenuAssignedAcopioOrders() {
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { updateGeneratorInfo,
          setUpdateGeneratorInfo, 
          updateReportInfo, 
          setUpdateReportInfo } = useContext(TodoContext);
  const [drivers , setDrivers] = useState([]);
  const [dataUser, setDataUser] = useState();
  const [successUser, setSuccessUser] = useState(false);
  const [messageUser, setMessageUser] = useState(null);
  
    const [ordersAssigned, setOrdersAssigned] = useState([]);

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }

  //const { auth } = useAuth();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Primera petición
  //       const { dataUser, successUser, messageUser } = await GetDriverOrderRecollection();
  //       setDataUser(dataUser);
  //       setSuccessUser(successUser);
  //       setMessageUser(messageUser);

  //       // Verificar que dataUser tenga datos antes de continuar
  //       if (dataUser && dataUser.length > 0) {
  //         const donador = getCookie('user');

  //         // Segunda petición
  //         const response = await axios.post(
  //           `${process.env.REACT_APP_API_URL}/get-all-centers-orders-assigned-to-driver/`,
  //           {
  //             user: donador,
  //             status: 'pendienteRecoleccion',
  //           }
  //         );

  //         console.log('Órdenes asignadas:', response.data);
  //         setOrdersAssigned(response.data.ordenes); // Asegúrate de acceder a la propiedad correcta
  //       } else {
  //         console.error('No se pudo obtener el donador del dataUser.');
  //       }
  //     } catch (error) {
  //       console.error('Error al obtener los datos:', error);
  //     }
  //   };

  //   fetchData();
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
      <DriverCenterAssignedTable  />
    </Container>
  );
}