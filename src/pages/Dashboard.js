import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Chart from '../components/Chart';
import Deposits from '../components/Deposits';
import Orders from '../components/Orders';
import BarsCharOrderRecollection from '../components/graph/BarsCharOrderRecollection';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import useAuth from "../hooks/useAuth.js";



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {' © '}
      <Link color="inherit" href="https://mui.com/">
        Rennueva
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const dataUser = useAuth();


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "90vh", width : '100vw'}}>
        
      {dataUser && dataUser.groups[0] === "Administrador" ? (
     
     <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
     <Grid container spacing={2}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={8}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 260,
                }}
              >
                <Chart />
              </Paper>
            </Grid>

            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 260,
                }}
              >
                <Deposits />
              </Paper>
            </Grid>

            {/* Recent Orders */}
            <Grid item xs={8}>
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                <Orders />
              </Paper>
            </Grid>
            {/* Chart */}
            <Grid item xs={8} md={4} lg={4}>
              <Paper
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 440,
                }}
              >
                <BarsCharOrderRecollection />
              </Paper>
            </Grid>
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
     
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Title>No tienes permisos para ver esta página</Title>
        </Box>
      )}
       </Box>
    </ThemeProvider>
  );
}