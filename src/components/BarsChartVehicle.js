import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import Title from './Title';

export default function Chart() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/Rennueva/get-all-users-groups/')
      .then(response => {
        const data = response.data.group_data; // Asumiendo que los datos relevantes están en group_data

        let chartData = data.map(item => ({
          group: item.group,  // Asegúrate de que 'group' y 'user_count' son las claves correctas
          users: item.user_count
        }));

        setGroups(chartData);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

    useEffect(() => {
        // Realiza una petición GET a una URL específica
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-all-users-groups/`)
            .then(response => {
                const data = response.data;

                for (let i = 0; i < data.group_data.length; i++) {

                    meses.push(data.group_data[i].group);
                    beneficios.push(data.group_data[i].user_count);
                }
                
                setBeneficio(beneficios);
                setGrupos(meses);

            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    var beneficios = [];
    var meses = [];



    var misoptions = {
        responsive: true,
        animation: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                min: 0,
                max: 100
            },
            x: {
                ticks: { color: 'rgba(0, 220, 195)' }
            }
        }
    };

    var midata = {
        labels: ["vehiculo01", "Vehículo02"],
        datasets: [
            {
                label: 'Plástico reciclado',
                data: beneficio ,
                backgroundColor: 'rgba(0, 220, 195, 0.5)'
            }
        ]
    };

    return <Bar data={midata} options={misoptions} />
}
