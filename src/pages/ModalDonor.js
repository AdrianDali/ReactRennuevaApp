import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/user/CreateUser.css";
import { TodoContext } from "../context/index.js";
import axios from "axios";
import PhoneExtensionSelect from '../components/PhoneExtensionSelect.jsx';
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

function ModalDonor({ children, mode }) {
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
  const [birthday, setBirthday] = useState("");
  const [gender , setGender] = useState("Otro")
  const [id, setId] = useState("");
  const [genders, setGenders] = useState([{ 
    "gender": "Masculino",
  }, 
    { "gender": "Femenino",
    },
    { "gender": "Otro",}
        ]);
  const [address_reference, setReference] = useState("");
  const [phoneExtension, setPhoneExtension] = useState("");
  



  const {
    setUpdateDonorInfo,
    openModalText,
    setTextOpenModalText,
    setOpenModalText,
    openModalCreateDonor,
    setOpenModalCreateDonor,
    openModalEditDonor,
    openModalDeleteDonor,
    setOpenModalEditDonor,
    setOpenModalDeleteDonor,
  } = useContext(TodoContext);
  const closeModal = () => {
    if (openModalCreateDonor) {
      setOpenModalCreateDonor(false);
    }
    if (openModalEditDonor) {
      setOpenModalEditDonor(false);
    }
    if (openModalDeleteDonor) {
      setOpenModalDeleteDonor(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    var rfcValue = e.target.rfc.value;
    if (!rfcValue) {
      rfcValue = "XAXX010101000"; // Aquí puedes poner el RFC por defecto que desees
    }
    if (mode === "CREAR") {
      const nuevoDato = {
        //user: e.target.email.value,
        password: e.target.password.value,
        email: e.target.email.value,
        first_name: e.target.nombre.value,
        last_name: e.target.apellido.value,
        //group: "Donador",
        rfc: rfcValue,
        company: company,
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
        gender:  gender ,
        birthdate: birthday,
        phone_extention: phoneExtension
        
      };

      axios
        .post(`${process.env.REACT_APP_API_URL}/create-donor/`, nuevoDato)
        .then((response) => {
          const data = response.data;
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Donador creado correctamente");
          setUpdateDonorInfo(true);
          e.target.reset();

          closeModal();
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (mode === "EDITAR") {
      var rfcValue = e.target.rfc.value;
      if (!rfcValue) {
        rfcValue = "XAXX010101000"; // Aquí puedes poner el RFC por defecto que desees
      }
      const editarDato = {
        user: e.target.email.value,
        //password: e.target.password.value,
        email: e.target.email.value,
        first_name: e.target.nombre.value,
        last_name: e.target.apellido.value,
        group: "Donador",
        rfc: rfcValue,
        company: company,
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
        gender: gender,
        birthdate: birthday,
        phone_extention: phoneExtension,
        id: id,
        
      };
      console.log("##SDAFSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDSDFSDFSDF");
      console.log(editarDato);

      axios
        .post(`${process.env.REACT_APP_API_URL}/update-donor/`, editarDato)
        .then((response) => {
          const data = response.data;
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Donador editado correctamente");
          setUpdateDonorInfo(true);
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
        user: user,
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/delete-django-user/`, deleteDato)
        .then((response) => {
          const data = response.data;
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Donador borrado correctamente");
          setUpdateDonorInfo(true);
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
      `${process.env.REACT_APP_API_URL}/get-all-donors/`
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
          "######################Companuies##################################"
        );
        companiesData.map((name, index) => console.log(name.company_name));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value; // Obtener la opción seleccionada
    console.log(selectedOption);
    // Buscar el dato seleccionado en el arreglo de datos
    const datoEncontrado = users.find((users) => users.user === selectedOption);
    console.log(datoEncontrado);
    setUser(datoEncontrado.user);
    setPassword(datoEncontrado.password);
    setEmail(datoEncontrado.email);
    setFirstName(datoEncontrado.first_name);
    setLastName(datoEncontrado.last_name);
    setGroup(datoEncontrado.group);
    setRfc(datoEncontrado.rfc);
    setCompany(datoEncontrado.company);
    setPhone(datoEncontrado.phone);
    setPhoneExtension(datoEncontrado.phone_extention);
    setState(datoEncontrado.address_state);
    setCity(datoEncontrado.address_city);
    setLocality(datoEncontrado.address_locality);
    setStreet(datoEncontrado.address_street);
    setPostalCode(datoEncontrado.address_postal_code);
    setAddressNumInt(datoEncontrado.address_num_int);
    setOldUser(selectedOption);
    setRazonSocial(datoEncontrado.razon_social);
    setId(datoEncontrado.id_django);
    setBirthday(datoEncontrado.birthdate);
    setGender(datoEncontrado.gender );
    setReference(datoEncontrado.address_reference);
    setAddressNumExt(datoEncontrado.address_num_ext);
  };

  const handleInputChange = (e, setState, mode) => {
    const currentInputValue = e.target.value;

    if (mode !== "BORRAR") {
      setState(currentInputValue);
    }
  };
  const handlePhoneChange = (event) => {
    const value = event.target.value;

    // Permitir solo números y limitar la longitud a 10 caracteres
    if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
      setPhone(value);
    }
  };
  const handleRfcChange = (event) => {
    const value = event.target.value.toUpperCase();

    // Permitir solo letras y números y limitar la longitud a 12-13 caracteres
    if (/^[0-9A-Z]*$/.test(value) && value.length <= 13) {
      setRfc(value);
    }
  };
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
            <Title> Usuario</Title>
            {mode === "EDITAR" || mode === "BORRAR" ? (
              <FormControl fullWidth>
                <InputLabel id="user-select-label">Usuario</InputLabel>
                <Select
                  labelId="user-select-label"
                  id="user-select"
                  onChange={(e) => {
                    handleSelectChange(e, setUser);
                  }}
                  required
                  //value={user}
                  w
                >
                  {users.map((name, index) => (
                    <MenuItem key={index} value={name.user}>
                      {name.user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
          </Box>
          <Box mt={2} mb={2} sx={{ overflowY: "auto", maxHeight: 500 }}>
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
                maxLength: 13, // Opcional: si quieres forzar la longitud máxima en el HTML
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
              label="Fecha de Nacimiento"
              name="date"
              type="date"
              required
              fullWidth
              value={birthday}
              onChange={(e) => handleInputChange(e, setBirthday, mode)}
              margin="dense"
              InputLabelProps={{
                shrink: true, // Esto asegura que la etiqueta se maneje correctamente con el campo de tipo 'date'
              }}
            />
            <FormControl fullWidth mt={2} mb={2}>
            <Select
              labelId="gender-select-label"
              id="gender-select"
              required
              value={gender}
              onChange={(e) => handleInputChange(e, setGender, mode)}
            >
              {genders.map((name, index) => (
                <MenuItem key={index} value={name.gender}>
                  {name.gender}
                </MenuItem>
              ))}
            </Select>

            </FormControl>
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
            {isPasswordVisible && (
              <TextField
                label="Password"
                name="password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => handleInputChange(e, setPassword, mode)}
                margin="dense"
              />
            )}

            <FormControl fullWidth mt={2} mb={2}>
              <PhoneExtensionSelect value={phoneExtension} setValue={setPhoneExtension} />
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
            </FormControl>
            <FormControl fullWidth mt={2} mb={2}>
              <Title>Compañia</Title>
              <Select
                labelId="company-select-label"
                id="company-select"
                required
                value={company}
                onChange={(e) => handleInputChange(e, setCompany, mode)}
              >
                {companies.map((name, index) => (
                  <MenuItem key={index} value={name.company_name}>
                    {name.company_name}
                  </MenuItem>
                ))}
              </Select>
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
                label="Numero exterior"
                name="address_num_ext"
                required
                fullWidth
                value={address_num_ext}
                onChange={(e) => handleInputChange(e, setAddressNumExt, mode)}
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
                label="Referencia"
                name="address_reference"
                required
                fullWidth
                value={address_reference}
                onChange={(e) => handleInputChange(e, setReference, mode)}
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

          <Button type="submit" variant="contained" fullWidth>
            {mode}
          </Button>
        </form>
      </Box>
    </Modal>,

    document.getElementById("modal")
  );
}

export { ModalDonor };
