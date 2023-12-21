import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/user/CreateUser.css';
import { TodoContext } from '../context/index.js';
import axios from 'axios';
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel } from '@mui/material';
import Title from '../components/Title';

import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function ModalGenerator({ children, mode }) {
    const [datos, setDatos] = useState([]);
    const [groups, setGroups] = useState([])
    const [users, setUsers] = useState([])
    const [companies, setCompanies] = useState([""])
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [group, setGroup] = useState("");
    const [company, setCompany] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [locality, setLocality] = useState("");
    const [street, setStreet] = useState("");
    const [postal_code, setPostalCode] = useState("");
    const [rfc, setRfc] = useState("");
    const [phone, setPhone] = useState("");
    const [address_num_int, setAddressNumInt] = useState("");
    const [address_num_ext, setAddressNumExt] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const [old_user, setOldUser] = useState("");
    const [razonSocial, setRazonSocial] = useState("");

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
      };
    
    const { setUpdateGeneratorInfo, openModalText, setTextOpenModalText, setOpenModalText, openModalCreateGenerator, setOpenModalCreateGenerator, openModalEditGenerator, openModalDeleteGenerator, setOpenModalEditGenerator, setOpenModalDeleteGenerator } = useContext(TodoContext);
    const closeModal = () => {
        if (openModalCreateGenerator) {
            setOpenModalCreateGenerator(false);
        }
        if (openModalEditGenerator) {
            setOpenModalEditGenerator(false);
        }
        if (openModalDeleteGenerator) {
            setOpenModalDeleteGenerator(false);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
    
            var rfcValue = e.target.rfc.value
            if (!rfcValue) {
              rfcValue = 'XAXX010101000'; // Aquí puedes poner el RFC por defecto que desees
            }
        if (mode === "CREAR") {
            const nuevoDato = { 
                user: e.target.email.value,
                password: e.target.password.value,
                email: e.target.email.value,
                first_name: e.target.nombre.value,
                last_name: e.target.apellido.value,
                group: "Generador",
                rfc: rfcValue,
                company: "Rennueva",
                phone: e.target.phone.value,
                address_state: e.target.state.value,
                address_city: e.target.city.value,
                address_locality: e.target.locality.value,
                address_street: e.target.street.value,
                address_postal_code: e.target.postal_code.value,
                address_num_int: e.target.address_num_int.value,

                address_lat: 0,
                address_lng: 0,

                razon_social: e.target.razon_social.value,
            };

            axios
                .post('https://api.rennueva.com/Rennueva/create-django-user/', nuevoDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Generador creado correctamente")
                    setUpdateGeneratorInfo(true)
                    e.target.reset();
                    closeModal()

                })
                .catch(error => {
                    console.error(error);
                })

        }
        if (mode === "EDITAR") {

            const editarDato = {
                user: e.target.email.value,
                //password: e.target.password.value,
                email: e.target.email.value,
                first_name: e.target.nombre.value,
                last_name: e.target.apellido.value,
                group: "Generador",
                rfc: e.target.rfc.value,
                company: "Rennueva",
                phone: e.target.phone.value,
                address_state: e.target.state.value,
                address_city: e.target.city.value,
                address_locality: e.target.locality.value,
                address_street: e.target.street.value,
                address_postal_code: e.target.postal_code.value,
                address_num_int: e.target.address_num_int.value,
                address_lat: 0,
                address_lng: 0,

                antiguoUser: old_user,

                razon_social: e.target.razon_social.value,
            };
            console.log("##SDAFSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDSDFSDFSDF")
            console.log(editarDato)

            axios
                .put('https://api.rennueva.com/Rennueva/update-django-user/', editarDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Generador editado correctamente")
                    setUpdateGeneratorInfo(true)
                    e.target.reset();
                    closeModal()
                    // Limpiar los campos del formulario
                })
                .catch(error => {
                    console.error(error);
                })

        }
        if (mode === "BORRAR") {
            const antiguo_user = document.getElementById("user-select")
            var user_ant = antiguo_user ? antiguo_user.value : null;

            const deleteDato = {
                user: user
            }

            axios
                .put('https://api.rennueva.com/Rennueva/delete-django-user/', deleteDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Generador borrado correctamente")
                    setUpdateGeneratorInfo(true)
                    e.target.reset();
                    closeModal()

                })
                .catch(error => {
                    console.error(error);
                })
        }

        // Limpiar los campos del formulario
        e.target.reset();
    };


    useEffect(() => {

        // Basado en el modo, decidir si el campo de la contraseña debe ser visible
        if (mode === 'CREAR') {
            setIsPasswordVisible(true);
        } else {
            setIsPasswordVisible(false); // Esto cubre 'editar' y 'borrar'
        }

        axios
            .get('https://api.rennueva.com/Rennueva/get-all-groups/')
            .then(response => {
                const data = response.data;
                setGroups(data)
                console.log("######################GRUPOS##################################")

            })
            .catch(error => {
                console.error(error);
            });

    }, []);


    useEffect(() => {
        const fetchUsers = axios.post('https://api.rennueva.com/Rennueva/get-all-users/', { group: "Generador" })
        const fetchCompanies = axios.get('https://api.rennueva.com/Rennueva/get-all-companies/');

        Promise.all([fetchUsers, fetchCompanies])
            .then((res) => {
                const usersData = res[0].data;
                const companiesData = res[1].data;
                setUsers(usersData);
                setCompanies(companiesData);
                console.log("######################USUARIOS##################################")
            })
            .catch((err) => console.log(err));

    }, []);

    const handleSelectChange = (event) => {
        const selectedOption = event.target.value; // Obtener la opción seleccionada
        console.log(selectedOption)
        // Buscar el dato seleccionado en el arreglo de datos
        const datoEncontrado = users.find((users) => users.user === selectedOption);
        console.log(datoEncontrado)
        setUser(datoEncontrado.user);
        setPassword(datoEncontrado.password);
        setEmail(datoEncontrado.email);
        setFirstName(datoEncontrado.first_name);
        setLastName(datoEncontrado.last_name);
        setGroup(datoEncontrado.group);
        setRfc(datoEncontrado.rfc);
        setCompany("Rennueva");
        setPhone(datoEncontrado.phone);
        setState(datoEncontrado.address_state);
        setCity(datoEncontrado.address_city);
        setLocality(datoEncontrado.address_locality);
        setStreet(datoEncontrado.address_street);
        setPostalCode(datoEncontrado.address_postal_code);
        setAddressNumInt(datoEncontrado.address_num_int);
        setOldUser(selectedOption);
        setRazonSocial(datoEncontrado.razon_social);



    }

    const handleInputChange = (e, setState, mode) => {
        const currentInputValue = e.target.value;

        if (mode !== "BORRAR") {
            setState(currentInputValue);
        }
    };
    const handlePhoneChange = (event) => {
        const value = event.target.value;
    
        // Permitir solo números y limitar la longitud a 10 caracteres
        if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
          setPhone(value);
        }
      };
      const handleRfcChange = (event) => {
        const value = event.target.value.toUpperCase();
    
        // Permitir solo letras y números y limitar la longitud a 12-13 caracteres
        if (/^[0-9A-Z]*$/.test(value) && value.length <= 13) {
          setRfc(value);
        }
      }
    return ReactDOM.createPortal(
        <Modal open={true} onClose={closeModal} >
            <Box className="ModalContent" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,

            }}>
                <Button onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>&times;</Button>
                <form onSubmit={handleSubmit} >
                    <Box mb={2}>
                        <Title> Usuario</Title>
                        {mode === "EDITAR" || mode === "BORRAR" ? (
                            <FormControl fullWidth>
                                <InputLabel id="user-select-label">Usuario</InputLabel>
                                <Select
                                    labelId="user-select-label"
                                    id="user-select"
                                    onChange={(e) => {

                                        handleSelectChange(e, setUser)


                                    }}
                                    required
                                    //value={user}
                                    w
                                >
                                    {users.map((name, index) => (
                                        <MenuItem key={index} value={name.user}>{name.user}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : null}
                    </Box>
                    <Box mt={2} mb={2} sx={{ overflowY: 'auto', maxHeight: 500 }}>
                        <TextField
                            label="Nombre"
                            name="nombre"
                            required
                            fullWidth
                            value={first_name}
                            onChange={(e) => handleInputChange(e, setFirstName, mode)}
                            margin="dense"
                        />
                        <TextField
                            label="Apellido"
                            name="apellido"
                            required
                            fullWidth
                            value={last_name}
                            onChange={(e) => handleInputChange(e, setLastName, mode)}
                            margin="dense"
                        />
                        <TextField
                            label="RFC"
                            name="rfc"
                            fullWidth
                            value={rfc}
                            onChange={handleRfcChange}
                            margin="dense"
                            inputProps={{
                                maxLength: 13 // Opcional: si quieres forzar la longitud máxima en el HTML
                            }}
                            // Validación de error para la longitud del RFC
                            error={rfc.length > 0 && (rfc.length < 12 || rfc.length > 13)}
                            helperText={
                                rfc.length > 0 && (rfc.length < 12 || rfc.length > 13)
                                    ? "El RFC debe tener entre 12 y 13 caracteres"
                                    : ""
                            }
                        />
                        <TextField
                            label="Razon Social"
                            name="razon_social"
                            required
                            fullWidth
                            value={razonSocial}
                            onChange={(e) => handleInputChange(e, setRazonSocial, mode)}
                            margin="dense"
                        />
                        <TextField
                            label="Email Usuario"
                            name="email"
                            type="email"
                            required
                            fullWidth
                            value={email}
                            onChange={(e) => handleInputChange(e, setEmail, mode)}
                            margin="dense"
                        />
                        {mode === "CREAR" ? (
                            <TextField
                                label="Password"
                                name="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                required
                                fullWidth
                                value={password}
                                onChange={(e) => handleInputChange(e, setPassword, mode)}
                                margin="dense"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        ) : null}

                        <FormControl fullWidth mt={2} mb={2}>




                            <TextField
                                label="Celular"
                                name="phone"
                                required
                                fullWidth
                                value={phone}
                                onChange={handlePhoneChange}
                                margin="dense"
                                inputProps={{
                                    // Opcional: usar el tipo "tel" para mejor semántica y compatibilidad móvil
                                    type: "tel",
                                    // maxLength: 10 // Opcional: si quieres forzar la longitud máxima en el HTML
                                }}
                                // Para mostrar un mensaje de error si la longitud es menor a 10
                                error={phone.length > 0 && phone.length < 10}
                                helperText={phone.length > 0 && phone.length < 10 ? "El número debe ser de 10 dígitos" : ""}
                            />
                        </FormControl>
                        <FormControl fullWidth mt={2} mb={2}>

                            <Title>Ubicacion</Title>
                            <TextField
                                label="Estado"
                                name="state"
                                required
                                fullWidth
                                value={state}
                                onChange={(e) => handleInputChange(e, setState, mode)}
                                margin="dense"
                            />
                            <TextField
                                label="Ciudad"
                                name="city"
                                required
                                fullWidth
                                value={city}
                                onChange={(e) => handleInputChange(e, setCity, mode)}
                                margin="dense"
                            />
                            <TextField
                                label="Colonia"
                                name="locality"
                                required
                                fullWidth
                                value={locality}
                                onChange={(e) => handleInputChange(e, setLocality, mode)}
                                margin="dense"
                            />
                            <TextField
                                label="Calle "
                                name="street"
                                required
                                fullWidth
                                value={street}
                                onChange={(e) => handleInputChange(e, setStreet, mode)}
                                margin="dense"
                            />
                            <TextField
                                label="Numero interior"
                                name="address_num_int"
                                required
                                fullWidth
                                value={address_num_int}
                                onChange={(e) => handleInputChange(e, setAddressNumInt, mode)}
                                margin="dense"
                            />


                            <TextField
                                label="Codigo postal"
                                name="postal_code"
                                required
                                fullWidth
                                value={postal_code}
                                onChange={(e) => handleInputChange(e, setPostalCode, mode)}
                                margin="dense"
                            />
                        </FormControl>
                    </Box>

                    <Button type="submit" variant="contained" fullWidth>{mode}</Button>
                </form>
            </Box>


        </Modal>,

        document.getElementById('modal')

    );
}

export { ModalGenerator };
