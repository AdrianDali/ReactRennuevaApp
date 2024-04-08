import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  // Genera la fecha actual
  const today = new Date();
  
  // Formatea la fecha como "DD MMMM, YYYY". Puedes ajustar el formato según tus necesidades.
  const formattedDate = today.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <React.Fragment>
      <Title>Total Plastico Reciclado</Title>
      <Typography component="p" variant="h4">
        000 Kg
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {formattedDate}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Residuos
        </Link>
      </div>
    </React.Fragment>
  );
}