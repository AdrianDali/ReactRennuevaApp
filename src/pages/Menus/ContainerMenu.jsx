import { Container } from "@mui/material"
import DonorReportsTable from "../../components/boards/DonorReportsTable"
import { useState, useEffect, createContext, useContext } from "react"
import getDonorReports from "../../services/getDornorReports"
import useAuth from "../../hooks/useAuth"
import { TodoContext } from "../../context"

export default function ContainerMenu() {
    const [donorReports, setDonorReports] = useState([])
    const { updateDonorReports, setUpdateDonorReports ,updateDonorReportsContext } = useContext(TodoContext)
    const dataUser = useAuth()

    useEffect(() => {
        if(dataUser === null) return
        getDonorReports(dataUser.email).then(data => {
            setDonorReports(data)
        })
        // Fetch donor reports
    }, [updateDonorReports, dataUser])


    return (
        <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
            <DonorReportsTable data={donorReports} setUpdateDonorReports={setUpdateDonorReports} />
        </Container>
    )
}