import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const MenuRequestRestorePass = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
        setSnackbarSeverity('success');
        setSnackbarMessage('Se ha enviado un correo para restablecer la contraseña');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('No se pudo enviar el correo. Inténtelo de nuevo más tarde.');
      }
      setSnackbarOpen(true);
    } catch (error) {
      setLoading(false);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error enviando el correo');
      setSnackbarOpen(true);
      console.error('Error enviando el correo', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MenuRequestRestorePass;
