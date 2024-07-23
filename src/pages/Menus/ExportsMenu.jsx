import GeneratorsTable from "../../components/boards/GeneratorsTable";
import { Container} from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

export default function ExportsMenu() {
  const [clientes, setClientes] = useState([]);
  const { updateGeneratorInfo} = useContext(TodoContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-generator/`)
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [updateGeneratorInfo]);

  
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
      <GeneratorsTable data={clientes}/>
    </Container>
  );
}