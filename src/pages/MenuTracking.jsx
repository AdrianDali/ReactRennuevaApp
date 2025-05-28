import React, { useState, useEffect, useCallback, useMemo } from "react";
import '../styles/user/MenuUser.css';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import axios from 'axios';
import {
  Container,
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  IconButton,
  Tooltip,
  Slider,
  Autocomplete,
  Chip,
  Pagination,
  LinearProgress,
  useTheme
, InputAdornment} from '@mui/material';
import {
  Search,
  Close,
  ZoomIn,
  ZoomOut,
  OpenInNew,
  DarkMode,
  LightMode,
  Fullscreen,
  RotateLeft,
  RotateRight,
  GetApp,
  FirstPage,
  LastPage,
  Refresh
} from "@mui/icons-material";

function MenuTracking() {
  const { trackingNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  // State and URL sync
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [folio, setFolio] = useState(trackingNumber || query.get('folio') || '');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('recentFolios') || '[]'));
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(parseInt(query.get('page') || '1', 10));
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // Update URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    folio && params.set('folio', folio);
    params.set('page', pageNumber);
    navigate({ search: params.toString() }, { replace: true });
  }, [folio, pageNumber, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = e => {
      if (!pdfUrl) return;
      if (e.key === 'ArrowLeft') setPageNumber(p => Math.max(p - 1, 1));
      if (e.key === 'ArrowRight') setPageNumber(p => Math.min(p + 1, numPages));
      if (e.key === '+') setScale(s => Math.min(s + 0.2, 3));
      if (e.key === '-') setScale(s => Math.max(s - 0.2, 0.5));
      if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pdfUrl, numPages]);

  // Fetch report PDF
  const fetchPdf = useCallback(async () => {
    if (!folio) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-pdf-report/`,
        { ReportFolio: folio }
      );
      const blob = base64ToBlob(data.Reporte, 'application/pdf');
      setPdfUrl(URL.createObjectURL(blob));
      setNumPages(null);
      setPageNumber(1);
      setRotation(0);
      updateHistory(folio);
    } catch {
      setError(`No se encontró reporte: ${folio}`);
      setPdfUrl(null);
    }
    setLoading(false);
  }, [folio]);

  // Initial load
  useEffect(() => {
    if (trackingNumber) fetchPdf();
  }, [trackingNumber, fetchPdf]);

  // Document load handlers
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(prev => prev <= numPages ? prev : 1);
  };
  const onPageLoadStart = () => setPageLoading(true);
  const onPageRender = () => setPageLoading(false);

  // Helpers
  const updateHistory = f => {
    setHistory(prev => {
      const filtered = prev.filter(x => x !== f);
      const updated = [f, ...filtered].slice(0, 5);
      localStorage.setItem('recentFolios', JSON.stringify(updated));
      return updated;
    });
  };
  const base64ToBlob = (b, type) => {
    const raw = atob(b.split(',')[1] || b);
    const u8 = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) u8[i] = raw.charCodeAt(i);
    return new Blob([u8], { type });
  };
  const openInNew = () => pdfUrl && window.open(pdfUrl, '_blank');
  const resetView = () => { setScale(1); setRotation(0); };
  const toggleFull = () => {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: theme.spacing(4),    // espaciado uniforme
        mb: theme.spacing(2),
        minHeight: '80vh',        // evita espacio en blanco
        py: theme.spacing(3),
        bgcolor: darkMode ? 'grey.900' : 'background.paper',
        color: darkMode ? 'grey.100' : 'grey.900',
        transition: 'background-color 0.3s, color 0.3s'
      }}
    >
      {loading && <LinearProgress color="info" sx={{ mb: 2, borderRadius: 1 }} />}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" color="primary" component="h1">
          Seguimiento de Reporte {folio ? `• ${folio}` : ''}
        </Typography>
        <Box>
          <Tooltip title="Actualizar"><IconButton onClick={fetchPdf}><Refresh /></IconButton></Tooltip>
          <Tooltip title="Modo Oscuro/Claro"><IconButton onClick={() => setDarkMode(d => !d)}>{darkMode ? <LightMode /> : <DarkMode />}</IconButton></Tooltip>
          <Tooltip title="Pantalla Completa"><IconButton onClick={toggleFull}><Fullscreen /></IconButton></Tooltip>
        </Box>
      </Box>

      <Box component="form" onSubmit={e => { e.preventDefault(); fetchPdf(); }} sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Autocomplete
          freeSolo
          options={history}
          value={folio}
          onInputChange={(e, v) => setFolio(v)}
          sx={{ flex: '1 1 300px' }}
          renderInput={params => (
            <TextField
              {...params}
              label="Clave de Responsiva"
              placeholder="folio o historial"
              required
              InputProps={{
                ...params.InputProps,
                startAdornment: folio && (
                  <InputAdornment position="start">
                    <IconButton onClick={() => { setFolio(''); setPdfUrl(null); }}><Close /></IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton type="submit" color="info" disabled={loading} sx={{ ml: 1 }}>
                    <Search />
                  </IconButton>
                )
              }}
              fullWidth
            />
          )}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {history.map(item => (
            <Chip
              key={item}
              label={item}
              onClick={() => setFolio(item)}
              color="info"
              variant="outlined"
              clickable
            />
          ))}
          {history.length > 0 && (
            <Button onClick={() => { localStorage.removeItem('recentFolios'); setHistory([]); }}>
              Borrar Historial
            </Button>
          )}
        </Box>
      </Box>

      {error && <Snackbar open autoHideDuration={6000} onClose={() => setError('')} message={error} action={<IconButton onClick={() => setError('')}><Close /></IconButton>} />}

      {pdfUrl ? (
        <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
          {pageLoading && <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.1)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', p: 1, bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
            <Tooltip title="Primera Página"><IconButton disabled={pageNumber===1} onClick={() => setPageNumber(1)}><FirstPage /></IconButton></Tooltip>
            <Tooltip title="Anterior"><IconButton disabled={pageNumber===1} onClick={() => setPageNumber(p=>Math.max(p-1,1))}><ZoomOut /></IconButton></Tooltip>
            <Slider value={scale} min={0.5} max={3} step={0.1} onChange={(_,v)=>setScale(v)} sx={{ width:200, mx:2 }} disabled={loading} />
            <Tooltip title="Siguiente"><IconButton disabled={pageNumber===numPages} onClick={() => setPageNumber(p=>Math.min(p+1,numPages))}><ZoomIn /></IconButton></Tooltip>
            <Tooltip title="Última Página"><IconButton disabled={pageNumber===numPages} onClick={() => setPageNumber(numPages)}><LastPage /></IconButton></Tooltip>
            <Tooltip title="Rotar Izquierda"><IconButton onClick={()=>setRotation(r=>r-90)}><RotateLeft /></IconButton></Tooltip>
            <Tooltip title="Rotar Derecha"><IconButton onClick={()=>setRotation(r=>r+90)}><RotateRight /></IconButton></Tooltip>
            <Tooltip title="Reset Zoom/Rotación"><IconButton onClick={resetView}><Search /></IconButton></Tooltip>
            <Tooltip title="Descargar"><IconButton onClick={openInNew}><GetApp /></IconButton></Tooltip>
            <Button size="small" onClick={fetchPdf} startIcon={<Refresh />}>Recargar</Button>
            <TextField
              type="number"
              value={pageNumber}
              onChange={e => setPageNumber(Math.min(Math.max(1, +e.target.value), numPages || 1))}
              InputProps={{ sx: { width: 70 } }}
              size="small"
              label="Página"
              variant="outlined"
            />
          </Box>

          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={() => setError('Error al cargar el PDF')}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              onRenderSuccess={onPageRender}
              onRenderError={() => setError('Error renderizando página')}
              onRenderLoading={onPageLoadStart}
              renderTextLayer={false}
            />
          </Document>

          {numPages > 1 && (
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', bgcolor: 'background.paper' }}>
              <Pagination count={numPages} page={pageNumber} onChange={(_,v)=>setPageNumber(v)} color="info" />
            </Box>
          )}
        </Card>
      ) : (
        !loading && !error && <Typography variant="body1" align="center" sx={{ py: 6 }}>Use la búsqueda para ver un reporte aquí.</Typography>
      )}
    </Container>
  );
}

export { MenuTracking };
