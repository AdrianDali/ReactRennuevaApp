import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const MenuResetPass = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSeverity, setModalSeverity] = useState("success");
  const navigate = useNavigate();
  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setModalMessage("Las contraseñas no coinciden");
      setModalSeverity("error");
      setModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/password-reset/`,
        {
          uidb64,
          token,
          new_password: newPassword,
        }
      );
      setModalMessage(response.data.detail);
      setModalSeverity("success");
      setModalOpen(true);
    } catch (error) {
      setModalMessage(error.response.data.detail);
      setModalSeverity("error");
      setModalOpen(true);
    }
    setLoading(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/login");
    
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Paper elevation={3} style={{ padding: "2rem", width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Nueva Contraseña
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nueva Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
              disabled={loading}
              variant="outlined"
            />
            <TextField
              label="Confirmar Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              disabled={loading}
              variant="outlined"
            />
            <Box display="flex" justifyContent="center" marginTop="1rem">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : "Enviar"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
      >
        <DialogTitle>{modalSeverity === 'success' ? 'Contraseña Restablecida con exito, vuelve a iniciar sesion ' : 'Error'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {modalMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MenuResetPass;
