import React, { useState, useEffect } from "react";
import '../styles/user/MenuUser.css';
import { useParams } from 'react-router-dom'; // Importa useParams para obtener los parámetros de la URL
import { Document, Page } from 'react-pdf';
import axios from 'axios';
import { ThemeProvider, createTheme, Box, Grid, Paper, Container, Toolbar, CssBaseline, Button, TextField } from '@mui/material';
import Title from '../components/Title.js';

function MenuTracking() {
   
    const [pdfFile, setPdfFile] = useState(null);
    const [url, setUrl] = useState(null);
    const [folio, setFolio] = useState(null);
    const { trackingNumber } = useParams(); // Obtén el parámetro trackingNumber de la URL
    const defaultTheme = createTheme();

    // Función para abrir el PDF en una nueva ventana
    function openPdfInNewWindow() {
        const blob = base64ToBlob(pdfFile, 'application/pdf');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    // Función para obtener el PDF desde el servidor
    const getPDF = async () => {
        try {
            const response = await axios.post('https://api.rennueva.com/Rennueva/get-pdf-report/', { ReportFolio: folio });
            const data = response.data;
            console.log("Respuesta del servidor:");
            console.log(data.Reporte);
            const blob = base64ToBlob(data.Reporte, 'application/pdf');
            setUrl(URL.createObjectURL(blob));
            setPdfFile(data.Reporte); // Asumiendo que data ya está en formato base64
            openPdfInNewWindow(data.Reporte);
        } catch (error) {
            console.log(error);
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
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) => theme.palette.grey[100],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            <Grid item xl>
                                <Paper
                                    sx={{
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        height: 'auto',
                                    }}
                                >
                                    <Title>Tracking</Title>

                                    <TextField
                                        label="Clave de Responsiva"
                                        name="responsiva"
                                        required
                                        fullWidth
                                        value={folio || ''} // Establece el valor del campo de texto con el folio
                                        onChange={(e) => setFolio(e.target.value)}
                                    />
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={getPDF}
                                    >
                                        Buscar
                                    </Button>

                                    {/* Visualizador de PDF */}
                                    {pdfFile && (
                                        <Document
                                            file={url}
                                            onLoadError={(error) => console.error('Error al cargar el PDF:', error)}
                                        >
                                            <Page pageNumber={1} />
                                        </Document>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </>
    );
}

export { MenuTracking };
