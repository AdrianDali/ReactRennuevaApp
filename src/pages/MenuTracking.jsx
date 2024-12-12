import React, { useState, useEffect } from "react";
import '../styles/user/MenuUser.css';
import { useParams } from 'react-router-dom'; // Importa useParams para obtener los parámetros de la URL
import { Document, Page } from 'react-pdf';
import axios from 'axios';
import { Container, Button, TextField, Typography, Box } from '@mui/material';
import { Search } from "@mui/icons-material";
function MenuTracking() {

    const [pdfFile, setPdfFile] = useState(null);
    const [url, setUrl] = useState(null);
    const [folio, setFolio] = useState('');
    const { trackingNumber } = useParams(); // Obtén el parámetro trackingNumber de la URL
    const [didSearch, setDidSearch] = useState(false);
    // Función para abrir el PDF en una nueva ventana
    function openPdfInNewWindow() {
        //const blob = base64ToBlob(pdfFile, 'application/pdf');
        //const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    // Función para obtener el PDF desde el servidor
    const getPDF = async () => {
        if (!folio) {
            setPdfFile(null);
            return;
        }
        if (!didSearch) {
            setDidSearch(true);
        }
        try {
            console.log(folio)
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/get-pdf-report/`, { ReportFolio: folio });
            const data = response.data;
            console.log("Respuesta del servidor:");
            console.log(data.Reporte);
            const blob = base64ToBlob(data.Reporte, 'application/pdf');
            setUrl(URL.createObjectURL(blob));
            setPdfFile(data.Reporte); // Asumiendo que data ya está en formato base64
            //openPdfInNewWindow(data.Reporte);
        } catch (error) {
            console.log(error);
            setPdfFile(null);
        }
    };

    // Función para convertir base64 a Blob
    function base64ToBlob(base64, mimeType) {
        const base64Real = base64.split(',')[1] || base64;
        const byteCharacters = atob(base64Real);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    // useEffect para establecer el valor del folio y buscar automáticamente cuando se monta el componente
    useEffect(() => {
        if (trackingNumber) {
            setFolio(trackingNumber); // Establece el valor del folio con el número de rastreo de la URL
            getPDF(); // Llama a la función para obtener el PDF automáticamente
        }
    }, [trackingNumber]);

    return (
        <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 5 }}>

            <Typography variant="h4" component="h4" color="primary" mb={6}>
                Seguimiento de reportes
            </Typography>
            <Box maxWidth="sm" minWidth="xs" mb={4} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: "wrap" }}>
                <TextField
                    label="Clave de Responsiva"
                    name="responsiva"
                    required
                    value={folio} // Establece el valor del campo de texto con el folio
                    onChange={(e) => setFolio(e.target.value)}
                    size="small"
                    sx={{ maxWidth: 500, minWidth: 200, flexGrow: 10 }}
                />
                <Button
                    variant="contained"
                    color="info"
                    onClick={getPDF}
                    size="medium"
                    startIcon={<Search />}
                    sx={{ maxWidth: 500, minWidth: 100, flexShrink: 1, flexGrow: 1 }}
                >
                    Buscar
                </Button>
            </Box>
            <Box maxWidth="sm" mx="auto" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                {!didSearch && (
                    <Typography variant="h6" color="textSecondary" align="center">
                        Realice una búsqueda para comenzar
                    </Typography>
                )}
                {didSearch && !pdfFile && (
                    <Typography variant="h6" color="textSecondary" align="center">
                        No se encontró ningún reporte con la clave de responsiva proporcionada
                    </Typography>
                )}
                {/* Visualizador de PDF */}
                {pdfFile && (
                    <Box sx={{ width: '100%', overflowX: "scroll", "canvas .react-pdf__Page__canvas": "width: 200px"}}>
                        <Document
                            file={url}
                            onLoadError={(error) => console.error('Error al cargar el PDF:', error)}
                            onLoadSuccess={(pdf) => console.log('PDF cargado:', pdf)}
                            onClick={() => openPdfInNewWindow()}
                        >
                            <Page pageNumber={1} renderTextLayer={false} />
                        </Document>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export { MenuTracking };
