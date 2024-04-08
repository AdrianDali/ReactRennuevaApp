import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Modal, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, IconButton, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { TodoContext } from '../context/index.js';

function ModalResidueReport({ onClose, userselect, report }) { // Asegúrate de manejar el evento de cierre adecuadamente
    const [residues, setResidues] = useState([]);
    const [reportResidues, setReportResidues] = useState([]);
    const [entries, setEntries] = useState([{ user: userselect, report: report, residue: '', peso: '', volumen: '' }]);
    const [botonAdd, setBotonAdd] = useState(false);
    console.log("####################ReporteSeleccionado###############################SDFDFDSFDSFDSGHMN")
    console.log(userselect)
    console.log(report)
    const { openModalCreateResidueReport, setOpenModalCreateResidueReport, openModalEditResidueReport, setOpenModalEditResidueReport, openModalDeleteResidueReport, setOpenModalDeleteReportResidue, setUpdateReportInfo } = useContext(TodoContext);





    const closeModal = () => {
        console.log("##################################################################SDFDFDSFDSFDSGHMN")
        console.log("Cerrar moda")
        if (openModalCreateResidueReport) {
            setOpenModalCreateResidueReport(false);
        }
        if (openModalEditResidueReport) {
            setOpenModalEditResidueReport(false);
        }
        if (openModalDeleteResidueReport) {
            setOpenModalDeleteReportResidue(false);
        }
        setUpdateReportInfo(true);
    };

    useEffect(() => {

        // const fetchResidues = axios.get('${process.env.REACT_APP_API_URL}/get-all-residue/');
        // const fetchReportResidues = axios.post('${process.env.REACT_APP_API_URL}/get-all-residues-per-report/', "14");


        // Promise.all([fetchResidues, fetchReportResidues]) 
        //     .then((res) => {
        //         setResidues(res[0].data);
        //         setReportResidues(res[1].data);
        //         console.log("todos los residuos") 
        //         console.log(res[1].data)
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        const getResidues = {
            reportId: report,
        }
        axios.get(`${process.env.REACT_APP_API_URL}/get-all-residue/`)
            .then(response => {
                const data = response.data;
                console.log("todos los residuos de get all residue")
                console.log(data)
                setResidues(currentResidues => [...currentResidues, ...data]);
                // Asumiendo que 'data' es un array.
            })
            .catch(error => {
                console.error('Hubo un problema al obtener los residuos:', error);
            });

        axios.post(`${process.env.REACT_APP_API_URL}/get-all-residues-per-report/`, getResidues)
            .then(response => {
                const data = response.data;
                setEntries(data); // Asumiendo que 'data' es un array.
                console.log("todos los residuos por reporte")
                console.log(data)
                if (data.length  < 1) {
                    console.log("####################largo menor a 1")
                    setBotonAdd(true)
                }

            })
            .catch(error => {
                console.error('Hubo un problema al obtener los residuos:', error);
            });
    }, []);



    const handleInputChange = (index, event) => {
        const values = [...entries];
        if (event.target.name === "residue") {
            values[index].residue = event.target.value;
        } else if (event.target.name === "peso") {
            values[index].peso = event.target.value;
        } else {
            values[index].volumen = event.target.value;
        }
        setEntries(values);
    };

    const handleAddFields = () => {
        console.log("###########dfdfdfdf####################################SDFDFDSFDSFDSGHMN")
        console.log(userselect)
        console.log(report)

        setEntries([...entries, { user: userselect, report: report, residue: '', peso: '', volumen: '' }]);
    };
    const  handleAddFirstFields = () => {
        setEntries([...entries, { user: userselect, report: report, residue: '', peso: '', volumen: '' }]);
        setBotonAdd(false)
    };

    const handleRemoveFields = (index) => {
        const values = [...entries];
        values.splice(index, 1);
        setEntries(values);
        console.log("###########dfdfdfdf#######asdasdasdas########asdasdasd#####################SDFDFDSFDSFDSGHMN")
        console.log(values)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para enviar 'entries' a tu backend
        console.log('Enviando datos:', entries);
        axios
            .post(`${process.env.REACT_APP_API_URL}/create-report-residue-user/`, entries)
            .then(response => {
                const data = response.data;
                console.log(data)

                // setOpenModalText(true);
                e.target.reset();
                closeModal()

            })
            .catch(error => {
                console.error(error);
            })
        // Aquí deberías colocar la lógica para cerrar el modal si la operación es exitosa
        //onClose(); 
    };

    return ReactDOM.createPortal(
        <Modal open={true} onClose={closeModal}>
            <Box
                sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 700, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2,
                }}
            >
                <Button onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    &times;
                </Button>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        {entries.map((entry, index) => (
                            <Box key={index} display="flex" flexDirection="row" alignItems="center">
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <InputLabel>Residuo</InputLabel>
                                    <Select
                                        name="residue"
                                        value={entry.residue}
                                        onChange={event => handleInputChange(index, event)}
                                    >
                                        {residues.map((residue, idx) => (
                                            <MenuItem key={idx} value={residue.nombre}>{residue.nombre}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                                <TextField
                                    sx={{ m: 1 }}
                                    name="peso"
                                    label="Peso en kg"
                                    variant="outlined"
                                    type="number"
                                    value={entry.peso}
                                    onChange={event => handleInputChange(index, event)}
                                />
                                <TextField
                                    sx={{ m: 1 }}
                                    name="volumen"
                                    label="Volumen en m³"
                                    variant="outlined"
                                    type="number"
                                    value={entry.volumen}
                                    onChange={event => handleInputChange(index, event)}
                                />
                                <IconButton onClick={() => handleRemoveFields(index)}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                                <IconButton onClick={handleAddFields}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        ))}

                        { !botonAdd && 
                        <Button type="submit" variant="contained" fullWidth>Enviar</Button>}

                    </Stack>
                </form>
                {
                    botonAdd &&
                    <Button type='submit' variant="contained" fullWidth onClick={handleAddFirstFields}>
                        Agregar Residuo
                    </Button>
                }

            </Box>
        </Modal>,
        document.getElementById('modal')
    );
}

export { ModalResidueReport };
