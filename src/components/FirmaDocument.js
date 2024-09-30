import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import './Signature.css'; // Estilos para el canvas
import { Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const SignatureComponent = ({ id, type }) => {
  const [imageURL, setImageURL] = useState(null); // para guardar la imagen de la firma
  const sigCanvas = useRef({}); // referencia al componente SignaturePad

  // Para limpiar el área de firma
  const clear = () => sigCanvas.current.clear();

  // Para guardar la imagen y posiblemente hacer algo más con ella (por ejemplo, enviarla a un servidor)
  const save = async () => {
    let url = "";
    if (type === "Receptor") {
      url = `${process.env.REACT_APP_API_URL}/update-report-admin-receptor-signature/`;
    } else if (type === "Donador") {
      url = `${process.env.REACT_APP_API_URL}/update-report-generator-signature/`;
    } else if (type === "Recolector" || type === "Conductor") {
      url = `${process.env.REACT_APP_API_URL}/update-report-receptor-signature/`;
    } else if (type === "Generador") {
      url = `${process.env.REACT_APP_API_URL}/update-report-generator-signature/`;
    }else if (type === "Donor") {
      url = `${process.env.REACT_APP_API_URL}/update-report-donor-signature/`;
    }

    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));

    try {
      let data;

      if (type === "Receptor" || type === "Generador") {
        data = {
          reportId: id,
          reportGeneratorSignature: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
        };
      } else if (type === "Donador" || type === "Recolector") {
        data = {
          reportId: id,
          reportGeneratorSignature: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
        }
      }else if (type === "Donor" || type === "Conductor") {
        data = {
          reportId: id,
          recollectionFirm: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
        }
      }

      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.log(error)
      throw error;
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>{`Firma del ${type}`}</Typography>
      <SignaturePad
        ref={sigCanvas}
        canvasProps={{
          className: 'signatureCanvas' // clase para el estilo CSS si lo necesitas
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={clear} sx={{ flexGrow: 1, mr: 1 }}>
          Limpiar
        </Button>
        <Button variant="contained" onClick={save} sx={{ flexGrow: 1, ml: 1 }}>
          Guardar
        </Button>
      </Box>

      {imageURL && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Tu firma:</Typography>
          <img width="100%" src={imageURL} alt="Tu firma" />
        </Box>
      )}
    </Box>
  );
};

export default SignatureComponent;
