import COUNTRIES from "../assets/data/countries";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { createFilterOptions } from '@mui/material/Autocomplete';

export default function PhoneExtensionSelect({ value, setValue }) {
    const filterOptions = createFilterOptions({
        matchFrom: 'any',
        limit: 10,
        stringify: (option) => `${option.name_es} ${option.dial_code} ${option.code_2}`
    })
    
    return (
        <Autocomplete
            fullWidth
            onChange={(e, value, reason) => {
                console.log("El valor del select cambió a: ", value)
                console.log("La razón del cambio fue: ", reason)
                if (reason === 'clear') return setValue("")
                setValue(value.dial_code)
            }}
            id="country-select-demo"
            value={COUNTRIES.find((option) => option.dial_code === value) || null}
            options={COUNTRIES}
            filterOptions={filterOptions}
            getOptionLabel={(option) => `${option.dial_code}`}
            renderOption={(props, option) => (
                <Box component="li" sx={{ 
                    '& > img': { mr: 2, flexShrink: 0 }
                }} {...props}>
                    <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.code_2.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code_2.toLowerCase()}.png`}
                        alt=""
                    />
                    {option.name_es} {option.dial_code}
                </Box>
            )}
            renderInput={(params) => (
                <TextField  
                    {...params}
                    name="phone_extension"
                    required    
                    label="País"
                    margin='dense'
                    fullWidth
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                />
            )}
        />
    );


}