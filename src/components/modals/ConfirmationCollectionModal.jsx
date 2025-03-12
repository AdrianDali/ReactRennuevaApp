import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ConfirmationCollectionModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "400px",
          backgroundColor: "white",
          borderRadius: "25px",
          boxShadow: 24,
          p: 4,
          mx: "auto",
          my: "20%",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          ¿Seguro que quieres cambiar el estado de esta recolección a "Recolectado"?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Después de esto, no podrás modificar el estado de esta recolección. Las órdenes sin estado se moverán a "No Recolectadas".
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="success" onClick={onConfirm}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationCollectionModal;
