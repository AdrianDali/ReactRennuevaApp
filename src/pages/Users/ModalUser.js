import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/user/CreateUser.css';
import { TodoContext } from '../../context/index.js';
import axios from 'axios';
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel, IconButton, InputAdornment } from '@mui/material';
import Title from '../../components/Title';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteUserModal from '../../components/modals/DeleteUserModal.jsx';
import { Close } from '@mui/icons-material';



function ModalUser({ mode, creatorUser, userToEdit = null, centers = [], recyclingCenters = null, collectionCenters = null }) {
  const [groups, setGroups] = useState([""])
  const [users, setUsers] = useState([""])
  const [companies, setCompanies] = useState([""])
  const [user, setUser] = useState(userToEdit ? userToEdit.user : "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(userToEdit ? userToEdit.email : "");
  const [first_name, setFirstName] = useState(userToEdit ? userToEdit.first_name : "");
  const [last_name, setLastName] = useState(userToEdit ? userToEdit.last_name : "");
  const [group, setGroup] = useState(userToEdit ? userToEdit.groups[0] : "");
  const [company, setCompany] = useState(userToEdit ? userToEdit.company : "");
  const [state, setState] = useState(userToEdit ? userToEdit.address_state : "");
  const [city, setCity] = useState(userToEdit ? userToEdit.address_city : "");
  const [locality, setLocality] = useState(userToEdit ? userToEdit.address_locality : "");
  const [street, setStreet] = useState(userToEdit ? userToEdit.address_street : "");
  const [postal_code, setPostalCode] = useState(userToEdit ? userToEdit.address_postal_code : "");
  const [rfc, setRfc] = useState(userToEdit ? userToEdit.rfc : "");
  const [phone, setPhone] = useState(userToEdit ? userToEdit.phone : "");
  const [address_num_int, setAddressNumInt] = useState(userToEdit ? userToEdit.address_num_int : "");
  const [old_user, setOldUser] = useState(userToEdit ? userToEdit.user : "");
  const [razon_social, setRazonSocial] = useState(userToEdit ? userToEdit.razon_social : "");

  //logica para centros de reciclaje y centrons de acopio
  const [reciclingCenter, setReciclingCenter] = useState(() => {
    if (userToEdit) {
      const { recycling_center } = userToEdit;
      return recycling_center;
    }
    return '';
  });

  const [collectionCenter, setCollectionCenter] = useState(() => {
    if (userToEdit) {
      const { collection_center } = userToEdit;
      return collection_center;
    }
    return '';
  });

  const [center, setCenter] = useState(() => {
    if (userToEdit) {
      const { recycling_center, collection_center } = userToEdit;
      console.log("###################### CENTER ##################################")
      console.log(recycling_center !== 'NO APLICA' ? recycling_center : collection_center !== 'NO APLICA' ? collection_center : '');

      return recycling_center !== 'NO APLICA' ? recycling_center : collection_center !== 'NO APLICA' ? collection_center : '';
    }
    return '';
  });

  const [centerEdit, setCenterEdit] = useState(() => {
    if (userToEdit) {
      const { recycling_center, collection_center } = userToEdit;
      console.log("###################### CENTER ##################################")
      console.log(recycling_center !== 'NO APLICA' ? recycling_center : collection_center !== 'NO APLICA' ? collection_center : '');

      return recycling_center !== 'NO APLICA' ? recycling_center : collection_center !== 'NO APLICA' ? collection_center : '';
    }
    return '';
  });

  // const [centers, setCenters] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [address_num_ext, setAddressNumExt] = useState(userToEdit ? userToEdit.address_num_ext : "");
  const [address_reference, setAddressReference] = useState(userToEdit ? userToEdit.address_reference : "");
  const [permisos, setPermisos] = useState([{ "name": "Lectura" }, { "name": "Escritura" }])
  const [permiso, setPermiso] = useState("Lectura")
  const [creator, setCreator] = useState(creatorUser)
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [filteredCenters, setFilteredCenters] = useState([]);

  useEffect(() => {
    // Filtrar la lista de centros por el CenterName
    const filtered = centers.filter(c => c.CenterName === center);
    console.log("###################### FILTERED ##################################")
    console.log(filtered)
    setFilteredCenters(filtered);
  }, [centers, center]);
  const { setUpdateUserInfo, setTextOpenModalText, setOpenModalText, openModalCreate, setOpenModalCreate, openModalEdit, openModalDelete, setOpenModalEdit, setOpenModalDelete, updateUserInfo } = useContext(TodoContext);
  const closeModal = () => {
    if (openModalCreate) {
      setOpenModalCreate(false);
    }
    if (openModalEdit) {
      setOpenModalEdit(false);
    }
    if (openModalDelete) {
      setOpenModalDelete(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "CREAR") {
      var rfcValue = e.target.rfc.value
      if (!rfcValue) {
        rfcValue = 'XAXX010101000'; // Aquí puedes poner el RFC por defecto que desees
      }
      const nuevoDato = {
        user: e.target.email.value,
        password: e.target.password.value,
        email: e.target.email.value,
        first_name: e.target.nombre.value,
        last_name: e.target.apellido.value,
        group: group,
        rfcValue: rfcValue,
        company: "Rennueva",
        phone: e.target.phone.value,
        address_state: e.target.state.value,
        address_city: e.target.city.value,
        address_locality: e.target.locality.value,
        address_street: e.target.street.value,
        address_postal_code: e.target.postal_code.value,
        address_num_int: e.target.address_num_int.value,
        address_num_ext: e.target.address_num_ext.value,
        address_reference: e.target.address_reference.value,
        address_lat: 0,
        address_lng: 0,
        razon_social: e.target.razon_social.value,
        user_permissions: permiso,
        creator_user: creator,
        associated_center: center.CenterName
      };


      axios
        .post(`${process.env.REACT_APP_API_URL}/create-django-user/`, nuevoDato)
        .then(response => {
          const data = response.data;
          console.log(data)
          setOpenModalText(true);
          setTextOpenModalText("Usuario creado correctamente")
          setUpdateUserInfo(true);
          e.target.reset();
          closeModal()

        })
        .catch(error => {
          console.error("############################");
          setOpenModalText(true);

          // Check if error response and data exist
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.errorMessage || "Algo salió mal. Intenta de nuevo";
            setTextOpenModalText(`Algo salió mal. Intenta de nuevo \n ${errorMessage}`);
          } else {
            setTextOpenModalText("Algo salió mal. Intenta de nuevo");
          }

          console.error(error.response);
        })

    }
    if (mode === "EDITAR") {

      var rfcValue = e.target.rfc.value
      if (!rfcValue) {
        rfcValue = 'XAXX010101000'; // Aquí puedes poner el RFC por defecto que desees
      }

      const editarDato = {
        user: e.target.email.value,
        //password: e.target.password.value,
        email: e.target.email.value,
        first_name: e.target.nombre.value,
        last_name: e.target.apellido.value,
        group: group,
        rfc: rfcValue,
        company: "Rennueva",
        phone: e.target.phone.value,
        address_state: e.target.state.value,
        address_city: e.target.city.value,
        address_locality: e.target.locality.value,
        address_street: e.target.street.value,
        address_postal_code: e.target.postal_code.value,
        address_num_int: e.target.address_num_int.value,
        address_num_ext: e.target.address_num_ext.value,
        address_reference: e.target.address_reference.value,
        address_lat: 0,
        address_lng: 0,
        razon_social: e.target.razon_social.value,
        antiguoUser: old_user,
        user_permissions: permiso,
        creator_user: creatorUser,
        associated_center: center.CenterName


      };

      console.log("##SDAFSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDSDFSDFSDF")
      console.log(editarDato)

      axios
        .put(`${process.env.REACT_APP_API_URL}/update-django-user/`, editarDato)
        .then(response => {
          const data = response.data;
          console.log(data)
          setOpenModalText(true);
          setTextOpenModalText("Usuario editado correctamente")
          setUpdateUserInfo(true);
          e.target.reset();
          closeModal()
          // Limpiar los campos del formulario
        })
        .catch(error => {
          console.error("############################");
          setOpenModalText(true);

          // Check if error response and data exist
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.errorMessage || "Algo salió mal. Intenta de nuevo";
            setTextOpenModalText(`Algo salió mal. Intenta de nuevo \n ${errorMessage}`);
          } else {
            setTextOpenModalText("Algo salió mal. Intenta de nuevo");
          }

          console.error(error.response);
        })

    }
    if (mode === "BORRAR") {
      const antiguo_user = document.getElementById("user-select")
      var user_ant = antiguo_user ? antiguo_user.value : null;

      const deleteDato = {
        email: user,
        creator_user: creatorUser
      }

      axios
        .put(`${process.env.REACT_APP_API_URL}/delete-django-user/`, deleteDato)
        .then(response => {
          const data = response.data;
          console.log("###################### DELETE ##################################")
          console.log(data)
          setOpenModalText(true);
          setTextOpenModalText("Usuario borrado correctamente")
          setUpdateUserInfo(true);
          e.target.reset();
          closeModal()

        })
        .catch(error => {
          console.error("############################");
          setOpenModalText(true);

          // Check if error response and data exist
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.errorMessage || "Algo salió mal. Intenta de nuevo";
            setTextOpenModalText(`Algo salió mal. Intenta de nuevo \n ${errorMessage}`);
          } else {
            setTextOpenModalText("Algo salió mal. Intenta de nuevo");
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

    // Definir las peticiones pero no ejecutarlas todavía
    const fetchGroups = axios.get(`${process.env.REACT_APP_API_URL}/get-all-groups/`);
    const fetchUsers = axios.get(`${process.env.REACT_APP_API_URL}/get-all-users-with-group/`);
    const fetchCompanies = axios.get(`${process.env.REACT_APP_API_URL}/get-all-companies/`);
    // Ejecutar todas las peticiones en paralelo y establecer los estados una vez que todas hayan terminado
    Promise.all([fetchGroups, fetchUsers, fetchCompanies])
      .then((responses) => {
        // 'responses' es un array que contiene las respuestas de todas las peticiones
        // en el mismo orden en que fueron añadidas en Promise.all

        const groupsData = responses[0].data;
        const usersData = responses[1].data;
        const companiesData = responses[2].data;
        setGroups(groupsData);
        setUsers(usersData);
        setCompanies(companiesData);
      })
      .catch((errors) => {
        // Manejar errores aquí si alguna de las promesas falla
        console.error(errors);
      });
  }, []);

  useEffect(() => {

    if (center === "") {
      setState(userToEdit ? userToEdit.address_state : "")
      setCity(userToEdit ? userToEdit.address_city : "")
      setLocality(userToEdit ? userToEdit.address_locality : "")
      setStreet(userToEdit ? userToEdit.address_street : "")
      setAddressNumInt(userToEdit ? userToEdit.address_num_int : "")
      setPostalCode(userToEdit ? userToEdit.address_postal_code : "")
      setAddressNumExt(userToEdit ? userToEdit.address_num_ext : "")
      setAddressReference(userToEdit ? userToEdit.address_reference : "")
    } else {
      console.log("###################### CENTER ##################################")
      console.log(center)
      console.log("###################### CENTERS ##################################")
      console.log(centers)

      if (mode === "EDITAR" || mode === "BORRAR") {
        const centerData = centers.find((cen) => cen.CenterName === centerEdit);
        console.log("###################### CENTER FETCHED ##################################")
        console.log(centerData)
        console.log("###################### CENTER FETCHED ##################################")
        console.log(centerData)
        setState(centerData ? centerData.AddressState : "")
        setCity(centerData ? centerData.AddressCity : "")
        setLocality(centerData ? centerData.AddressLocality : "")
        setStreet(centerData ? centerData.AddressStreet : "")
        setAddressNumInt(centerData ? centerData.AddressNumInt : "")
        setPostalCode(centerData ? centerData.AddressPostalCode : "")
        setAddressNumExt(centerData ? centerData.AddressNumExt : "")
        setAddressReference(centerData ? centerData.AddressReference : "")
      } else {
        const centerData = centers.find((cen) => cen.CenterName === center.CenterName);
        console.log("###################### CENTER FETCHED ##################################")
        console.log(centerData)
        setState(centerData ? centerData.AddressState : "")
        setCity(centerData ? centerData.AddressCity : "")
        setLocality(centerData ? centerData.AddressLocality : "")
        setStreet(centerData ? centerData.AddressStreet : "")
        setAddressNumInt(centerData ? centerData.AddressNumInt : "")
        setPostalCode(centerData ? centerData.AddressPostalCode : "")
        setAddressNumExt(center?.AddressNumExt ? center.AddressNumExt : "")
        setAddressReference(centerData ? centerData.AddressReference : "")
      }

    }
    console.log("###################### CENTER FETCHED ##################################")
    console.log(center)

  }, [center, centers]);

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value; // Obtener la opción seleccionada

    setState("SDSADASD")
    setCity(selectedOption.AddressCity)
    setLocality(selectedOption.AddressLocality)
    setStreet(selectedOption.AddressStreet)
    setPostalCode(selectedOption.AddressPostalCode)
    setAddressNumInt(selectedOption.AddressNumInt)
    setAddressNumExt(selectedOption.AddressNumExt)
    setAddressReference(selectedOption.AddressReference)
    setCenter(selectedOption.CenterName)

  }

  const handleInputChange = (e, setState, mode) => {

    const currentInputValue = e.target.value;
    console.log(currentInputValue)
    if (mode !== "BORRAR") {
      setState(currentInputValue);
    }
    if (mode === "EDITAR") {


      setCenterEdit(currentInputValue.CenterName)


      setState(currentInputValue);

      setCenter(currentInputValue)


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
        maxWidth: '95%',
        boxSizing: 'border-box',
        maxHeight: '95%'
      }}>
        <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 2, top: 2 }}><Close /></IconButton>
        {mode === "CREAR" || mode === "EDITAR" ? (
          <form onSubmit={handleSubmit} >
            <Box>
              <Title> Usuario</Title>
            </Box>
            <Box mt={2} mb={2} sx={{ overflowY: 'auto', maxHeight: 450 }}>
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
                label="Razón social"
                name="razon_social"
                required
                fullWidth
                value={razon_social}
                onChange={(e) => handleInputChange(e, setRazonSocial, mode)}
                margin="dense"
                inputProps={{
                  maxLength: 50 // Opcional: si quieres forzar la longitud máxima en el HTML
                }}
                error={razon_social.length > 0 && (razon_social.length < 0 || razon_social.length > 50)}
                helperText={
                  razon_social.length > 0 && (razon_social.length < 50 || razon_social.length > 50)
                    ? "La Razón Social debe tener entre 0 y 50 caracteres"
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

              <FormControl fullWidth margin='dense'>
                <InputLabel id="user-permissions-select-label">Permisos</InputLabel>
                <Select
                  label="Permisos"
                  labelId="user-permissions-select-label"
                  id="user-permissions-select"
                  required
                  value={permiso}
                  onChange={(e) => {
                    handleInputChange(e, setPermiso, mode)
                    //handleGroupChange(e)
                  }}
                >
                  {permisos.map((name, index) => (
                    <MenuItem key={index} value={name.name}>{name.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>


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

              <FormControl fullWidth margin='dense'>
                <InputLabel id="user-group-select-label">Grupo</InputLabel>
                <Select
                  label="Grupo"
                  labelId="user-group-select-label"
                  id="user-group-select"
                  required
                  value={group}
                  onChange={(e) => {
                    handleInputChange(e, setGroup, mode)
                    //handleGroupChange(e)
                  }}
                >
                  {groups.map((name, index) => (
                    <MenuItem key={index} value={name.name}>{name.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {
                group === "Acopio"
                && (
                  <FormControl fullWidth margin='dense'>
                    <InputLabel id="user-centro-select-label">Centro de Acopio</InputLabel>
                    <Select
                      label="Centro de Acopio"
                      labelId="user-centro-select-label"
                      id="centro-select"
                      required
                      value={collectionCenters.find((cen) => cen.CenterName === center)}
                      onChange={(e) => { handleInputChange(e, setCenter, mode) }}
                    >
                      {collectionCenters.map((option, index) => (
                        console.log("###################### OPTION ##################################"),
                        console.log(option),
                        console.log(index),
                        <MenuItem key={index} value={option}>{option.CenterName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>


                )

              }
              {
                group === "Reciclaje"
                && (
                  <FormControl fullWidth margin='dense'>
                    <InputLabel id="centro-select-label">Centro de Reciclaje</InputLabel>
                    <Select
                      labelId="centro-select-label"
                      id="centro-select"
                      required
                      value={recyclingCenters.find((cen) => cen.CenterName === center)}
                      onChange={(e) => { handleInputChange(e, setCenter, mode) }}
                    >
                      {recyclingCenters.map((option, index) => (
                        console.log("###################### OPTION ##################################"),
                        console.log(option),
                        console.log(index),
                        <MenuItem key={index} value={option}>{option.CenterName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>


                )

              }


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

              <Title>Ubicación</Title>
              <TextField
                label="Estado"
                name="state"
                required
                fullWidth
                value={state}
                onChange={(e) => handleInputChange(e, setState, mode)}
                margin="dense"
                inputProps={{
                  readOnly: ["Centro", "Acopio", "Reciclaje"].includes(group),
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
                  readOnly: ["Centro", "Acopio", "Reciclaje"].includes(group),
                  maxLength: 50, // Opcional: si quieres forzar la longitud máxima en el HTML
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
                  readOnly: ["Centro", "Acopio", "Reciclaje"].includes(group),
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
                  readOnly: ["Centro", "Acopio", "Reciclaje"].includes(group),
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
                label="Número exterior"
                name="address_num_ext"
                required
                fullWidth
                value={address_num_ext}
                InputLabelProps={["Centro", "Acopio", "Reciclaje"].includes(group)?{shrink: true}: {}}
                onChange={(e) => {
                  // Solo permite números
                  if (e.target.value === '' || /^[0-9\b]+$/.test(e.target.value)) {
                    handleInputChange(e, setAddressNumExt, mode);
                  }
                }}
                inputProps={{
                  readOnly: ["Centro", "Acopio", "Reciclaje"].includes(group),
                  maxLength: 5
                }}
                margin="dense"
                error={address_num_ext?.length > 0 && address_num_ext?.length > 5}
                helperText={
                  address_num_ext?.length > 0 && address_num_ext?.length > 5
                    ? "El número exterior debe tener entre 1 y 5 caracteres"
                    : ""
                }
              />
              <TextField
                label="Número interior"
                name="address_num_int"
                fullWidth
                value={address_num_int}
                onChange={(e) => {
                  // Solo permite números
                  if (e.target.value === '' || /^[0-9\b]+$/.test(e.target.value)) {
                    handleInputChange(e, setAddressNumInt, mode);
                  }
                }}
                InputLabelProps={["Centro", "Acopio", "Reciclaje"].includes(group)?{shrink: true}: {}}
                inputProps={{
                  readOnly: ["Centro", "Acopio", "Reciclaje"].includes(group),
                  maxLength: 5
                }}
                margin="dense"
                error={address_num_int.length > 0 && address_num_int.length > 5}
                helperText={
                  address_num_int.length > 0 && address_num_int.length > 5
                    ? "El número interior debe tener entre 1 y 5 caracteres"
                    : ""
                }
              />

              <TextField
                label="Código postal"
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
                inputProps={{
                  readOnly: ["Centro", "Acopio", "Reciclaje"].includes(group),
                  maxLength: 5
                }}
                margin="dense"
                error={postal_code.length > 0 && postal_code.length > 5}
                helperText={
                  postal_code.length > 0 && postal_code.length > 5
                    ? "El número interior debe tener entre 1 y 5 caracteres"
                    : ""
                }
              />

              <TextField
                label="Referencias"
                name="address_reference"
                multiline
                fullWidth
                value={address_reference}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    handleInputChange(e, setAddressReference, mode);
                  }
                }}
                inputProps={{
                  readOnly: ["Centro", "Acopio", "Reciclaje"].includes(group),
                  maxLength: 100
                }}
                margin="dense"
                error={address_reference?.length > 100}
                helperText={
                  address_reference?.length > 100
                    ? "Máximo 100 caracteres"
                    : ""
                }
              />
            </Box>
            <Button type="submit" variant="contained" fullWidth>{mode}</Button>
          </form>) : (
          mode === "BORRAR" ? (
            <DeleteUserModal users={users} />

          ) : (
            null
          )
        )}
      </Box>
    </Modal>,

    document.getElementById('modal')

  );
}

export { ModalUser };
