import GeneratorTable from "../../components/GeneratorTable";
import GeneratorsTable from "../../components/boards/GeneratorsTable";
import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

export default function ExportsMenu() {
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { updateGeneratorInfo, setUpdateGeneratorInfo } = useContext(TodoContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-generator/`)
      .then(response => {
        setClientes(response.data);
        setUpdateGeneratorInfo(false);
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