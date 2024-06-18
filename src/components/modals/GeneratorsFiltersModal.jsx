import React, { useState, useContext, useEffect } from 'react';
import '../../styles/user/CreateUser.css'
import { Modal, Button, Box, IconButton, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip } from '@mui/material';
import { Close } from '@mui/icons-material';
import Title from '../Title';
import { Label } from 'recharts';
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

function MultipleSelect({ data, label }) {
    const [selected, setSelected] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelected(
            // On autofill we get the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    function getStyles(id, selected, theme) {
        return {
            fontWeight:
                selected.indexOf(id) === -1
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
                value={selected}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {data.map((id) => (
                    <MenuItem
                        key={id}
                        value={id}
                        style={getStyles(id, selected, theme)}
                    >
                        {id}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}



export default function GeneratorsFiltersModal({ isOpen, setOpen, data }) {

    const closeModal = () => {
        setOpen(false);
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

            }}>
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <Title>Filtros</Title>
                <Box display='flex' flexDirection='column' gap={2} sx={{ padding: 2 }} >
                    <MultipleSelect data={data.company} label="Compañía" />
                    <MultipleSelect data={data.locality} label="Colonia" />
                    <MultipleSelect data={data.postalCode} label="Colonia" />
                    <MultipleSelect data={data.city} label="Ciudad" />
                    <MultipleSelect data={data.state} label="Estado" />
                    <Button variant='contained' fullWidth>Aplicar</Button>
                </Box>
            </Box>
        </Modal>
    )
}