import { Container } from "@mui/material"
import DonorReportsTable from "../../components/boards/DonorReportsTable"
import {useState, useEffect, createContext} from "react"
import getDonorReports from "../../services/getDornorReports"

export const ContainerMenuContext = createContext()

export default function ContainerMenu(){
    const [donorReports, setDonorReports] = useState([])
    const [updateDonorReports, setUpdateDonorReports] = useState(false)

    useEffect(() => {
        // Fetch donor reports
        const data = getDonorReports()
        setDonorReports(data)
    }, [updateDonorReports])

    const sampleData = [
        {
            "id_report": "12345",
            "email": "rodolfo@rennueva.com",
            "first_name": "Rodolfo",
            "last_name": "Domínguez Ríos",
            "phone": "5612603878",
            "recollection_address_street": "Main St",
            "recollection_address_num_int": "Apt 4B",
            "recollection_address_num_ext": "123",
            "recollection_address_locality": "Downtown",
            "recollection_address_city": "Example City",
            "recollection_address_state": "Example State",
            "recollection_address_postal_code": "12345",
            "recollection_signature": true,
            "donador_signature": true
          },
          {
            "id_report": "125",
            "email": "example@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "recollection_address_street": "Main St",
            "recollection_address_num_int": "Apt 4B",
            "recollection_address_num_ext": "123",
            "recollection_address_locality": "Downtown",
            "recollection_address_city": "Example City",
            "recollection_address_state": "Example State",
            "recollection_address_postal_code": "12345",
            "recollection_signature": true,
            "donador_signature": false
          },
          {
            "id_report": "12565",
            "email": "example@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "recollection_address_street": "Main St",
            "recollection_address_num_int": "Apt 4B",
            "recollection_address_num_ext": "123",
            "recollection_address_locality": "Downtown",
            "recollection_address_city": "Example City",
            "recollection_address_state": "Example State",
            "recollection_address_postal_code": "12345",
            "recollection_signature": true,
            "donador_signature": false
          },
          {
            "id_report": "12509",
            "email": "example@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "recollection_address_street": "Main St",
            "recollection_address_num_int": "Apt 4B",
            "recollection_address_num_ext": "123",
            "recollection_address_locality": "Downtown",
            "recollection_address_city": "Example City",
            "recollection_address_state": "Example State",
            "recollection_address_postal_code": "12345",
            "recollection_signature": true,
            "donador_signature": false
          },
          {
            "id_report": "125655",
            "email": "example@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "recollection_address_street": "Main St",
            "recollection_address_num_int": "Apt 4B",
            "recollection_address_num_ext": "123",
            "recollection_address_locality": "Downtown",
            "recollection_address_city": "Example City",
            "recollection_address_state": "Example State",
            "recollection_address_postal_code": "12345",
            "recollection_signature": true,
            "donador_signature": false
          },
          {
            "id_report": "125091",
            "email": "example@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "recollection_address_street": "Main St",
            "recollection_address_num_int": "Apt 4B",
            "recollection_address_num_ext": "123",
            "recollection_address_locality": "Downtown",
            "recollection_address_city": "Example City",
            "recollection_address_state": "Example State",
            "recollection_address_postal_code": "12345",
            "recollection_signature": true,
            "donador_signature": false
          }
    ]

    return(
        <ContainerMenuContext.Provider value={{setUpdateDonorReports}}>
        <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
            <DonorReportsTable data={sampleData}/>
        </Container>
        </ContainerMenuContext.Provider>
    )
}