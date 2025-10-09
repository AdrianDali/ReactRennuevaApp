import React from 'react';
import { Container, CircularProgress, Typography, Button, Box, useTheme, Fade } from '@mui/material';

/**
 * Enhanced Loading Component with customizable message, size, and optional cancel action.
 *
 * Props:
 *  - message: string to display below the spinner (default: 'Cargando datos...')
 *  - size: diameter of the spinner in pixels (default: 60)
 *  - onCancel: optional callback to render a "Cancel" button
 *  - sx: additional styling overrides for the root container
 */
export default function LoadingComponent({
  message = 'Cargando datos...',
  size = 60,
  onCancel,
  sx = {},
}) {
  const theme = useTheme();

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        py: 3,
        bgcolor: theme.palette.background.paper,
        ...sx,
      }}
    >
      <Fade in timeout={400}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={size} thickness={4} />
          <Typography variant="subtitle1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
            {message}
          </Typography>
          {onCancel && (
            <Box mt={2}>
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{ textTransform: 'none' }}
              >
                Cancelar
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
}
