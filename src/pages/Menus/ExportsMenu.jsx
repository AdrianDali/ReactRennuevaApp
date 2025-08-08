import GeneratorsTable from "../../components/boards/GeneratorsTable";
import { Container} from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import LoadingComponent from "./LoadingComponent";

export default function ExportsMenu() {
  const [clientes, setClientes] = useState([]);
  const { updateGeneratorInfo} = useContext(TodoContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-generator/`) // Se guarda en la variable url la URL de la API
      .then(response => {
        console.log(response.data);
        setClientes(response.data);
      })
      .catch(error => {
        console.error(error);
      }).finally(() => {
        setLoading(false);
      });
  }, [updateGeneratorInfo]);

  
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
      <GeneratorsTable data={clientes}/>
    </Container>
  );
}