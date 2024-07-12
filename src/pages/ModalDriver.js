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

export default function ModalDriver({ mode , creatorUser, userToEdit}) {

    const [creator, setCreator] = useState(creatorUser);
    const [groups, setGroups] = useState([])
    const [users, setUsers] = useState([])
    const [companies, setCompanies] = useState([""])
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [license, setLicense] = useState("");
    const [phone, setPhone] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const [old_user, setOldUser] = useState("");
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
      };

    const {setUpdateDriverInfo, openModalText, setTextOpenModalText, setOpenModalText, openModalCreateDriver, setOpenModalCreateDriver, openModalEditDriver, openModalDeleteDriver, setOpenModalEditDriver, setOpenModalDeleteDriver } = useContext(TodoContext);
    const closeModal = () => {
        if (openModalCreateDriver) {
            setOpenModalCreateDriver(false);
        }
        if (openModalEditDriver) {
            setOpenModalEditDriver(false);
        }
        if (openModalDeleteDriver) {
            setOpenModalDeleteDriver(false);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === "CREAR") {
            const nuevoDato = {
                user: e.target.email.value,
                password: e.target.password.value,
                email: e.target.email.value,
                first_name: e.target.nombre.value,
                last_name: e.target.apellido.value,
                phone: e.target.phone.value,
                license: e.target.license.value,
                user_permissions: "Escritura",
                creator_user: creator
              
            };

            axios
                .post(`${process.env.REACT_APP_API_URL}/create-driver/`, nuevoDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Conductor creado correctamente")
                    setUpdateDriverInfo((prev)=>!prev);
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
                email: e.target.email.value,
                first_name: e.target.nombre.value,
                last_name: e.target.apellido.value,
                phone: e.target.phone.value,
                license: e.target.license.value,
                user_permissions: "Escritura",
                creator_user: creator,
                

                old_license: old_user,
            };

            axios
                .put(`${process.env.REACT_APP_API_URL}/update-driver/`, editarDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Donador editado correctamente")
                    setUpdateDriverInfo((prev)=>!prev);
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

            const deleteDato = {
                user: e.target.email.value,
                user_permissions: "Escritura",
                creator_user: creator,
            }

            axios
                .post(`${process.env.REACT_APP_API_URL}/delete-driver/`, deleteDato)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setOpenModalText(true);
                    setTextOpenModalText("Donador borrado correctamente")
                    setUpdateDriverInfo(prev => !prev);
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
            .get(`${process.env.REACT_APP_API_URL}/get-all-drivers/`)
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
        const fetchUsers = axios.get(`${process.env.REACT_APP_API_URL}/get-all-drivers/`)
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
            if (mode === "EDITAR") {
                setUser(userToEdit.user);
                setPhone(userToEdit.phone);
                setLicense(userToEdit.license);
                setFirstName(userToEdit.first_name);
                setLastName(userToEdit.last_name);
                setEmail(userToEdit.user);
                setOldUser(userToEdit.license);
            }
        }, [userToEdit, mode]);


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
                            <Title> Conductores</Title>
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
                                <TextField
                                    label="Licencia"
                                    name="license"
                                    required
                                    fullWidth
                                    value={license}
                                    onChange={(e) => handleInputChange(e, setLicense, mode)}
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
