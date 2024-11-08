import { Container, Grid, Paper, CssBaseline } from "@mui/material";
import DriverCenterAssignedTable from "../../components/boards/DriverCenterAssignedTable";

export default function MenuAssignedAcopioOrders() {

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