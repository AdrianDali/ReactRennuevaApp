// PersistentAlert.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Alert, IconButton, Collapse, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * PersistentAlert
 *
 * Muestra un banner fijo en la parte superior-centro
 * que permanece visible hasta que el usuario haga clic en el tache.
 *
 * Props:
 *  - open       (bool): si el banner está visible.
 *  - type       (string): “success” u “error”.
 *  - message    (string): texto a mostrar en el banner.
 *  - onClose    (func): callback que se ejecuta al pulsar el tache.
 */
export function PersistentAlert({ open, type, message, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const severity = type === 'success' ? 'success' : 'error';

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        variant="filled"
        action={
          <IconButton
            size={isMobile ? 'small' : 'medium'}
            aria-label="cerrar alerta"
            color="inherit"
            onClick={onClose}
            sx={{
              padding: isMobile ? 0.5 : 1,
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        }
        sx={{
          position: 'fixed',
          top: isMobile ? 8 : 16,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: isMobile ? '90%' : '600px',
          width: '100%',
          zIndex: theme.zIndex.snackbar + 1,
          borderRadius: 2,
          boxShadow: theme.shadows[4],
          fontSize: isMobile ? '0.9rem' : '1rem',
          py: isMobile ? 1 : 1.5,
          px: isMobile ? 2 : 3,
        }}
      >
        {message}
      </Alert>
    </Collapse>
  );
}

PersistentAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
