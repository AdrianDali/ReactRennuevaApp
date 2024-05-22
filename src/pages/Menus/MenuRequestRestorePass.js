import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const MenuRequestRestorePass = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSeverity, setModalSeverity] = useState('success');

  const navigate = useNavigate();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/Rennueva/password-reset-request/', { email });
      setLoading(false);
      if (response.status === 200) {
        setModalSeverity('success');
        setModalMessage('Se ha enviado un correo para restablecer la contraseña');
        //navigate('/login');
      } else {
        setModalSeverity('error');
        setModalMessage('No se pudo enviar el correo. Inténtelo de nuevo más tarde.');
      }
      setModalOpen(true);
    } catch (error) {
      setLoading(false);
      setModalSeverity('error');
      setModalMessage('Error enviando el correo');
      setModalOpen(true);
      console.error('Error enviando el correo', error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate('/login');
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
        <Paper elevation={3} style={{ padding: '2rem', width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Restablecer Contraseña
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Correo Electrónico"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading}
              variant="outlined"
            />
            <Box 
              display="flex" 
              justifyContent="center" 
              marginTop="1rem"
            >
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Enviar'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
      >
        <DialogTitle>{modalSeverity === 'success' ? 'Éxito' : 'Error'}</DialogTitle>
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

export default MenuRequestRestorePass;
