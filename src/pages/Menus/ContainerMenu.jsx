import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import DonorReportsTable from "../../components/boards/DonorReportsTable";
import { useState, useEffect, useContext } from "react";
import getDonorReports from "../../services/getDornorReports";
import getAllCollectionCenters from "../../services/getAllCollectionCenters";
import useAuth from "../../hooks/useAuth";
import { TodoContext } from "../../context";
import axios from "axios";

export default function ContainerMenu() {
  const [donorReports, setDonorReports] = useState([]);
  const { updateDonorReports, setUpdateDonorReports } = useContext(TodoContext);
  const dataUser = useAuth();

  // Centros
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(() => {
    return localStorage.getItem("selectedCenter") || "";
  });
  const [openDialog, setOpenDialog] = useState(() => {
    return !localStorage.getItem("selectedCenter");
  });
  const [loadingCenters, setLoadingCenters] = useState(false);

  // Cargar centros cuando se abre el diálogo
  useEffect(() => {
    if (openDialog) {
      setLoadingCenters(true);
      getAllCollectionCenters()
        .then((data) => {
          setCenters(data);
          setLoadingCenters(false);
        })
        .catch(() => setLoadingCenters(false));
    }
  }, [openDialog]);

  // Guardar selección y actualizar en backend
  const handleSelectCenter = async () => {
    if (selectedCenter) {
      localStorage.setItem("selectedCenter", selectedCenter);
      setOpenDialog(false);
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/change-center-for-user/`,
          {
            user: dataUser.email,
            collection_center_id: selectedCenter,
          }
        );
      } catch (err) {
        console.error("Error al cambiar centro:", err);
      }
    }
  };

  // Cargar reportes cuando ya tenemos centro y usuario
  useEffect(() => {
    if (!selectedCenter || !dataUser) return;

    getDonorReports(dataUser.email)
      .then((data) => {
        setDonorReports(data);
      })
      .catch((err) => {
        console.error("Error al cargar reportes:", err);
      });
  }, [updateDonorReports, dataUser, selectedCenter]);

  return (
    <>
      <Dialog open={openDialog} disableEscapeKeyDown>
        <DialogTitle>Selecciona tu Centro de Acopio</DialogTitle>
        <DialogContent>
          {loadingCenters ? (
            <CircularProgress />
          ) : (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-center-label">Centro de Acopio</InputLabel>
              <Select
                labelId="select-center-label"
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
              >
                {centers.map((center) => (
                  <MenuItem
                    key={center.CollectionCenterId}
                    value={center.CollectionCenterId}
                  >
                    {center.CollectionCenterName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSelectCenter}
            disabled={!selectedCenter}
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {selectedCenter && (
        <Container
          maxWidth={false}
          sx={{ flexGrow: 1, overflow: "auto", py: 3 }}
        >
          <DonorReportsTable
            data={donorReports}
            setUpdateDonorReports={setUpdateDonorReports}
          />
        </Container>
      )}
    </>
  );
}
