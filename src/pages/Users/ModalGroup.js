import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/user/CreateUser.css';
import { TodoContext } from '../../context/index.js';
import axios from 'axios';
import { Modal, TextField, Button, Select, MenuItem, Box, FormControl, InputLabel } from '@mui/material';
import Title from '../../components/Title';

function ModalGroup({ children, mode, creatorUser }) {
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState("");
  const [old_group, setOldGroup] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [groupKey, setGroupKey] = useState("")
  const [creator, setCreator] = useState(creatorUser);

  const { setUpdateGroupInfo,openModalCreateGroup, setOpenModalText, setTextOpenModalText, setOpenModalCreateGroup, openModalEditGroup, setOpenModalEditGroup, openModalDeleteGroup, setOpenModalDeleteGroup } = useContext(TodoContext);

  const closeModal = () => {
    if (openModalCreateGroup) {
      setOpenModalCreateGroup(false);
    }
    if (openModalEditGroup) {
      setOpenModalEditGroup(false);
    }
    if (openModalDeleteGroup) {
      setOpenModalDeleteGroup(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoDato = {
      name: group,
      group_key: groupKey,
      creator_user: creator
    };

    const antiguo_user = document.getElementById("mySelect")
    var user_ant = antiguo_user ? antiguo_user.value : null;

    const editarDato = {
      name: group,
      antiguoName: old_group,
      group_key: groupKey, 
      creator_user: creator
    };
    const borrarDato = {
      name: old_group ? old_group : user_ant,
      creator_user: creator
    };

    if (mode === "CREAR") {
      axios
        .post(`${process.env.REACT_APP_API_URL}/create-django-group/`, nuevoDato)
        .then(response => {
          const data = response.data;
          console.log(data)
          // setOpenModalText(true);
          setOpenModalText(true);
          setTextOpenModalText("Grupo creado correctamente")
          e.target.reset();
          setUpdateGroupInfo(true)
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
      axios
        .put(`${process.env.REACT_APP_API_URL}/update-django-group/`, editarDato)
        .then(response => {
          const data = response.data;
          console.log(data)
          e.target.reset();
          setOpenModalText(true);
          setTextOpenModalText("Grupo editado correctamente")
          setUpdateGroupInfo(true);
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
        .put(`${process.env.REACT_APP_API_URL}/delete-django-group/`, borrarDato)
        .then(response => {
          const data = response.data;
          console.log(data)
          e.target.reset();
          setOpenModalText(true);
          setTextOpenModalText("Donador borrado correctamente")
          setUpdateGroupInfo(true)
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
    if (mode === "BORRAR") {
      setIsVisible(false)
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-groups/`)
      .then(response => {
        const data = response.data;
        setGroups(data)
        console.log("######################GRUPOS##################################")
        console.log(data)

      })
      .catch(error => {
        console.error(error);
      });

  }, []);



  const handleSelectChange = (event) => {
    const selectedOption = event.target.value; // Obtener la opción seleccionada
    console.log(selectedOption)
    // Buscar el dato seleccionado en el arreglo de datos
    const datoEncontrado = groups.find((groups) => groups.name === selectedOption);
    console.log("#DFSDFSDFSDDAto encotntrado")
    setGroup(datoEncontrado.name)
    console.log("SADTERRRRRR")
    setGroupKey(datoEncontrado.group_key)
    console.log(datoEncontrado.name)
    console.log(datoEncontrado.group_key)
    setOldGroup(selectedOption)


    // Actualizar el estado con el dato encontrado


      


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
            <Title> Grupo</Title>
            {mode === "EDITAR" || mode === "BORRAR" ? (
              <FormControl fullWidth>
                <InputLabel id="user-select-label">Grupo</InputLabel>
                <Select
                  labelId="user-select-label"
                  id="user-select"
                  onChange={(e) => handleSelectChange(e, group)}
                  required
                >
                  {groups.map((name, index) => (
                    <MenuItem key={index} value={name.name}>{name.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
          </Box>
          <Box mt={2} mb={2} sx={{ overflowY: 'auto', maxHeight: 500 }}>

            <FormControl fullWidth mt={2} mb={2}>
              {isVisible ? (
                <TextField
                  label="Nombre Grupo"
                  name="name"
                  required
                  fullWidth
                  value={group}
                  onChange={(e) => handleInputChange(e, setGroup, mode)}
                  margin="dense"

                />

                
              ) : null}
            </FormControl>
            <TextField
                  label="Clave de Grupo"
                  name="name"
                  required
                  fullWidth
                  value={groupKey}
                  onChange={(e) => handleInputChange(e, setGroupKey, mode)}
                  margin="dense"

                />

          </Box>

          <Button type="submit" variant="contained" fullWidth>{mode}</Button>
        </form>
      </Box>


    </Modal>,

    document.getElementById('modal')

  );
}

export { ModalGroup };
