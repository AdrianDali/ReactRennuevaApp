import ReportsTable from "../../components/boards/AssignedReportsTable";
import { Container } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

export function ReportsAssignedRecyclingMenu() {
    const [reports, setReports] = useState([]);
    const { updateReportInfo, setUpdateReportInfo } = useContext(TodoContext);
    const userData = useAuth();
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
        if(userData === null) return;
        axios
            .post(`${process.env.REACT_APP_API_URL}/get-checker-report/`, {
                checker_username: userData?.user
            })
            .then((response) => {
                console.log(response.data);
                setReports(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [updateReportInfo, userData]);

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
            <ReportsTable data={reports} />

        </Container>
    );
}
