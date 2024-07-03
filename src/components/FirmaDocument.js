import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import './Signature.css'; // Estilos para el canvas si los necesitas
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
const SignatureComponent = ({id, type}) => {
  const [imageURL, setImageURL] = useState(null); // para guardar la imagen de la firma
  const sigCanvas = useRef({}); // referencia al componente SignaturePad
  console.log("firma en el signature component")
  console.log(id)
  // Para limpiar el área de firma
  const clear = () => sigCanvas.current.clear();


  // Para guardar la imagen y posiblemente hacer algo más con ella (por ejemplo, enviarla a un servidor)
  const save = async () => {
    let url = ""
    if (type == "Receptor"){
      url = `${process.env.REACT_APP_API_URL}/update-report-receptor-signature/`
    }else if (type == "Donador"){
      url = `${process.env.REACT_APP_API_URL}/update-report-generator-signature/`
    }else if (type == "Recolector"){
      url = `${process.env.REACT_APP_API_URL}/update-report-receptor-signature/`
    }else if (type == "Generador"){
      url = `${process.env.REACT_APP_API_URL}/update-report-generator-signature/`
    }

    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    console.log(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    try {
      // Usamos 'await' para esperar a que la solicitud se complete y para obtener la respuesta
      let data

      if (type == "Receptor" || type == "Generador"){
        data = {
          reportId: id,
          reportGeneratorSignature: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
        }
      }else if(type == "Donador"){
        data = {
          reportId: id,
          reportGeneratorSignature: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
        }
        }else if(type == "Recolector"){
          data = {
            reportId: id,
            reportGeneratorSignature: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
          }
        }

      const response = await axios.post(url, data);
  
      // Retorna directamente los datos de la respuesta
      return response.data;
    } catch (error) {
      // Maneja cualquier error que ocurra durante la solicitud
      console.error(error);
      // Aquí puedes optar por lanzar el error o devolver algo específico en caso de un error
      throw error; // Esto propaga el error al llamador para que pueda ser manejado más adelante
    }
  } 



  return (
    <div>
      <h3>{`Firma del ${type}`}</h3>
      <SignaturePad
        ref={sigCanvas}
        canvasProps={{
          className: 'signatureCanvas' // clase para el estilo CSS si lo necesitas
        }}
      />
      {/* Botones para guardar o limpiar la firma */}
      <Button type="submit" variant="outlined" color='secondary' fullWidth onClick={clear} sx={{my: 2}}>
        Limpiar
      </Button>
      <Button type="submit" variant="contained" fullWidth onClick={save}>
        Guardar
      </Button>

      {/* Opcional: mostrar la imagen de la firma */}
      {imageURL ? (
        <div>
          <h3>Tu firma:</h3>
          <img
            width="100%"
            src={imageURL}
            alt="Tu firma"
          />
        </div>
      ) : null}
    </div>
  );
};

export default SignatureComponent;
