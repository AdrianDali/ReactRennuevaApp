import { Container, CircularProgress } from "@mui/material"

export default function LoadingComponent() {
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
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column"
            }}>
                <CircularProgress />
                <label style={{
                    textAlign: "center",
                    marginTop: "20px"
                }}>Cargando datos...</label>
            </div>

        </Container>
    )
}