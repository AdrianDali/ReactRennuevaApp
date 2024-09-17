import React, { useState, useContext, useEffect } from 'react';
import '../../styles/user/CreateUser.css'
import { Modal, Button, Box, IconButton, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip, Typography } from '@mui/material';
import { Close, FilterSharp } from '@mui/icons-material';
import Title from '../Title';
import theme from '../../context/theme';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
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

function MultipleSelect({ data, label, name, setFilters, filters }) {

    const handleChange = (event) => {
        setFilters(prev => ({ ...prev, [name]: event.target.value }))
    };

    function getStyles(id, selected, theme) {
        return {
            fontWeight:
                filters[name].indexOf(id) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }
    const labelFormated = label.replace(/\s/g, '-').toLowerCase()
    const labelId = `${labelFormated}-label`
    return (

        <FormControl fullWidth >
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                id={labelFormated}
                multiple
                value={filters[name]}
                onChange={handleChange}
                input={<OutlinedInput id={labelFormated} label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip color='primary' key={value} label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {data.map((id) => (
                    <MenuItem
                        key={id}
                        value={id}
                        style={getStyles(id, filters[name], theme)}
                    >
                        {id}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

function SelectForBooleans({ data, label, name, setFilters, filters, trueValueLabel, falseValueLabel }) {
    const handleChange = (event) => {
        setFilters(prev => ({ ...prev, [name]: event.target.value }))
    };

    function getStyles(id, selected, theme) {
        return {
            fontWeight:
                filters[name].indexOf(id) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }
    const labelFormated = label.replace(/\s/g, '-').toLowerCase()
    const labelId = `${labelFormated}-label`
    return (

        <FormControl fullWidth >
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                id={labelFormated}
                multiple
                value={filters[name]}
                onChange={handleChange}
                input={<OutlinedInput id={labelFormated} label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip color='primary' key={(value ? trueValueLabel : falseValueLabel).replace(" ", "")} label={value ? trueValueLabel : falseValueLabel} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {data.map((id) => (
                    <MenuItem
                        key={(id ? trueValueLabel : falseValueLabel).replace(" ", "-")}
                        value={id}
                        style={getStyles(id, filters[name], theme)}
                    >
                        {id ? trueValueLabel : falseValueLabel}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}


function DateRangeFilter({ name, setFilters, label, filters }) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Typography variant='body1' p={0} pb={1}>{label}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', }} mb={1}>
                    <DatePicker
                        label="fecha de inicio"
                        value={typeof filters[name].startDate === 'string' ? dayjs(filters[name].startDate) : filters[name].startDate}
                        onChange={(newValue) => {
                            setFilters(prev => ({ ...prev, [name]: { ...prev[name], startDate: newValue } }));
                        }}
                        format='DD/MM/YYYY'
                        maxDate={filters[name].endDate != null ? filters[name].endDate.subtract(1, 'day') : null}
                    />
                    <span>-</span>
                    <DatePicker
                        label="fecha de Fin"
                        value={typeof filters[name].endDate === 'string' ? dayjs(filters[name].endDate) : filters[name].endDate}
                        onChange={(newValue) => {
                            setFilters(prev => ({ ...prev, [name]: { ...prev[name], endDate: newValue } }));
                        }}
                        minDate={filters[name].startDate != null ? filters[name].startDate.add(1, 'day') : null}
                        format='DD/MM/YYYY'
                    />
                </Box>
                <Button onClick={() => {
                    setFilters(prev => ({ ...prev, [name]: { ...prev[name], startDate: null, endDate: null } }));
                }} variant='outlined' color='secondary' fullWidth>Limpiar Fechas</Button>
            </Box>
        </LocalizationProvider>
    )
}


export default function DonorRecolecctionsFiltersModal({ isOpen, setOpen, data, setFilteredData, objects, setFiltersApplied }) {
    console.log('data en modal', data)
    const [filters, setFilters] = useState({
        conductor_asignado: [],
        codigo_postal: [],
        fecha: {},
        ciudad: [],
        estado: [],
        fecha_estimada_recoleccion: {},
        peso: [],
        peso_estimado: [],
        status: []
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
            if (key === 'fecha' || key === 'fecha_estimada_recoleccion') {
                console.log('Filtrando por fecha')
                console.log('Filtros para fecha', filters[key])
                newData = newData.filter(object => {
                    const date = key === 'fecha'? dayjs(object[key], 'DD/MM/YYYY'): dayjs(object[key], 'YYYY-MM-DD');
                    console.log('fecha', date)
                    const startDate = filters[key].startDate;
                    const endDate = filters[key].endDate;

                    if (startDate == null && endDate == null) return true;
                    if (startDate == null) return date.isBefore(endDate);
                    if (endDate == null) return date.isAfter(startDate);
                    return date.isAfter(startDate) && date.isBefore(endDate);
                });
                console.log('data despues del filtro', newData)
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
            conductor_asignado: [],
            codigo_postal: [],
            fecha: {},
            ciudad: [],
            estado: [],
            fecha_estimada_recoleccion: {},
            peso: [],
            peso_estimado: [],
            status: []
        })
        setFilteredData(objects);
        setFiltersApplied(false);
        closeModal();
    }

    return (
        <Modal open={isOpen} onClose={closeModal} >
            <Box className="ModalContent" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                maxHeight: '90dvh',
                overflowY: 'auto'

            }}>
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <Title>Filtros</Title>
                <Box display='flex' flexDirection='column' gap={2} sx={{ padding: 2 }} >
                    <DateRangeFilter name='fecha' setFilters={setFilters} label='Fecha de solicitud' filters={filters} />
                    <DateRangeFilter name='fecha_estimada_recoleccion' setFilters={setFilters} label='Fecha estimada de recolección' filters={filters} />
                    <MultipleSelect data={data.status} label="Estado de recolección" name='status' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.codigo_postal} label="Código postal" name='codigo_postal' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.ciudad} label="Ciudad" name='ciudad' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.estado} label="Estado" name='estado' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.peso} label="Peso" name='peso' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.peso_estimado} label="Peso estimado" name='peso_estimado' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.conductor_asignado} label="Conductor asignado" name='conductor_asignado' setFilters={setFilters} filters={filters} />
                    <Button variant='contained' fullWidth onClick={applyFilters}>Aplicar</Button>
                    <Button variant='outlined' color='secondary' onClick={clearFilters} fullWidth>Limpiar filtros</Button>
                </Box>
            </Box>
        </Modal>
    )
}