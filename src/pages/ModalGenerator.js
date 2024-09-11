import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/user/CreateUser.css';
import { TodoContext } from '../context/index.js';
import axios from 'axios';
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel, IconButton, InputAdornment } from '@mui/material';
import Title from '../components/Title';
import { Close } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function ModalGenerator({ children, mode,creatorUser, userToEdit=null }) {
    const [groups, setGroups] = useState([])
    const [users, setUsers] = useState([])
    const [companies, setCompanies] = useState([""])
    const [user, setUser] = useState(userToEdit);
    console.log("###################### USER TO EDIT ##################################")
    console.log(userToEdit)
    
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
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const [old_user, setOldUser] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [creator, setCreator] = useState(creatorUser);
  

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
            console.log("######################")
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
                user_permission: "Escritura",
                creator_user: creator
            };

            axios
                .post(`${process.env.REACT_APP_API_URL}/create-django-user/`, nuevoDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Generador creado correctamente")
                    setUpdateGeneratorInfo(prev => !prev)
                    e.target.reset();
                    closeModal()

                })
                .catch(error => {
                    console.error("############################");
                    setOpenModalText(true);
              
                    // Check if error response and data exist
                    if (error.response && error.response.data) {
                      const errorMessage = error.response.data.errorMessage || "Algo salio mal. Intenta de nuevo";
                      setTextOpenModalText(`Algo salio mal. Intenta de nuevo \n ${errorMessage}`);
                    } else {
                      setTextOpenModalText("Algo salio mal. Intenta de nuevo");
                    }
              
                    console.error(error.response);
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
                creator_user: creator,
                user_permission: "Escritura"

            };
            console.log("##SDAFSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDSDFSDFSDF")
            console.log(editarDato)

            axios
                .put(`${process.env.REACT_APP_API_URL}/update-django-user/`, editarDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Generador editado correctamente")
                    setUpdateGeneratorInfo(prev => !prev)
                    e.target.reset();
                    closeModal()
                    // Limpiar los campos del formulario
                })
                .catch(error => {
                    console.error("############################");
                    setOpenModalText(true);
              
                    // Check if error response and data exist
                    if (error.response && error.response.data) {
                      const errorMessage = error.response.data.errorMessage || "Algo salio mal. Intenta de nuevo";
                      setTextOpenModalText(`Algo salio mal. Intenta de nuevo \n ${errorMessage}`);
                    } else {
                      setTextOpenModalText("Algo salio mal. Intenta de nuevo");
                    }
              
                    console.error(error.response);
                  })

        }
        if (mode === "BORRAR") {
            const antiguo_user = document.getElementById("user-select")
            var user_ant = antiguo_user ? antiguo_user.value : null;

            const deleteDato = {
                email: user,
                creator_user: creator
            }

            axios
                .put(`${process.env.REACT_APP_API_URL}/delete-django-user/`, deleteDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Generador borrado correctamente")
                    setUpdateGeneratorInfo(prev=>!prev)
                    e.target.reset();
                    closeModal()

                })
                .catch(error => {
                    console.error("############################");
                    setOpenModalText(true);
              
                    // Check if error response and data exist
                    if (error.response && error.response.data) {
                      const errorMessage = error.response.data.errorMessage || "Algo salio mal. Intenta de nuevo";
                      setTextOpenModalText(`Algo salio mal. Intenta de nuevo \n ${errorMessage}`);
                    } else {
                      setTextOpenModalText("Algo salio mal. Intenta de nuevo");
                    }
              
                    console.error(error.response);
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
            .get(`${process.env.REACT_APP_API_URL}/get-all-groups/`)
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
        const fetchUsers = axios.post(`${process.env.REACT_APP_API_URL}/get-all-users/`, { group: "Generador" })
        const fetchCompanies = axios.get(`${process.env.REACT_APP_API_URL}/get-all-companies/`);

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

    useEffect(() => {
        if (userToEdit === null) return 
        if (users.length === 0) return
        const datoEncontrado = users.find((users) => users.user === userToEdit.user);
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
        setOldUser(datoEncontrado.user);
        setRazonSocial(datoEncontrado.razon_social);
    }, [userToEdit, users]);

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
                <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}>
                    <Close />
                </IconButton>
                <form onSubmit={handleSubmit} >
                    <Box mb={2}>
                        <Title> Generador </Title>
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
                            label="Razon social"
                            name="razon_social"
                            required
                            fullWidth
                            value={razonSocial}
                            onChange={(e) => handleInputChange(e, setRazonSocial, mode)}
                            margin="dense"
                            inputProps={{
                                maxLength: 50 // Opcional: si quieres forzar la longitud máxima en el HTML
                            }}
                            error={razonSocial.length > 0 &&  razonSocial.length > 50}
                            helperText={
                                razonSocial.length > 0 &&  razonSocial.length > 50
                                    ? "La Razon Social debe tener entre 5 y 50 caracteres"
                                    : ""
                            }

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
                                inputProps={{
                                    maxLength: 50 // Opcional: si quieres forzar la longitud máxima en el HTML
                                }}
                                error={state.length < 3 && state.length > 50}
                                helperText={
                                    state.length > 0 && (state.length < 3 || state.length > 50)
                                        ? "El estado debe tener entre 3 y 50 caracteres"
                                        : ""
                                }

                            />
                            <TextField
                                label="Ciudad"
                                name="city"
                                required
                                fullWidth
                                value={city}
                                onChange={(e) => handleInputChange(e, setCity, mode)}
                                margin="dense"
                                inputProps={{
                                    maxLength: 50 // Opcional: si quieres forzar la longitud máxima en el HTML
                                }}
                                error={state.length < 3 && city.length > 50}
                                helperText={
                                    city.length > 0 && (city.length < 3 || city.length > 50)
                                        ? "La ciudad debe tener entre 3 y 50 caracteres"
                                        : ""
                                }
                            />
                            <TextField
                                label="Colonia"
                                name="locality"
                                required
                                fullWidth
                                value={locality}
                                onChange={(e) => handleInputChange(e, setLocality, mode)}
                                margin="dense"
                                inputProps={{
                                    maxLength: 50 // Opcional: si quieres forzar la longitud máxima en el HTML
                                }}
                                error={state.length < 3 && locality.length > 50}
                                helperText={
                                    locality.length > 0 && (locality.length < 3 || locality.length > 50)
                                        ? "La colonia debe tener entre 3 y 50 caracteres"
                                        : ""
                                }
                            />
                            <TextField
                                label="Calle "
                                name="street"
                                required
                                fullWidth
                                value={street}
                                onChange={(e) => handleInputChange(e, setStreet, mode)}
                                margin="dense"
                                inputProps={{
                                    maxLength: 50 // Opcional: si quieres forzar la longitud máxima en el HTML
                                }}
                                error={state.length < 3 && street.length > 50}
                                helperText={
                                    street.length > 0 && (street.length < 3 || street.length > 50)
                                        ? "La calle debe tener entre 3 y 50 caracteres"
                                        : ""
                                }
                            />
                            <TextField
                                label="Numero interior"
                                name="address_num_int"
                                required
                                fullWidth
                                value={address_num_int}
                                onChange={(e) => {
                                    // Solo permite números
                                    if (e.target.value === '' || /^[0-9\b]+$/.test(e.target.value)) {



                                        handleInputChange(e, setAddressNumInt, mode);

                                    }
                                }}
                                inputProps={{ maxLength: 5 }}
                                margin="dense"
                                error={address_num_int.length > 0 && address_num_int.length > 5}
                                helperText={
                                    address_num_int.length > 0 && address_num_int.length > 5
                                        ? "El numero interior debe tener entre 1 y 5 caracteres"
                                        : ""
                                }
                            />


                            <TextField
                                label="Codigo postal"
                                name="postal_code"
                                required
                                fullWidth
                                value={postal_code}
                                onChange={(e) => {
                                    // Solo permite números
                                    if (e.target.value === '' || /^[0-9\b]+$/.test(e.target.value)) {

                                        handleInputChange(e, setPostalCode, mode);
                                    }
                                }}
                                inputProps={{ maxLength: 5 }}
                                margin="dense"
                                error={postal_code.length > 0 && postal_code.length > 5}
                                helperText={
                                    postal_code.length > 0 && postal_code.length > 5
                                        ? "El numero interior debe tener entre 1 y 5 caracteres"
                                        : ""
                                }
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
