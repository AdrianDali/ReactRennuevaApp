import React, { useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { TodoContext } from "../../context"; 

function FinishVerificationDialog({ onFinish }) {
  const { openFinishVerificationModal, setOpenFinishVerificationModal } = useContext(TodoContext);

  const handleClose = () => {
    setOpenFinishVerificationModal(false);
  };

  const handleFinish = () => {
    console.log("Finalizando verificación del reporte");
    
    if (onFinish) onFinish(); // Llama la función que finaliza el proceso
    setOpenFinishVerificationModal(false);
  };

  return (
    <Dialog
      open={openFinishVerificationModal}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        ¿Seguro que quieres terminar la verificación de este reporte?
      </DialogTitle>
      <DialogContent>
        <Typography align="center" color="textSecondary">
          Esta acción <b>no se podrá regresar</b>.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleFinish}
          variant="contained"
          color="success"
        >
          Finalizar
        </Button>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FinishVerificationDialog;
