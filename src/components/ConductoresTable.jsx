import React , {useState, useEffect}from 'react';
import '../styles/Table.css';
import axios from 'axios';

const RecyclingCenterTable = ({ datos }) => {
    const [clientes, setClientes] = useState([]);


    useEffect(() => {
        // Realiza una petición GET a una URL específica
        axios
            .get(`${process.env.REACT_APP_API_URL}/get-all-recyclingCenter/`)
            .then(response => {
                const data = response.data;
                setClientes(data);
              

            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
      <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th className='etiquetaTabla'>Nombre</th>
            <th className='etiquetaTabla'>Razón Social</th>
            <th className='etiquetaTabla'>RFC</th>
            <th className='etiquetaTabla'>Calle</th>
            <th className='etiquetaTabla'>Celular</th>
            <th className='etiquetaTabla'>Email</th>
            <th className='etiquetaTabla'>Dirección</th>
            <th className='etiquetaTabla'>Ciudad</th>
            <th className='etiquetaTabla'>Estado</th>
            <th className='etiquetaTabla'>Código Postal</th>


          </tr>
        </thead>
        <tbody>
          {clientes.map((fila, index) => (
            console.log("###############################"),
            console.log(clientes),
            console.log(fila),
            
            <tr key={index}>
              <td className='datoTabla'>{fila.nombre}</td>
              <td className='datoTabla'>{fila.razonSocial}</td>
              <td className='datoTabla'>{fila.rfc}</td>
              <td className='datoTabla'>{fila.calle}</td>
              <td className='datoTabla'>{fila.celular}</td>
              <td className='datoTabla'>{fila.correo}</td>
              <td className='datoTabla'>{fila.direccion}</td>
              <td className='datoTabla'>{fila.ciudad}</td>
              <td className='datoTabla'>{fila.estado}</td>
              <td className='datoTabla'>{fila.codigoPostal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  }

export default RecyclingCenterTable;
