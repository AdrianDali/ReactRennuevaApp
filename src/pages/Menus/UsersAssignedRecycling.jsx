import ReportsTable from "../../components/boards/AssignedReportsTable";
import { Container } from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import LoadingComponent from "./LoadingComponent";
import UsersReportsAssignedRecyclingTable from "../../components/boards/UsersReportsAssignedRecyclingTable";

export function UsersReportsAssignedRecyclingMenu() {
    const [reports, setReports] = useState([]);
    const { updateReportInfo } = useContext(TodoContext);
    const userData = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(userData === null) return;
        axios
            .post(`${process.env.REACT_APP_API_URL}/get-single-order-totals/`, {
                checker_username: userData?.user
            })
            .then((response) => {
                console.log(response.data);
                setReports(response.data);
            })
            .catch((error) => {
                console.error(error);
            }).finally(() => {
                setLoading(false);
            });
    }, [updateReportInfo, userData]);

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


            <UsersReportsAssignedRecyclingTable data={reports} />


        </Container>
    );
}
