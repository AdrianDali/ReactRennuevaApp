import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import FinishReportsTable from "../../components/boards/FinishReportsTable";
import CUDButtons from "../../containers/CUDButtons";
import LoadingComponent from "./LoadingComponent";

export function MenuReportHistory() {
  const { updateReportInfo, setUpdateReportInfo } = useContext(TodoContext);
  const [loading, setLoading] = useState(true);

  const [reportsFinish, setReportsFinish] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-reports-finish/`, {
        params: {
          page: page + 1, // DRF usa base 1
          page_size: rowsPerPage,
        },
      })
      .then((response) => {
        setReportsFinish(response.data.results);
        setCount(response.data.count);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [updateReportInfo, page, rowsPerPage]);

  return loading ? (
    <LoadingComponent />
  ) : (
    <Container
      maxWidth={false}
      sx={{
        flexGrow: 1,
        overflow: "auto",
        py: 3,
        height: "100%",
      }}
    >
      <FinishReportsTable
        data={reportsFinish}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
    </Container>
  );
}
