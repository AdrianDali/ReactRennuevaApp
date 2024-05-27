import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/user/CreateUser.css";
import { TodoContext } from "../context/index.js";
import axios from "axios";
import {
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import Title from "../components/Title";

function ModalRecyclingCenter({ children, mode }) {
  const [datos, setDatos] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([""]);
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
  const [centerName, setCenterName] = useState("");
  const [idCenter, setIdCenter] = useState("");
  const [key, setKey] = useState("");
  const [permisos, setPermisos] = useState([]);


  const {
    setUpdateRecyclingCenterInfo,
    openModalText,
    setTextOpenModalText,
    setOpenModalText,
    openModalCreateRecyclingCenter,
    setOpenModalCreateRecyclingCenter,
    openModalEditRecyclingCenter,
    openModalDeleteRecyclingCenter,
    setOpenModalEditRecyclingCenter,
    setOpenModalDeleteRecyclingCenter,
  } = useContext(TodoContext);

  const closeModal = () => {
    if (openModalCreateRecyclingCenter) {
      setOpenModalCreateRecyclingCenter(false);
    }
    if (openModalEditRecyclingCenter) {
      setOpenModalEditRecyclingCenter(false);
    }
    if (openModalDeleteRecyclingCenter) {
      setOpenModalDeleteRecyclingCenter(false);
    }
  };

  const handleRfcChange = (event) => {
    const value = event.target.value.toUpperCase();
    // Permitir solo letras y números y limitar la longitud a 12-13 caracteres
    if (/^[0-9A-Z]*$/.test(value) && value.length <= 13) {
      setRfc(value);
    }
  };
  const handlePhoneChange = (event) => {
    const value = event.target.value;

    // Permitir solo números y limitar la longitud a 10 caracteres
    if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
      setPhone(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "CREAR") {
      var rfcValue = e.target.rfc.value;
      console.log(
        "####dawd##################CREAR##################################"
      );
      console.log(key);
      if (!rfcValue) {
        rfcValue = "XAXX010101000"; // Aquí puedes poner el RFC por defecto que desees
      }
      console.log(permisos)
      const nuevoDato = {
        recycling_center_name: e.target.nombre.value,
        recycling_center_razon_social: e.target.razon_social.value,
        recycling_center_rfc: rfcValue,
        recycling_center_phone: e.target.phone.value,
        recycling_center_email: e.target.email.value,
        address_street: e.target.street.value,
        address_num_int: e.target.address_num_int.value,
        address_locality: e.target.locality.value,
        address_city: e.target.city.value,
        address_state: e.target.state.value,
        address_postal_code: e.target.postal_code.value,
        address_lat: 0,
        address_lng: 0,
        recycling_center_key: key,
        recycling_center_permiso: 
          permisos.map((permiso) => {
            return {
              nombre: permiso
            }

            })
        

      };
      console.log("#############################")
      console.log(nuevoDato)

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/create-recycling-center/`,
          nuevoDato
        )
        .then((response) => {
          const data = response.data;
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Centro de Reciclaje creado correctamente");
          setUpdateRecyclingCenterInfo(true);
          e.target.reset();
          closeModal();
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (mode === "EDITAR") {
      var rfcValue = e.target.rfc.value;
      console.log(
        "####dawd##################CREAR##################################"
      );
      console.log(key);
      if (!rfcValue) {
        rfcValue = "XAXX010101000"; // Aquí puedes poner el RFC por defecto que desees
      }

      const editarDato = {
        recycling_center_name: e.target.nombre.value,
        recycling_center_razon_social: e.target.razon_social.value,
        recycling_center_rfc: rfcValue,
        recycling_center_phone: e.target.phone.value,
        recycling_center_email: e.target.email.value,
        address_street: e.target.street.value,
        address_num_int: e.target.address_num_int.value,
        address_locality: e.target.locality.value,
        address_city: e.target.city.value,
        address_state: e.target.state.value,
        address_postal_code: e.target.postal_code.value,
        address_lat: 0,
        address_lng: 0,
        recycling_center_id: idCenter,
        recycling_center_key: key,
        recycling_center_permiso: 
          permisos.map((permiso) => {
            return {
              nombre: permiso
            }

            })
      };
      console.log("##SDAFSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDSDFSDFSDF");
      console.log(editarDato);

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/update-recycling-center/`,
          editarDato
        )
        .then((response) => {
          const data = response.data;
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Centro Reciclaje editado correctamente");
          setUpdateRecyclingCenterInfo(true);
          e.target.reset();
          closeModal();
          // Limpiar los campos del formulario
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (mode === "BORRAR") {
      const antiguo_user = document.getElementById("user-select");
      var user_ant = antiguo_user ? antiguo_user.value : null;

      const deleteDato = {
        recycling_center_id: idCenter,
      };

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/delete-recycling-center/`,
          deleteDato
        )
        .then((response) => {
          const data = response.data;
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Centro Reciclaje borrado correctamente");
          setUpdateRecyclingCenterInfo(true);
          e.target.reset();
          closeModal();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // Limpiar los campos del formulario
    e.target.reset();
  };

  useEffect(() => {
    // Basado en el modo, decidir si el campo de la contraseña debe ser visible
    if (mode === "CREAR") {
      setIsPasswordVisible(true);
    } else {
      setIsPasswordVisible(false); // Esto cubre 'editar' y 'borrar'
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-groups/`)
      .then((response) => {
        const data = response.data;
        setGroups(data);
        console.log(
          "######################GRUPOS##################################"
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const fetchUsers = axios.get(
      `${process.env.REACT_APP_API_URL}/get-all-recycling-center/`
    );
    const fetchCompanies = axios.get(
      `${process.env.REACT_APP_API_URL}/get-all-companies/`
    );

    Promise.all([fetchUsers, fetchCompanies])
      .then((res) => {
        const usersData = res[0].data;
        const companiesData = res[1].data;
        setUsers(usersData);
        setCompanies(companiesData);
        console.log(
          "######################USUARIOS##################################"
        );
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value; // Obtener la opción seleccionada
    console.log("opcion Seleccionada");
    console.log(selectedOption);
    // Buscar el dato seleccionado en el arreglo de datos
    const datoEncontrado = users.find(
      (users) => users.RecyclingCenterName === selectedOption
    );
    console.log("Dato Encontrado");
    console.log(datoEncontrado);
    setCenterName(datoEncontrado.RecyclingCenterName);
    setRfc(datoEncontrado.RecyclingCenterRfc);
    setRazonSocial(datoEncontrado.RecyclingCenterRazonSocial);
    setEmail(datoEncontrado.RecyclingCenterEmail);
    setPhone(datoEncontrado.RecyclingCenterPhone);
    setState(datoEncontrado.AddressState);
    setCity(datoEncontrado.AddressCity);
    setLocality(datoEncontrado.AddressLocality);
    setStreet(datoEncontrado.AddressStreet);
    setPostalCode(datoEncontrado.AddressPostalCode);
    setAddressNumInt(datoEncontrado.AddressNumInt);
    setAddressNumExt(datoEncontrado.AddressNumExt);
    setIdCenter(datoEncontrado.RecyclingCenterId);
    setKey(datoEncontrado.RecyclingCenterKey);
    setPermisos(datoEncontrado.RecyclingCenterPermiso);

    // Actualizar el estado con el dato encontrado
  };

  const handleInputChange = (e, setState, mode) => {
    const currentInputValue = e.target.value;

    if (mode !== "BORRAR") {
      setState(currentInputValue);
    }
  };

  const agregarPermiso = () => {
    setPermisos(prevPermisos => [...prevPermisos, { id: prevPermisos.length, nombre: "" }]);
};

const quitarPermiso = permiso => {
  console.log(permiso)
  console.log( permisos.filter(p => p !== permiso));
  setPermisos(permisos.filter(p => p !== permiso));
  console.log("PERMISOS");  
  console.log(permisos);

    
};

const handlePermisoChange = (index, event) => {
  const nuevoValor = event.target.value;
  // Crear una copia de la lista actual de permisos
  const nuevosPermisos = [...permisos];
  // Actualizar el valor en la posición específica
  nuevosPermisos[index] = nuevoValor;
  // Establecer la nueva lista de permisos en el estado
  console.log("PERMISOS");
  console.log(nuevosPermisos);
  setPermisos(nuevosPermisos);
}


  return ReactDOM.createPortal(
    <Modal open={true} onClose={closeModal}>
      <Box
        className="ModalContent"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Button
          onClick={closeModal}
          sx={{ position: "absolute", right: 2, top: 2 }}
        >
          &times;
        </Button>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Title> Centro de Reciclaje</Title>
            {mode === "EDITAR" || mode === "BORRAR" ? (
              <FormControl fullWidth>
                <InputLabel id="user-select-label">Centro Reciclaje</InputLabel>
                <Select
                  labelId="user-select-label"
                  id="user-select"
                  onChange={(e) => {
                    handleSelectChange(e, setCenterName);
                  }}
                  required
                  //value={user}
                  w
                >
                  {users.map((name, index) => (
                    <MenuItem key={index} value={name.RecyclingCenterName}>
                      {name.RecyclingCenterName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
          </Box>
          <Box mt={2} mb={2} sx={{ overflowY: "auto", maxHeight: 500 }}>
            <TextField
              label="Nombre Centro Reciclaje"
              name="nombre"
              required
              fullWidth
              value={centerName}
              onChange={(e) => handleInputChange(e, setCenterName, mode)}
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
                maxLength: 13, // Opcional: si quieres forzar la longitud máxima en el HTML
              }}
              // // Validación de error para la longitud del RFC
              // error={rfc.length > 0 && (rfc.length < 12 || rfc.length > 13)}
              // helperText={
              //     rfc.length > 0 && (rfc.length < 12 || rfc.length > 13)
              //         ? "El RFC debe tener entre 12 y 13 caracteres"
              //         : ""
              // }
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
              helperText={
                phone.length > 0 && phone.length < 10
                  ? "El número debe ser de 10 dígitos"
                  : ""
              }
            />
            <TextField
              label="Clave de Centro Reciclaje"
              name="key"
              required
              fullWidth
              value={key}
              onChange={(e) => handleInputChange(e, setKey, mode)}
              margin="dense"
            />

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



            <Box>
              {permisos.map((permiso, index) => (
                <Box key={permiso.id} display="flex" alignItems="center" mb={2}>
                  <TextField
                    label={`Permiso ${index + 1}`}
                    //variant="outlined"
                    value={permiso.nombre || permiso || ""}
                    onChange={(event) => handlePermisoChange(index, event)}
                    sx={{ mr: 2, flexGrow: 1 }}
                    margin="dense"
                    required
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => quitarPermiso(permiso)}
                  >
                    &ndash;
                  </Button>
                </Box>
              ))}
              <Button
                variant="contained"
                onClick={agregarPermiso}
                sx={{ mt: 2, width: "100%" }}
              >
                Agregar Permiso
              </Button>
            </Box>





          </Box>

          <Button type="submit" variant="contained" fullWidth>
            {mode}
          </Button>
        </form>
      </Box>
    </Modal>,

    document.getElementById("modal")
  );
}

export { ModalRecyclingCenter };
