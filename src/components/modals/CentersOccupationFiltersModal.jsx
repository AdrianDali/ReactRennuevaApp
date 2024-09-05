import React, { useState, useContext, useEffect } from 'react';
import '../../styles/user/CreateUser.css'
import { Modal, Button, Box, IconButton, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip, Typography, TextField } from '@mui/material';
import { Close, FilterSharp } from '@mui/icons-material';
import Title from '../Title';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};





function RangeFilter({ name, setFilters, label }) {
    const [min, setMin] = useState(null)
    const [max, setMax] = useState(null)

    useEffect(() => {
        setFilters(prev => ({ ...prev, [name]: { start: min, end: max } }));
    }, [min, max])

    const handleMinChange = (event) => {
        setMin(event.target.value);
    };

    const handleMaxChange = (event) => {
        setMax(event.target.value);
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Typography variant='body1' p={0} pb={1}>{label}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', }} mb={1}>
                    <TextField
                        type='number'
                        fullWidth
                        label="Mínimo"
                        value={min}
                        onChange={handleMinChange} />
                    <span>-</span>
                    <TextField
                        type='number'
                        fullWidth
                        label="Máximo"
                        value={max}
                        onChange={handleMaxChange} />
                </Box>
                <Button onClick={() => {
                    setFilters(prev => ({ ...prev, [name]: { ...prev[name], start: null, end: null } }));
                }} variant='outlined' color='secondary' fullWidth>Limpiar rango</Button>
            </Box>
        </>
    )
}


export default function CentersOcuppationFiltersModal({ isOpen, setOpen, data, setFilteredData, objects, setFiltersApplied }) {
    const [filters, setFilters] = useState({
        max_kg: [],
        max_m3: [],
        total_kg: [],
        total_m3: [],
    });
    const closeModal = () => {
        setOpen(false);
    }


    const applyFilters = () => {
        let newData = objects;
        console.log('data antes del filtro', newData)
        const keys = Object.keys(filters);
        console.log('claves de filtros', keys)
        if (keys.every(key => filters[key].length === 0)) return (setFiltersApplied(false), setFilteredData(objects));
        keys.forEach(key => {
            if (key === 'max_kg' || key === 'max_m3' || key === 'total_kg' || key === 'total_m3') {
                console.log('Filtrando por rango', key)
                console.log(`filtros para: ${key}`, filters[key])
                newData = newData.filter(object => {
                    const value = object[key];
                    const start = filters[key].start;
                    const end = filters[key].end;

                    if (start == null && end == null) return true;
                    if (start == null) return value <= end;
                    if (end == null) return value >= start;
                    return value >= start && value <= end;
                });
                console.log('data despues del filtro', newData)
            } else if (key === 'occupied_m3') {
                newData = newData.filter(object => {
                    const volActual = object['total_m3'];
                    const volMax = object['max_m3']
                    const value = (volActual * 100) / volMax
                    const start = filters[key].start;
                    const end = filters[key].end;

                    if (start == null && end == null) return true;
                    if (start == null) return value <= end;
                    if (end == null) return value >= start;
                    return value >= start && value <= end;
                });
            } else if (key === 'occupied_kg') {
                newData = newData.filter(object => {
                    const volActual = object['total_kg'];
                    const volMax = object['max_kg']
                    const value = (volActual * 100) / volMax
                    const start = filters[key].start;
                    const end = filters[key].end;

                    if (start == null && end == null) return true;
                    if (start == null) return value <= end;
                    if (end == null) return value >= start;
                    return value >= start && value <= end;
                });
            } else if (filters[key].length > 0) {
                console.log('Filtrando por', key)
                console.log('Filtros para', key, ': ', filters[key])
                newData = newData.filter(object => filters[key].includes(object[key]));
                console.log('data despues del filtro', newData)
            } else {
                console.log('No hay filtros para', key)
            }
        });
        setFilteredData(newData);
        setFiltersApplied(true);
        closeModal();
    }

    const clearFilters = () => {
        setFilters({
            max_kg: [],
            max_m3: [],
            total_kg: [],
            total_m3: [],
        })
        setFilteredData(objects);
        setFiltersApplied(false);
        closeModal();
    }

    return (
        <Modal open={isOpen} onClose={closeModal} keepMounted >
            <Box className="ModalContent" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                maxHeight: '80dvh',
                overflowY: 'auto'

            }}>
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <Title>Filtros</Title>
                <Box display='flex' flexDirection='column' gap={2} sx={{ padding: 2 }} >
                    <Box mb={4}>
                        <RangeFilter label="Peso actual" setFilters={setFilters} name="total_kg" filters={filters} />
                        <RangeFilter label="Volumen actual" setFilters={setFilters} name="total_m3" filters={filters} />
                        <RangeFilter label="Peso Máximo" setFilters={setFilters} name="max_kg" filters={filters} />
                        <RangeFilter label="Volumen Máximo" setFilters={setFilters} name="max_m3" filters={filters} />
                    </Box>
                    <Button variant='contained' fullWidth onClick={applyFilters}>Aplicar</Button>
                    <Button variant='outlined' color='secondary' onClick={clearFilters} fullWidth>Limpiar filtros</Button>
                </Box>
            </Box>
        </Modal>
    )
}