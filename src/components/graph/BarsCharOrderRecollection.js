import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import Title from '../Title';
// Importaciones de Material-UI
import { FormControl, FormControlLabel, Checkbox, FormGroup } from '@mui/material';

export default function Chart() {
  const [groups, setGroups] = useState([]);
  const [period, setPeriod] = useState('year'); // Estado para manejar el periodo seleccionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ajusta la URL y los parámetros según tu API y cómo espera recibir el período
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-num-recollection/`, {
          params: { period: period }, // Envía el período como parámetro de la consulta
        });
        const data = response.data; // Asumiendo que los datos relevantes están en data

        // Ajusta el mapeo de datos según el formato de tu respuesta de la API
        let chartData = [{
          group: "Total de recolecciones",
          users: data.total_de_recolecciones
        }];

        setGroups(chartData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [period]); // Dependencia del efecto actualizada para incluir 'period'

  const handlePeriodChange = (event) => {
    setPeriod(event.target.name); // Actualiza el periodo basado en la selección del usuario
  };

  return (
    <React.Fragment>
      <Title>Usuarios por Grupo</Title>
      <FormControl component="fieldset">
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={period === 'day'} onChange={handlePeriodChange} name="day" />}
            label="Día"
          />
          <FormControlLabel
            control={<Checkbox checked={period === 'month'} onChange={handlePeriodChange} name="month" />}
            label="Mes"
          />
          <FormControlLabel
            control={<Checkbox checked={period === 'year'} onChange={handlePeriodChange} name="year" />}
            label="Año"
          />
        </FormGroup>
      </FormControl>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={groups}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis dataKey="group" stroke="#000000" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar type="monotone" dataKey="users" fill="#3f51b5" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
