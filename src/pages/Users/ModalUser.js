import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/user/CreateUser.css';
import { TodoContext } from '../../context/index.js';
import axios from 'axios';
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel, IconButton, InputAdornment, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; 
import { useTheme, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import Title from '../../components/Title';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteUserModal from '../../components/modals/DeleteUserModal.jsx';
import { Close } from '@mui/icons-material';
import { set } from 'date-fns';



function ModalUser({ mode, creatorUser, userToEdit = null, centers = [], recyclingCenters = null, collectionCenters = null }) {
  console.log("userToEdit", userToEdit)
  console.log("centers", centers)
  console.log("recyclingCenters", recyclingCenters)
  console.log("collectionCenters", collectionCenters)
  console.log("mode", mode)
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

  const [center, setCenter] = useState(() => {
    if (userToEdit) {
      const { recycling_center, collection_center } = userToEdit;
      console.log("###################### CENTER ##################################")
      console.log(recycling_center !== 'NO APLICA' ? recycling_center : collection_center !== 'NO APLICA' ? collection_center : '');

      return recycling_center !== 'NO APLICA' ? recycling_center : collection_center !== 'NO APLICA' ? collection_center : '';
    }
    return '';
  });
  const addressDisabled = Boolean(center);


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
  const [permiso, setPermiso] = useState(userToEdit ? userToEdit.user_permissions : "Lectura");
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
        associated_center: center
      };
      console.log("##################")
      console.log(nuevoDato)



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
        const centerData = centers.find((cen) => cen.CenterName === center);
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
        //setAddressNumExt(centerData ? centerData.AddressNumExt : "")
        //setAddressReference(centerData ? centerData.AddressReference : "")
      } else {
        console.log(centers)
        console.log(center)
        const centerData = centers.find((cen) => center === cen.CenterName);
        console.log("###################### CENTER FETCHED ##################################")
        console.log(centerData)
        setState(centerData ? centerData.AddressState : "")
        setCity(centerData ? centerData.AddressCity : "")
        setLocality(centerData ? centerData.AddressLocality : "")
        setStreet(centerData ? centerData.AddressStreet : "")
        setAddressNumInt(centerData ? centerData.AddressNumInt : "")
        setPostalCode(centerData ? centerData.AddressPostalCode : "")
        setAddressNumExt(center?.AddressNumExt ? center.AddressNumExt : "")
        //setAddressReference(centerData ? centerData.AddressReference : "")
      }

    }
    console.log("###################### CENTER FETCHED ##################################")
    console.log(center)

  }, [center, centers]);

  const handleCenterChange = (e, setState, mode) => {
    console.log(e.target.value) 
    console.log(setState)
    console.log(mode)
    const currentInputValue = e.target.value;
    

    console.log(currentInputValue)
    


    if (mode !== "BORRAR") {
      setState(currentInputValue);
    }
    if (mode === "EDITAR") {

      if (currentInputValue === "Acopio" || currentInputValue === "Reciclaje") {
        console.log("###################### CENTER FETCHED ##################################")
        console.log("###################### CENTER FETCHED ##################################")
        console.log(currentInputValue)
        setCenter(currentInputValue)
      }else{
        console.log("###################### CENTER FETCHED ##################################")
        console.log("###################### CENTER FETCHED ##################################")
        setCenter("")
      }

      setCenterEdit(currentInputValue.CenterName)


      setState(currentInputValue);


      

    }
    if (mode === "CREAR") {
      setCenter()
    }
  }

  const handleInputChange = (e, setState, mode) => {

    console.log(e.target.value) 
    console.log(setState)
    console.log(mode)
    const currentInputValue = e.target.value;
    

    console.log(currentInputValue)
    
    if (mode !== "BORRAR") {
      setState(currentInputValue);
    }
    //if (mode === "EDITAR") {


      //setCenterEdit(currentInputValue.CenterName)


      //setState(currentInputValue);

      //setCenter(currentInputValue)


    //}

  };

  

  return ReactDOM.createPortal(
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      scroll="paper"
      TransitionProps={{
        timeout: 400,
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">
          {mode === 'CREAR' ? 'Crear Usuario' : 'Editar Usuario'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: fullScreen ? 2 : 4 }}>
        <form id="user-form" onSubmit={handleSubmit}>
          <Grid container spacing={fullScreen ? 2 : 4}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="nombre"
                required
                fullWidth
                value={first_name}
                onChange={(e) => handleInputChange(e, setFirstName, mode)}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                name="apellido"
                required
                fullWidth
                value={last_name}
                onChange={(e) => handleInputChange(e, setLastName, mode)}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="RFC"
                name="rfc"
                fullWidth
                value={rfc}
                onChange={(e) => handleInputChange(e, setRfc, mode)}
                inputProps={{ maxLength: 13 }}
                error={rfc.length > 0 && (rfc.length < 12 || rfc.length > 13)}
                helperText={
                  rfc.length > 0 && (rfc.length < 12 || rfc.length > 13)
                    ? 'El RFC debe tener entre 12 y 13 caracteres'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Razón Social"
                name="razon_social"
                required
                fullWidth
                value={razon_social}
                onChange={(e) => handleInputChange(e, setRazonSocial, mode)}
                inputProps={{ maxLength: 50 }}
                error={
                  razon_social.length > 0 && razon_social.length > 50
                }
                helperText={
                  razon_social.length > 50
                    ? 'Máximo 50 caracteres'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Usuario"
                name="email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => handleInputChange(e, setEmail, mode)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Permisos</InputLabel>
                <Select
                  label="Permisos"
                  value={permiso}
                  onChange={(e) => handleInputChange(e, setPermiso, mode)}
                >
                  {permisos.map((item, idx) => (
                    <MenuItem key={idx} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {mode === 'CREAR' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword, mode)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Grupo</InputLabel>
                <Select
                  label="Grupo"
                  value={group}
                  onChange={(e) => handleCenterChange(e, setGroup, mode)}
                >
                  {groups.map((item, idx) => (
                    <MenuItem key={idx} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {group === 'Acopio' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Centro de Acopio</InputLabel>
                  <Select
                    label="Centro de Acopio"
                    value={center}
                    onChange={(e) => handleInputChange(e, setCenter, mode)}
                  >
                    {collectionCenters.map((cen, idx) => (
                      <MenuItem key={idx} value={cen.CenterName}>
                        {cen.CenterName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {group === 'Reciclaje' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Centro de Reciclaje</InputLabel>
                  <Select
                    label="Centro de Reciclaje"
                    value={center}
                    onChange={(e) => handleInputChange(e, setCenter, mode)}
                  >
                    {recyclingCenters.map((cen, idx) => (
                      <MenuItem key={idx} value={cen.CenterName}>
                        {cen.CenterName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Celular"
                name="phone"
                required
                fullWidth
                value={phone}
                onChange={(e) => handleInputChange(e, setPhone, mode)}
                inputProps={{ maxLength: 10, type: 'tel' }}
                error={phone.length > 0 && phone.length < 10}
                helperText={
                  phone.length > 0 && phone.length < 10
                    ? 'El número debe ser de 10 dígitos'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Dirección
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estado"
                name="state"
                required
                fullWidth
                disabled={addressDisabled}
                value={state}
                onChange={(e) => handleInputChange(e, setState, mode)}
                inputProps={{ maxLength: 50 }}
                error={state.length > 0 && (state.length < 3 || state.length > 50)}
                helperText={
                  state.length > 0 && (state.length < 3 || state.length > 50)
                    ? 'El estado debe tener entre 3 y 50 caracteres'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ciudad"
                name="city"
                required
                fullWidth
                disabled={addressDisabled}
                value={city}
                onChange={(e) => handleInputChange(e, setCity, mode)}
                inputProps={{ maxLength: 50 }}
                error={city.length > 0 && (city.length < 3 || city.length > 50)}
                helperText={
                  city.length > 0 && (city.length < 3 || city.length > 50)
                    ? 'La ciudad debe tener entre 3 y 50 caracteres'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Colonia"
                name="locality"
                required
                fullWidth
                disabled={addressDisabled}
                value={locality}
                onChange={(e) => handleInputChange(e, setLocality, mode)}
                inputProps={{ maxLength: 50 }}
                error={locality.length > 0 && (locality.length < 3 || locality.length > 50)}
                helperText={
                  locality.length > 0 && (locality.length < 3 || locality.length > 50)
                    ? 'La colonia debe tener entre 3 y 50 caracteres'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Calle"
                name="street"
                required
                fullWidth
                disabled={addressDisabled}
                value={street}
                onChange={(e) => handleInputChange(e, setStreet, mode)}
                inputProps={{ maxLength: 50 }}
                error={street.length > 0 && (street.length < 3 || street.length > 50)}
                helperText={
                  street.length > 0 && (street.length < 3 || street.length > 50)
                    ? 'La calle debe tener entre 3 y 50 caracteres'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número exterior"
                name="address_num_ext"
                required
                fullWidth
                disabled={addressDisabled}
                value={address_num_ext}
                onChange={(e) => handleInputChange(e, setAddressNumExt, mode)}
                inputProps={{ maxLength: 5 }}
                error={
                  address_num_ext.length > 5
                }
                helperText={
                  address_num_ext.length > 5
                    ? 'Máximo 5 dígitos'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número interior"
                name="address_num_int"
                fullWidth
                disabled={addressDisabled}
                value={address_num_int}
                onChange={(e) => handleInputChange(e, setAddressNumInt, mode)}
                inputProps={{ maxLength: 5 }}
                error={
                  address_num_int.length > 5
                }
                helperText={
                  address_num_int.length > 5
                    ? 'Máximo 5 dígitos'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código postal"
                name="postal_code"
                required
                fullWidth
                disabled={addressDisabled}
                value={postal_code}
                onChange={(e) => handleInputChange(e, setPostalCode, mode)}
                inputProps={{ maxLength: 5 }}
                error={postal_code.length > 5}
                helperText={
                  postal_code.length > 5
                    ? 'Máximo 5 dígitos'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Referencias"
                name="address_reference"
                multiline
                fullWidth
                disabled={addressDisabled}
                rows={3}
                value={address_reference}
                onChange={(e) => handleInputChange(e, setAddressReference, mode)}
                inputProps={{ maxLength: 100 }}
                error={address_reference.length > 100}
                helperText={
                  address_reference.length > 100
                    ? 'Máximo 100 caracteres'
                    : ''
                }
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: fullScreen ? 2 : 3 }}>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button type="submit" form="user-form" variant="contained">
          {mode}
        </Button>
      </DialogActions>
    </Dialog>,

    document.getElementById('modal')

  );
}

export { ModalUser };
