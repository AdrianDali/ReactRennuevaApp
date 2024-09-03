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


function DateRangeFilter({name, setFilters, label, filters}) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Typography variant='body1' p={0} pb={1}>{label}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', }} mb={1}>
                    <DatePicker 
                        label="fecha de inicio"
                        value={typeof filters[name].startDate === 'string'? dayjs(filters[name].startDate): filters[name].startDate}
                        onChange={(newValue) => {
                            setFilters(prev => ({...prev, [name]: {...prev[name], startDate: newValue}}));
                        }}
                        format='DD/MM/YYYY'
                        maxDate={filters[name].endDate != null?filters[name].endDate.subtract(1, 'day'): null}
                     />
                    <span>-</span>
                    <DatePicker 
                        label="fecha de Fin"
                        value={typeof filters[name].endDate === 'string'? dayjs(filters[name].endDate): filters[name].endDate}
                        onChange={(newValue) => {
                            setFilters(prev => ({...prev, [name]: {...prev[name], endDate: newValue}}));
                        }}
                        minDate={filters[name].startDate != null?filters[name].startDate.add(1, 'day'): null}
                        format='DD/MM/YYYY'
                    />
                </Box>
                <Button onClick={() => {
                    setFilters(prev => ({...prev, [name]: {...prev[name], startDate: null, endDate: null}}));
                } } variant='outlined' color='secondary' fullWidth>Limpiar Fechas</Button>
            </Box>
        </LocalizationProvider>
    )
}


export default function ReportsFiltersModal({ isOpen, setOpen, data, setFilteredData, objects, setFiltersApplied }) {
    const [filters, setFilters] = useState({
        fecha_inicio_reporte: {},
        firma_responsiva_generador: [],
        firma_responsiva_receptor: [],
        centro_reciclaje: [],
        centro_recoleccion: [],
        ciudad_reporte: [],
        ciudad_usuario: [],
        colonia_reporte: [],
        compania_usuario: [],
        cp_reporte: [],
        cp_usuario: [],
        estado_reporte: [],
        estado_usuario: [],
        transportista: [],
        grupo_usuario: [],
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
            if(key === 'fecha_inicio_reporte') {
                console.log('Filtrando por fecha')
                console.log('Filtros para fecha', filters[key])
                newData = newData.filter(object => {
                    const date = dayjs(object[key]);
                    const startDate = filters[key].startDate;
                    const endDate = filters[key].endDate;

                    if(startDate == null && endDate == null) return true;
                    if(startDate == null) return date.isBefore(endDate);
                    if(endDate == null) return date.isAfter(startDate);
                    return date.isAfter(startDate) && date.isBefore(endDate);
                });
                console.log('data despues del filtro', newData)
            }else if(filters[key].length > 0) {
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
            fecha_inicio_reporte: [],
            firma_responsiva_generador: [],
            firma_responsiva_receptor: [],
            centro_reciclaje: [],
            centro_recoleccion: [],
            ciudad_reporte: [],
            ciudad_usuario: [],
            colonia_reporte: [],
            compania_usuario: [],
            cp_reporte: [],
            cp_usuario: [],
            estado_reporte: [],
            estado_usuario: [],
            transportista: [],
            grupo_usuario: [],
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
                    <DateRangeFilter label="Fecha de inicio"  setFilters={setFilters} name="fecha_inicio_reporte" filters={filters}/>
                    <SelectForBooleans data={data.firma_responsiva_generador} label="Firmado por generador" name='firma_responsiva_generador' setFilters={setFilters} filters={filters} falseValueLabel="Sin firmar" trueValueLabel="Firmado" />
                    <SelectForBooleans data={data.firma_responsiva_receptor} label="Firmado por receptor" name='firma_responsiva_receptor' setFilters={setFilters} filters={filters} falseValueLabel="Sin firmar" trueValueLabel="Firmado" />
                    <MultipleSelect data={data.centro_recoleccion} label="Centro de recolección" name='centro_recoleccion' setFilters={setFilters} filters={filters} />
                    
                    <MultipleSelect data={data.centro_reciclaje} label="Centro de recilaje" name='centro_reciclaje' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.ciudad_reporte} label="Ciudad del reporte" name='ciudad_reporte' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.ciudad_usuario} label="Ciudad del generador" name='ciudad_usuario' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.compania_usuario} label="Compañía del generador" name='compania_usuario' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.transportista} label="Tranposrtista" name='transportista' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.cp_reporte} label="Código postal del reporte" name='cp_reporte' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.cp_usuario} label="Código postal del generador" name='cp_usuario' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.estado_reporte} label="Estado del reporte" name='estado_reporte' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.estado_usuario} label="Estado del generador" name='estado_usuario' setFilters={setFilters} filters={filters} />
                    <Button variant='contained' fullWidth onClick={applyFilters}>Aplicar</Button>
                    <Button variant='outlined' color='secondary' onClick={clearFilters} fullWidth>Limpiar filtros</Button>
                </Box>
            </Box>
        </Modal>
    )
}