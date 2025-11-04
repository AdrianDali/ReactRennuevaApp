// src/components/modals/assignModal.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Title from "../Title";
import { set } from "date-fns";
import NotificationModal from "./NotificationModal";
import { ca } from "date-fns/locale";

export default function AssignModal({ setOpen, isOpen, center }) {
  const [folios, setFolios] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [folio, setFolio] = useState("");
  const [openNotification, setOpenNotification] = useState(false);
  const [success, setSuccess] = useState(false);
  const [centerName, setCenterName] = useState("");
  const [orderId, setIdOrderId] = useState("");


  const handleAssign = () => {
    console.log("assign");
    console.log(user);
    console.log(orderId);
    if (user === "" || folio === "") return;
    const data = {
      orderId: orderId,
      checker: user,
    };

    fetch(`${process.env.REACT_APP_API_URL}/assign-checker/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          //console.log('assigned');
          setSuccess(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setSuccess(false);
      })
      .finally(() => {
        setOpenNotification(true);
        closeModal();
      });
  };

  useEffect(() => {
    if (isOpen) {
      const fetchFolios = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/get-folios-recollected/`
          );
          console.log(response);
          const data = await response.json();
          console.log(data);
          setFolios(data);
        } catch (error) {
          console.log(error);
          setFolios([]);
        }
      };

      fetchFolios();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchUsers = async () => {
      if (center === "") return;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/get-all-user-recycling-center/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recycling_center_name: center,
            }),
          }
        );
        const data = await response.json();
        if (data.message) {
          throw new Error(data.message);
        }
        setUsers(data);
      } catch (error) {
        console.log(error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [isOpen, center]);

  const closeModal = () => {
    setOpen(false);
  };

  const toNum = (v) => {
    const m = String(v ?? "").match(/\d+/); // toma la parte numérica
    const n = Number(m ? m[0] : NaN);
    return Number.isFinite(n) ? n : Infinity; // los no numéricos quedan al final
  };

  const sortedFolios = useMemo(() => {
    return [...folios].sort((a, b) => toNum(a.RecollectionId) - toNum(b.RecollectionId));
  }, [folios]);

  return (
    <>
      <Modal open={isOpen} onClose={closeModal}>
        <Box
          className="ModalContent"
          sx={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "80dvh",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={closeModal}
            sx={{ position: "absolute", right: 2, top: 2 }}
          >
            <Close />
          </IconButton>
          <Title>Asignar</Title>
          <FormControl fullWidth margin="dense">
            <InputLabel id="select-report-label">Folio</InputLabel>
            <Select
              labelId="select-report-label"
              id="select-report"
              label="Folio"
              onChange={(e) => {
                const selected = e.target.value; // objeto folio
                setFolio(selected.RecollectionId);
                const center =
                  selected.reports?.[0]?.CollectionCenter ??
                  selected.reports?.[0]?.RecyclingCenter ??
                  "Sin centro asignado";
                setCenterName(center);
                setIdOrderId(selected.RecollectionId);
                console.log(center);
              }}
            >
              {sortedFolios.map((folio) => {
                const center =
                  folio.reports?.[0]?.CollectionCenter ??
                  folio.reports?.[0]?.RecyclingCenter ??
                  "Sin centro asignado";
                return (
                  <MenuItem key={folio.RecollectionId} value={folio}>
                    {folio.RecollectionId} — {center} — {folio.RecollectionDate}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="select-user-label">Usuario</InputLabel>
            <Select
              labelId="select-user-label"
              id="select-user"
              label="Usuario"
              onChange={(e) => setUser(e.target.value.email)}
            >
              {users.length === 0 ? (
                <MenuItem disabled>No hay usuarios</MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user.email} value={user}>
                    {user.email}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleAssign}
          >
            Asignar
          </Button>
        </Box>
      </Modal>
      <NotificationModal
        isOpen={openNotification}
        setOpen={setOpenNotification}
        title={success ? "Operación exitosa" : "Ocurrió un error"}
        severity={success ? "success" : "error"}
      >
        {success
          ? "El folio se asignó correctamente"
          : "Ocurrió un error al asignar el folio"}
      </NotificationModal>
    </>
  );
}
