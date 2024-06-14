import React, { useState, useContext } from "react";
import {
  createTheme,
  ThemeProvider,
  Box,
  Modal,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import BlogPost from "../../components/blog/BlogPost";
import { theme } from "../../styles/Generator/theme.js";
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Grid from '@mui/material/Grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { PieChart, Pie, Cell } from 'recharts';


function createData(name, calories, fat, carbs, protein, price) {
    return {
      name,
      calories,
      fat,
      carbs,
      protein,
      price,
      history: [
        {
          date: '2020-01-05',
          customerId: '11091700',
          amount: 3,
        },
        {
          date: '2020-01-02',
          customerId: 'Anonymous',
          amount: 1,
        },
      ],
    };
  }

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {setOpen(!open)}}
              sx={{ color: 'white' }}
              
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell sx = {{ color : "#ffffff"}} component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell  sx = {{ color : "#ffffff"}} align="right">{row.calories}</TableCell>
          <TableCell  sx = {{ color : "#ffffff"}} align="right">{row.fat}</TableCell>
          <TableCell  sx = {{ color : "#ffffff"}} align="right">{row.carbs}</TableCell>
          <TableCell  sx = {{ color : "#ffffff"}} align="right">{row.protein}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography sx = {{ color : "#ffffff"}} variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell sx = {{ color : "#ffffff"}} >Date</TableCell>
                      <TableCell sx = {{ color : "#ffffff"}}>Customer</TableCell>
                      <TableCell sx = {{ color : "#ffffff"}} align="right">Amount</TableCell>
                      <TableCell sx = {{ color : "#ffffff"}} align="right">Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        <TableCell sx = {{ color : "#ffffff"}} component="th" scope="row">
                          {historyRow.date}
                        </TableCell>
                        <TableCell sx = {{ color : "#ffffff"}}>{historyRow.customerId}</TableCell>
                        <TableCell sx = {{ color : "#ffffff"}} align="right">{historyRow.amount}</TableCell>
                        <TableCell sx = {{ color : "#ffffff"}} align="right">
                          {Math.round(historyRow.amount * row.price * 100) / 100}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          customerId: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        }),
      ).isRequired,
      name: PropTypes.string.isRequired,
      
      protein: PropTypes.number.isRequired,
    }).isRequired,
  };
const rows = [
  createData("Adrian Dali Hernandez Rueda", "XXXXAXXXXX", "13-12-2024", "SI", "SI"),
  createData("Adrian Dali Hernandez Rueda", "XXXXAXXXXX", "13-12-2024", "SI", "SI"),
  createData("Adrian Dali Hernandez Rueda", "XXXXAXXXXX", "13-12-2024", "SI", "SI"),
  createData("Adrian Dali Hernandez Rueda", "XXXXAXXXXX", "13-12-2024", "SI", "SI")

];

// Datos de ejemplo para la gráfica circular
const data = [
  { name: 'Grupo A', value: 400 },
  { name: 'Grupo B', value: 300 },
  { name: 'Grupo C', value: 300 },
  { name: 'Grupo D', value: 200 },
];

// Colores para cada segmento de la gráfica circular
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


function MenuOrderAssignment() {
  const exampleNumber = 75;
  const totalResponsivas = 123;

  return (
    <ThemeProvider theme={theme}>
    <Grid container spacing={2} >


    <Grid item xs={4}>
      <Paper sx={{ marginLeft: 3, height: '30vh', marginTop: -9, bgcolor: '#1B4332', borderRadius: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
        <Typography sx={{ color: '#FFF' }}>
          Mis Responsivas Generadas
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <PieChart width={200} height={200}>
            <Pie data={data} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value" >
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
          </PieChart>
          <Typography variant="h3" sx={{ marginLeft: 3, color: '#FFF' }}>
            {exampleNumber}%
          </Typography>
        </Box>
      </Paper>
    </Grid>


    <Grid item xs={4}>
      <Paper sx={{
        height: '30vh',
        marginTop: -9,
        bgcolor: '#1B4332',
        borderRadius: "25px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Círculo y número de responsivas */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="3" fill="#4caf50" />
            <text x="50%" y="50%" textAnchor="middle" stroke="white" strokeWidth="1px" dy=".3em" fill="white" fontSize="20">
              {totalResponsivas}
            </text>
          </svg>
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Total Responsivas
          </Typography>
        </Box>
      </Paper>
    </Grid>


    <Grid item xs={4}  >
    <Paper sx={{height: "30vh", marginTop : -9, bgcolor : '#1B4332', borderRadius: "25px",}}>    
    <Typography >
        Mis Responsivas Generadas
    </Typography>



    </Paper>
    </Grid>
    <Grid item xs={12} sx={{
          minHeight: "80%"}} >
    <Paper
        sx={{
          p: 3,
          bgcolor: "generator.bg_main",
          ml: 3,
          borderRadius: "25px",
          height: "80%",
          minHeight: "80%",
        }}
      >
        <Typography sx = {{ color : "#ffffff", fontWeight : "bold"}} variant="h6" gutterBottom component="div">
                Mis Responsivas Generadas
            </Typography>
        <TableContainer component={Box} sx={{ maxHeight : "90%",minHeight: "80%" }}>
          <Table sx={{ minWidth: 650, }} aria-label="simple table">
            
            <TableHead >
            
              <TableRow>
              <TableCell > </TableCell>
                <TableCell sx = {{color : "#ffffff", fontWeight: 'bold'}}>Nombre</TableCell>
                <TableCell sx = {{color : "#ffffff", fontWeight: 'bold'}} align="right" >RFC</TableCell>
                <TableCell sx = {{color : "#ffffff", fontWeight: 'bold'}} align="right">Fecha</TableCell>
                <TableCell sx = {{color : "#ffffff", fontWeight: 'bold'}} align="right">Descargar</TableCell>
                <TableCell sx = {{color : "#ffffff", fontWeight: 'bold'}} align="right">Finalizada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
        </Grid>
    </Grid>
    </ThemeProvider>
  );
}

export { MenuOrderAssignment };
