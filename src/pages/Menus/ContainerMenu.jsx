import { Container } from "@mui/material"
import DonorReportsTable from "../../components/boards/DonorReportsTable"

export default function ContainerMenu(){
    const sampleData = [
        {
            "id_report": "12345",
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
    ]

    return(
        <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
            <DonorReportsTable data={sampleData}/>
        </Container>
    )
}