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
import { add } from 'date-fns';
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
                        {selected.map((value, index) => (
                            <Chip color='primary' key={`${value}-${index}`} label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {data.map((id, index) => (
                    <MenuItem
                        key={`${id}-${index}`}
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






export default function UsersFiltersModal({ isOpen, setOpen, data, setFilteredData, objects, setFiltersApplied }) {
    const [filters, setFilters] = useState({
        address_postal_code: [],
        address_city: [],
        address_state: [],
        address_locality: [],
        address_street: [],
        groups: []
    });
    const closeModal = () => {
        setOpen(false);
    }


    const applyFilters = () => {
        let newData = objects;
        const keys = Object.keys(filters);
        if (keys.every(key => filters[key].length === 0)) return (setFiltersApplied(false), setFilteredData(objects));
        keys.forEach(key => {
            if(key === 'groups' && filters[key].length > 0){
                newData = newData.filter(object => filters[key].includes(object[key][0]));
            }
            if (filters[key].length > 0) {
                newData = newData.filter(object => filters[key].includes(object[key]));
            }
        });
        setFilteredData(newData);
        setFiltersApplied(true);
        closeModal();
    }

    const clearFilters = () => {
        setFilters({
            address_postal_code: [],
            address_city: [],
            address_state: [],
            address_locality: [],
            address_street: [],
            groups: []
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
                    <MultipleSelect data={data.address_postal_code} label="Código postal" name='address_postal_code' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.address_city} label="Ciudad" name='address_city' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.address_state} label="Estado" name='address_state' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.address_locality} label="Localidad" name='address_locality' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.address_street} label="Calle" name='address_street' setFilters={setFilters} filters={filters} />
                    <MultipleSelect data={data.groups} label="Grupos" name='groups' setFilters={setFilters} filters={filters} />
                    <Button variant='contained' fullWidth onClick={applyFilters}>Aplicar</Button>
                    <Button variant='outlined' color='secondary' onClick={clearFilters} fullWidth>Limpiar filtros</Button>
                </Box>
            </Box>
        </Modal>
    )
}