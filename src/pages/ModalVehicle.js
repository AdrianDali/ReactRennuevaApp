import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/user/CreateUser.css';
import { TodoContext } from '../context/index.js';
import axios from 'axios';
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel } from '@mui/material';
import Title from '../components/Title';

function ModalVehicle({ mode, creatorUser }) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState("");
  const [residue, setVehicle] = useState("");
  const [oldVehicle, setOldVehicle] = useState("");
  const [id, setId] = useState("");

    const [nombre, setNombre] = useState("");
    const [placas, setPlacas] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [permiso, setPermiso] = useState("");
    const [creator, setCreator] = useState(creatorUser);



  const {  setUpdateVehicleInfo ,openModalCreateVehicle, setOpenModalText, setTextOpenModalText, setOpenModalCreateVehicle, openModalEditVehicle, setOpenModalEditVehicle, openModalDeleteVehicle, setOpenModalDeleteVehicle } = useContext(TodoContext);

  const closeModal = () => {
    if (openModalCreateVehicle) {
      setOpenModalCreateVehicle(false);
    }
    if (openModalEditVehicle) {
      setOpenModalEditVehicle(false);
    }
    if (openModalDeleteVehicle) {
      setOpenModalDeleteVehicle(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();



    const nuevoDato = {
      modelo: e.target.nombre.value,
      placas: e.target.placas.value,
      capacidad: e.target.capacidad.value,
      idConductor: id,
      permiso: e.target.permiso.value,
      creator_user: creator
    };
    const editarDato = {
        modelo: e.target.nombre.value,
        placas: e.target.placas.value,
        capacidad: e.target.capacidad.value,
        idConductor: id,
        antiguasPlacas: oldVehicle,
        permiso: e.target.permiso.value,
        creator_user: creator
        };
        

    //   const antiguo_user = document.getElementById("mySelect")
    //   var user_ant = antiguo_user ? antiguo_user.value : null;

    //   const editarDato = {
    //     user: e.target.user.value,

    //   };

    //   const deleteDato = {
    //     user : user_ant
    //   }
    if (mode === "CREAR") {
      axios
        .post(`${process.env.REACT_APP_API_URL}/create-vehicle/`, nuevoDato)
        .then(response => {
          const data = response.data;
          console.log(data)
          setOpenModalText(true);
          setTextOpenModalText("Vehículo creado correctamente")
          setUpdateVehicleInfo(true)
          closeModal()
          // setOpenModalText(true);
          e.target.reset();


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
      axios
        .put(`${process.env.REACT_APP_API_URL}/update-vehicle/`, editarDato)
        .then(response => {
          const data = response.data;
          console.log(data)
          setOpenModalText(true);
          setTextOpenModalText("Vehículo editado correctamente")
          setUpdateVehicleInfo(true)
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
      axios
        .post(`${process.env.REACT_APP_API_URL}/delete-vehicle/`, { placas: oldVehicle, creator_user: creator })
        .then(response => {
          const data = response.data;
          console.log(data)
          setOpenModalText(true);
          setTextOpenModalText("Vehículo borrado correctamente")
          setUpdateVehicleInfo(true)
          e.target.reset();
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
    e.target.reset();
  };

  useEffect(() => {

    const fetchVehicles =axios.get(`${process.env.REACT_APP_API_URL}/get-all-vehicle/`)

    const fetchDrivers =axios.get(`${process.env.REACT_APP_API_URL}/get-all-drivers/`)

    axios.all([fetchVehicles, fetchDrivers]).then(
      axios.spread((...allData) => {
        const allDataVehicles = allData[0].data;
        const allDataDrivers = allData[1].data;
        setVehicles(allDataVehicles)
        setDrivers(allDataDrivers)
        console.log("######################GRUPOS##################################")
        console.log(allDataVehicles)
        console.log(allDataDrivers)

      })
    )
      .catch(error => {
        console.error(error);
      });
  }, []);
  


  const handleDriverSelectChange = (event) => {
    const selectedOption = event.target.value; // Obtener la opción seleccionada
    console.log(selectedOption)
    setId(selectedOption)
    //setOldVehicle(selectedOption)
    // Buscar el dato seleccionado en el arreglo de datos
    const datoEncontrado = drivers.find((drivers) => drivers.id === selectedOption);
    console.log("dato encontrado")
    console.log(datoEncontrado)
 
  }


  const handleSelectChange = (event) => {
    const selectedOption = event.target.value; // Obtener la opción seleccionada
    setOldVehicle(selectedOption)
    console.log("selectedOption")
    console.log(selectedOption)

    // Buscar el dato seleccionado en el arreglo de datos
    const datoEncontrado = vehicles.find((vehicles) => vehicles.placas === selectedOption);
    console.log("dato encontrado")
    console.log(datoEncontrado)
    setVehicle(datoEncontrado.placas)
    setNombre(datoEncontrado.modelo)
    setPlacas(datoEncontrado.placas)
    setCapacidad(datoEncontrado.capacidad)
    setDriver(datoEncontrado.idConductor)
    setId(datoEncontrado.idConductor)
    setPermiso(datoEncontrado.permiso)







}


  const handleInputChange = (e, setState, mode) => {
    const currentInputValue = e.target.value;

    if (mode !== "BORRAR") {
      setState(currentInputValue);
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
            <Title> Vehículos</Title>
            {mode === "EDITAR" || mode === "BORRAR" ? (
              <FormControl fullWidth>
                <InputLabel id="vehicle-select-label">Vehículo</InputLabel>
                <Select
                  labelId="vehicle-select-label"
                  id="vehicle-select"
                  onChange={(e) => handleSelectChange(e, oldVehicle)}
                  required
                >
                  {vehicles.map((name, index) => (
                    <MenuItem key={index} value={name.placas}>{name.placas}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
          </Box>
          <Box mt={2} mb={2} sx={{ overflowY: 'auto', maxHeight: 500 }}>

            <FormControl fullWidth mt={2} mb={2}>

              <TextField
                label="Modelo del Vehículo"
                name="nombre"
                required
                fullWidth
                value={nombre}
                onChange={(e) => handleInputChange(e, setNombre, mode)}
                margin="dense"
              />
              <TextField
                label="Placas del Vehículo"
                name="placas"
                required
                fullWidth
                value={placas}
                onChange={(e) => handleInputChange(e, setPlacas, mode)}
                margin="dense"
              />
              <TextField
                label="Permiso del Vehículo"
                name="permiso"
                required
                fullWidth
                value={permiso}
                onChange={(e) => handleInputChange(e, setPermiso, mode)}
                margin="dense"
              />
              <TextField
                label="Capacidad del Vehículo"
                name="capacidad"
                required
                fullWidth
                value={capacidad}
                onChange={(e) => handleInputChange(e, setCapacidad, mode)}
                margin="dense"
              />


            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="driver-select-label">Conductor</InputLabel>
                <Select
                  labelId="driver-select-label"
                  id="driver-select"
                  onChange={(e) => handleDriverSelectChange(e, id)}
                  required
                  value={id}
                >
                  {drivers.map((name, index) => (
                    <MenuItem key={index} value={name.id}>{name.license} {name.first_name} {name.last_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
          </Box>

          <Button type="submit" variant="contained" fullWidth>{mode}</Button>
        </form>
      </Box>


    </Modal>,

    document.getElementById('modal')

  );
}

export { ModalVehicle };
