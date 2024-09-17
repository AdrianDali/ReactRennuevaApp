import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../styles/user/CreateUser.css";
import { TodoContext } from "../../context/index.js";
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
import Title from "../../components/Title.js";

function ModalCompany({ children, mode, creatorUser }) {
  const [datos, setDatos] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([""]);
  const [user, setUser] = useState("");
  const [rfc, setRfc] = useState("");
  const [phone, setPhone] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [companyOldName, setCompanyOldName] = useState("");

  const [creator , setCreator] = useState(creatorUser)


    const [companyName, setCompanyName] = useState("");
    const [companyLogo, setCompanyLogo] = useState("");
    const [companyMainColor, setCompanyMainColor] = useState("");
    const [companySecondaryColor, setCompanySecondaryColor] = useState("");
    const [companyMainWeb, setCompanyMainWeb] = useState("");
    const [companySecondWeb, setCompanySecondWeb] = useState("");
    const [companyFontName, setCompanyFontName] = useState("");



  const {
    setUpdateDonorInfo,
    openModalText,
    setTextOpenModalText,
    setOpenModalText,
    openModalCreateCompany,
    setOpenModalCreateCompany,
    openModalEditCompany,
    setOpenModalEditCompany,
    openModalDeleteCompany,
    setOpenModalDeleteCompany,
    setUpdateCompanyInfo
  } = useContext(TodoContext);

  const closeModal = () => {
    if (openModalCreateCompany) {
      setOpenModalCreateCompany(false);
    }
    if (openModalEditCompany) {
      setOpenModalEditCompany(false);
    }
    if (openModalDeleteCompany) {
      setOpenModalDeleteCompany(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "CREAR") {
        const nuevoDato = {
            CompanyName: companyName,
            CompanyLogo: companyLogo,
            CompanyMainColor: companyMainColor,
            CompanySecondaryColor: companySecondaryColor,
            CompanyMainWeb: companyMainWeb,
            CompanySecondWeb: companySecondWeb,
            CompanyFontName: companyFontName,
            creator_user: creator
        };

      axios
        .post(`${process.env.REACT_APP_API_URL}/create-companie/`, nuevoDato)
        .then((response) => {
          const data = response.data;
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Compañía creada correctamente");
          setUpdateCompanyInfo(true);
          e.target.reset();

          closeModal();
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
      const editarDato = {
        CompanyName: companyOldName,
            CompanyLogo: companyLogo,
            CompanyMainColor: companyMainColor,
            CompanySecondaryColor: companySecondaryColor,
            CompanyMainWeb: companyMainWeb,
            CompanySecondWeb: companySecondWeb,
            CompanyFontName: companyFontName,
            CompanyNewName: companyName,
            creator_user: creator
      };
      //console.log("##SDAFSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDSDFSDFSDF");
      //console.log(editarDato);

      axios
        .put(`${process.env.REACT_APP_API_URL}/update-companie/`, editarDato)
        .then((response) => {
          const data = response.data;
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Compañía editado correctamente");
          setUpdateCompanyInfo(true);
          e.target.reset();
          closeModal();
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

      const deleteDato = {
        CompanyName: companyOldName,
        creator_user: creator
      };

      axios
        .put(`${process.env.REACT_APP_API_URL}/delete-companie/`, deleteDato)
        .then((response) => {
          const data = response.data;
          console.log("#######################    Borrado    #################")
          console.log(data);
          setOpenModalText(true);
          setTextOpenModalText("Compañía borrado correctamente");
          setUpdateCompanyInfo(true);
          e.target.reset();
          closeModal();
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
    
    const fetchCompanies = axios.get(
      `${process.env.REACT_APP_API_URL}/get-all-companies/`
    );

    Promise.all([fetchCompanies])
      .then((res) => {
        const companiesData = res[0].data;
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
    const datoEncontrado = companies.find((users) => users.company_name === selectedOption);
    console.log("#######################    Dato Encontrado    #################")
    console.log(datoEncontrado);
    setCompanyOldName(datoEncontrado.company_name);
    // Actualizar el estado con el dato encontrado
    setCompanyName(datoEncontrado.company_name);
    setCompanyLogo(datoEncontrado.logo);
    setCompanyMainColor(datoEncontrado.main_color);
    setCompanySecondaryColor(datoEncontrado.secondary_color);
    setCompanyMainWeb(datoEncontrado.main_web);
    setCompanySecondWeb(datoEncontrado.second_web);
    setCompanyFontName(datoEncontrado.font_name);

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
            <Title> Compañía</Title>
            {mode === "EDITAR" || mode === "BORRAR" ? (
              <FormControl fullWidth>
                <InputLabel id="user-select-label">Compañía</InputLabel>
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
                  {companies.map((name, index) => (
                    <MenuItem key={index} value={name.company_name}>
                      {name.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
          </Box>
          <Box mt={2} mb={2} sx={{ overflowY: "auto", maxHeight: 500 }}>
            <TextField
              label="Nombre de la Compañía"
              name="company"
              required
              fullWidth
              value={companyName} // Asegúrate de tener un estado para esto
              onChange={(e) => handleInputChange(e, setCompanyName, mode)}
              margin="dense"
            />
            <TextField
              label="Logo de la Compañía (URL)"
              name="logo"
              required
              fullWidth
              value={companyLogo} // Asegúrate de tener un estado para esto
              onChange={(e) => handleInputChange(e, setCompanyLogo, mode)}
              margin="dense"
            />
            <TextField
              label="Color Principal de la Compañía"
              name="main_color"
              required
              fullWidth
              value={companyMainColor} // Asegúrate de tener un estado para esto
              onChange={(e) => handleInputChange(e, setCompanyMainColor, mode)}
              margin="dense"
            />
            <TextField
              label="Color Secundario de la Compañía"
              name="secondary_color"
              required
              fullWidth
              value={companySecondaryColor} // Asegúrate de tener un estado para esto
              onChange={(e) =>
                handleInputChange(e, setCompanySecondaryColor, mode)
              }
              margin="dense"
            />
            <TextField
              label="Sitio Web Principal"
              name="main_web"
              required
              fullWidth
              value={companyMainWeb} // Asegúrate de tener un estado para esto
              onChange={(e) => handleInputChange(e, setCompanyMainWeb, mode)}
              margin="dense"
            />
            <TextField
              label="Sitio Web Secundario"
              name="second_web"
              required
              fullWidth
              value={companySecondWeb} // Asegúrate de tener un estado para esto
              onChange={(e) => handleInputChange(e, setCompanySecondWeb, mode)}
              margin="dense"
            />
            <TextField
              label="Nombre de la Fuente de la Compañía"
              name="font_name"
              required
              fullWidth
              value={companyFontName} // Asegúrate de tener un estado para esto
              onChange={(e) => handleInputChange(e, setCompanyFontName, mode)}
              margin="dense"
            />
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

export { ModalCompany };
