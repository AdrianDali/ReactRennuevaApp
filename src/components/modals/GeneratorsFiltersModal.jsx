import React, { useState, useContext, useEffect } from 'react';
import '../../styles/user/CreateUser.css'
import { Modal, Button, Box, IconButton, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip } from '@mui/material';
import { Close } from '@mui/icons-material';
import Title from '../Title';
import theme from '../../context/theme';
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

    return (

        <FormControl fullWidth >
            <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={filters[name]}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label={label} />}
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



export default function GeneratorsFiltersModal({ isOpen, setOpen, data, setFilteredData, users, setFiltersApplied }) {
    const [filters, setFilters] = useState({
            company: [],
            address_locality: [],
            address_postal_code: [],
            address_city: [],
            address_state: []
    });
    const closeModal = () => {
        setOpen(false);
    }


    const applyFilters = () => {
        let newData = users;
        console.log('data antes del filtro', newData)
        const keys = Object.keys(filters);
        console.log('claves de filtros', keys)
        if(keys.every(key => filters[key].length === 0)) return (setFiltersApplied(false), setFilteredData(users));
        keys.forEach(key => {
            if (filters[key].length > 0) {
                console.log('Filtrando por', key)
                console.log('Filtros para', key,': ', filters[key])
                newData = newData.filter(user => filters[key].includes(user[key]));
                console.log('data despues del filtro', newData)
            }else{
                console.log('No hay filtros para', key)
            }
        });
        setFilteredData(newData);
        setFiltersApplied(true);
        closeModal();
    }

    const clearFilters = () => {
        setFilters({
            company: [],
            address_locality: [],
            address_postal_code: [],
            address_city: [],
            address_state: []
        });
        setFilteredData(users);
        setFiltersApplied(false);
        closeModal();
    }

    useEffect(() => {
        clearFilters();
    }, [users])

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

            }}>
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <Title>Filtros</Title>
                <Box display='flex' flexDirection='column' gap={2} sx={{ padding: 2 }} >
                    <MultipleSelect data={data.company} label="Compañía" name='company' setFilters={setFilters} filters={filters}/>
                    <MultipleSelect data={data.address_locality} label="Colonia" name='address_locality' setFilters={setFilters} filters={filters}/>
                    <MultipleSelect data={data.address_postal_code} label="Código Postal" name='address_postal_code' setFilters={setFilters} filters={filters}/>
                    <MultipleSelect data={data.address_city} label="Ciudad" name='address_city' setFilters={setFilters} filters={filters}/>
                    <MultipleSelect data={data.address_state} label="Estado" name='address_state' setFilters={setFilters} filters={filters}/>
                    <Button variant='contained' fullWidth onClick={applyFilters}>Aplicar</Button>
                    <Button variant='outlined' color='secondary' onClick={clearFilters} fullWidth>Limpiar filtros</Button>
                </Box>
            </Box>
        </Modal>
    )
}