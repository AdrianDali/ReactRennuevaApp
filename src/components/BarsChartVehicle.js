
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


export default function Bars() {

   
    const [beneficio, setBeneficio] = useState([]);
    const [grupos, setGrupos] = useState([]);
    
    var beneficios = [];
    var meses = [];


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