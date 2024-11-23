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
  Grid,
  IconButton,
  Autocomplete
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Title from "../components/Title";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

function ModalReport({ mode, report, creatorUser }) {
  const [carriers, setCarriers] = useState([]);
  const [recyclingCollectionCenters, setRecyclingCollectionCenters] = useState(
    []
  );
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [street, setStreet] = useState("");
  const [postal_code, setPostalCode] = useState("");
  const [rfc, setRfc] = useState("");
  const [recyclingCollection, setRecyclingCollection] = useState("");
  const [nameGenerator, setNameGenerator] = useState([]);
  const [isSameLocation, setIsSameLocation] = useState(false);
  const [haveTransport, setHaveTransport] = useState(true);
  const [carrier, setCarrier] = useState("");
  const [transportAvailable, setTransportAvailable] = useState(true);
  const [state_2, setState_2] = useState("");
  const [city_2, setCity_2] = useState("");
  const [locality_2, setLocality_2] = useState("");
  const [street_2, setStreet_2] = useState("");
  const [postal_code_2, setPostalCode_2] = useState("");


  const [completeName, setCompleteName] = useState("");
  const [addrees_different, setAddressDifferent] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState(true);

  const [creator, setCreator] = useState(creatorUser);


  const {
    setOpenModalText,
    setTextOpenModalText,
    setUpdateReportInfo,
    openModalCreateReport,
    setOpenModalCreateReport,
    openModalEditReport,
    setOpenModalEditReport,
    openModalDeleteReport,
    setOpenModalDeleteReport,
  } = useContext(TodoContext);

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

  useEffect(() => {
    if (mode === "CREAR") {
      console.log("CREAR");
      setIsSameLocation(true);




      //setAddressDifferent(true);
    }
    if (mode === "EDITAR") {
      console.log("EditaEDIr");
      console.log(report);
      console.log(report.id_report);
      console.log(report.compania_usuario);
      setUser(report.email_usuario);
      setEmail(report.email_usuario);
      setFirstName(report.nombre_real_usuario);
      setLastName(report.apellido_usuario);
      setRfc(report.rfc_usuario);
      setCompany(report.compania_usuario);
      setCarrier(report.transportista);
      if (report.estado_reporte == report.estado_usuario) {
        console.log("son iguales");
        setAddressDifferent(true);
        setIsSameLocation(true);
      } else {
        console.log("son diferentes");
        setAddressDifferent(false);
        setIsSameLocation(false);
      }
      console.log(report.transportista);
      if (report.transportista != null) {
        console.log("Tiene transportista");
        setHaveTransport(true);
      } else {
        console.log("No tiene transportista");
        setHaveTransport(false);
      }

      setStreet(report.calle_reporte);
      setLocality(report.colonia_reporte);
      setCity(report.ciudad_reporte);
      setState(report.estado_reporte);
      setPostalCode(report.cp_reporte);
      setCompany(report.compania_usuario);
      setState_2(report.estado_usuario);
      console.log(report.estado_usuario);
      console.log(report.ciudad_reporte);
      console.log(report.colonia_reporte);
      console.log(report.calle_reporte);
      console.log(report.cp_reporte);

      setCity_2(report.ciudad_usuario);
      setLocality_2(report.colonia_usuario);
      setStreet_2(report.calle_usuario);
      setPostalCode_2(report.cp_usuario);


      setCompleteName(
        report.nombre_real_usuario + " " + report.apellido_usuario
      );
      if (report.centro_reciclaje != null) {

        setRecyclingCollection(report.centro_reciclaje);
      }
      if (report.centro_recoleccion != null) {
        setRecyclingCollection(report.centro_recoleccion);
      }
    }

  }, []);

  useEffect(() => {
    if (mode === "CREAR") {
      console.log("Primer run");
      setState("");
      setCity("");
      setLocality("");
      setStreet("");
      setPostalCode("");
    }

    if (isSameLocation === false) {

      if (mode === "EDITAR") {

        if (isFirstRun) {
          console.log("Primer run");
          setIsFirstRun(false);


        } else {

          console.log("Segundo run");
          setState("");
          setCity("");
          setLocality("");
          setStreet("");
          setPostalCode("");
        }
      }

    } else {
      setState(state_2);
      setCity(city_2);
      setLocality(locality_2);
      setStreet(street_2);
      setPostalCode(postal_code_2);
    }
  }, [isSameLocation]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-users-responsiva/`)
      .then((response) => {
        const data = response.data;// Asumiendo que 'data' es un array.

        var nameGenerator = data.map(function (item) {
          var name = item.first_name + " " + item.last_name;
          return {
            rfc: item.rfc,
            user: item.user,
            name: name,
            email: item.email,
            first_name: item.first_name,
            last_name: item.last_name,
            company: item.company,
            address_street: item.address_street,
            address_locality: item.address_locality,
            address_city: item.address_city,
            address_state: item.address_state,
            address_postal_code: item.address_postal_code,
            phone: item.phone,
            group: item.groups[0],
          };
        });
        setNameGenerator(nameGenerator);
        console.log(nameGenerator);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-carrier/`)
      .then((response) => {
        const data = response.data;
        console.log(
          "#############################CARRIERS#######################"
        );
        console.log(data);
        setCarriers(data); // Asumiendo que 'data' es un array.
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/get-all-recycling-collection-center/`
      )
      .then((response) => {
        const data = response.data;
        console.log(
          "#############################CARRIERS#######################"
        );
        console.log(data);
        setRecyclingCollectionCenters(data); // Asumiendo que 'data' es un array.
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const closeModal = () => {
    if (openModalCreateReport) {
      setOpenModalCreateReport(false);
    }
    if (openModalEditReport) {
      setOpenModalEditReport(false);
    }
    if (openModalDeleteReport) {
      setOpenModalDeleteReport(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "EDITAR") {
      console.log("###############EDITAR USUARIOS##################");
      console.log({
        username: user,
        street: street,
        locality: locality,
        city: city,
        state: state,
        postalCode: postal_code,
        recyclingCollection: recyclingCollection,
        carrier: carrier,
        reportId: report.id_report,
      });
      axios
        .post(`${process.env.REACT_APP_API_URL}/edit-report/`, {
          username: user,
          street: street,
          locality: locality,
          city: city,
          state: state,
          postalCode: postal_code,
          recyclingCollection: recyclingCollection,
          carrier: carrier,
          reportId: report.id_report,
        })
        .then((response) => {
          console.log(response);
          setUpdateReportInfo(prev => !prev);
          setOpenModalText(true);
          setTextOpenModalText("Reporte actualizado correctamente");
          closeModal();
          e.target.reset();
        })
        .catch((error) => {
          console.error(error);
        });

    }
    if (mode === "CREAR") {
      console.log("###############CREAR USUARIOS##################");
      console.log({
        username: user,
        street: street,
        locality: locality,
        city: city,
        state: state,
        postalCode: postal_code,
        recyclingCollection: recyclingCollection,
        carrier: carrier,
        creator_user: creator,
      });

      axios
        .post(`${process.env.REACT_APP_API_URL}/create-initial-report/`, {
          username: user,
          street: street,
          locality: locality,
          creator_user: creator,
          city: city,
          state: state,
          postalCode: postal_code,
          recyclingCollection: recyclingCollection,
          carrier: carrier,
          report_for: "Generador"

        })
        .then((response) => {
          console.log(response);
          setUpdateReportInfo(prev => !prev);
          setOpenModalText(true);
          setTextOpenModalText("Reporte creado correctamente");
          closeModal();
          e.target.reset();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };


  const handleCarrierChange = (event) => {
    setCarrier(event.target.value);
  };

  const handleCenterChange = (event) => {
    console.log(event.target.value);
    setRecyclingCollection(event.target.value);
  };

  const handleSelectChange = (value) => {
    console.log("############ handleSelectChange ############");
    console.log(value);
    const selectedOption = value; // Obtener la opción seleccionada
    console.log(selectedOption);
    console.log("NAme Generador");
    console.log(nameGenerator);
    // Buscar el dato seleccionado en el arreglo de datos
    const datoEncontrado = nameGenerator.find(
      (users) => users.name === selectedOption
    );
    console.log("Dato encontrado");
    console.log(datoEncontrado);
    setUser(datoEncontrado.user);

    setEmail(datoEncontrado.email);
    console.log(datoEncontrado.first_name);
    setFirstName(datoEncontrado.first_name);
    setLastName(datoEncontrado.last_name);
    setRfc(datoEncontrado.rfc);
    setCompany(datoEncontrado.company);
    setState(datoEncontrado.address_state);
    setCity(datoEncontrado.address_city);
    setLocality(datoEncontrado.address_locality);
    setStreet(datoEncontrado.address_street);
    setPostalCode(datoEncontrado.address_postal_code);
    if (mode === "CREAR") {
      setStreet_2(datoEncontrado.address_street);
      setLocality_2(datoEncontrado.address_locality);
      setCity_2(datoEncontrado.address_city);
      setState_2(datoEncontrado.address_state);
      setPostalCode_2(datoEncontrado.address_postal_code);
    }

    setCompleteName(selectedOption);

    if (datoEncontrado.group === "Generador") {
      setTransportAvailable(true);
    }
    if (
      (datoEncontrado.group === "Transportista" ||
        datoEncontrado.group === "Receptor",
        datoEncontrado.group === "Donador")
    ) {
      setTransportAvailable(false);
    }
  };

  const handleSwitchChange = (event) => {
    setIsSameLocation(event.target.checked);
  };
  const handleSwitchChangeCarrier = (event) => {
    setHaveTransport(event.target.checked);
    setCarrier("");
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
          maxHeight: "80lvh",
          overflowY: "auto",
          maxWidth: "80vw",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={closeModal}
          sx={{ position: "absolute", right: 2, top: 2 }}
        >
          <Close />
        </IconButton>
        <form onSubmit={handleSubmit}>
          <Title>Crear Responsiva</Title>
          <Autocomplete
            disablePortal
            id="autocomplete-generator"
            options={nameGenerator}
            noOptionsText="No se encontraron coincidencias"
            sx={{ width: "100%" }} // Usa el ancho completo del Grid item
            getOptionLabel={(option) => option.email}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField {...params} label="Generador" required error={completeName===""} />
            )}
            onChange={(event, value) => handleSelectChange(value)}
          />
          <FormControl fullWidth>
            <InputLabel id="rol-select-label">Generador</InputLabel>
            <Select
              label="Generador"
              labelId="rol-select-label"
              id="rol-select"
              required
              value={completeName}
              onChange={(e) => handleSelectChange(e, setCompleteName)}
            >
              {nameGenerator.map((name, index) => (
                <MenuItem key={index} value={name.name}>
                  {name.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="nombre"
                required
                fullWidth
                value={first_name}
                // onChange={(e) => handleInputChange(e, setFirstName, mode)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                name="apellido"
                required
                fullWidth
                value={last_name}
                // onChange={(e) => handleInputChange(e, setLastName, mode)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="RFC"
                name="rfc"
                required
                fullWidth
                value={rfc}
                // onChange={(e) => handleInputChange(e, setRfc, mode)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Nombre de Usuario"
                name="user"
                required
                fullWidth
                value={user}
                // onChange={(e) => handleInputChange(e, setUser, mode)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                fullWidth
                value={email}
                // onChange={(e) => handleInputChange(e, setEmail, mode)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Compañía"
                name="company"
                required
                fullWidth
                value={company}
                margin="dense"
              />
            </Grid>
            {transportAvailable && (
              <Grid item xs={12} sm={12}>
                <Grid item xs={12} sm={12}>
                  <Title>Cuenta con transportista ?</Title>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>No</Typography>
                    <AntSwitch
                      onChange={handleSwitchChangeCarrier}
                      checked={haveTransport}
                      inputProps={{ "aria-label": "ant design" }}

                    />
                    <Typography>Si</Typography>
                  </Stack>
                </Grid>
                {haveTransport && (
                  <Grid item xs={12} sm={12}>
                    <Title>Seleccionar Transportista</Title>
                    <FormControl fullWidth mt={2} mb={2}>
                      <InputLabel id="rol-select-label">
                        Transportista
                      </InputLabel>
                      <Select
                        labelId="rol-select-label"
                        id="rol-select"
                        required
                        onChange={(e) => handleCarrierChange(e, setUser)}
                        value={
                          mode === "EDITAR" ? carrier : carrier
                        }
                      >
                        {carriers.map((name, index) => (
                          <MenuItem key={index} value={name.company_name}>
                            {name.company_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            )}

            {/* <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Celular"
                                    name="phone"
                                    required
                                    fullWidth
                                    value={phone}


                                    margin="dense"
                                />
                            </Grid> */}
            <Grid item xs={12} sm={12}>
              <Title>Ubicación</Title>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid item xs={12} sm={12}>
                <Title>Misma ubicacion de RFC: </Title>
              </Grid>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>No</Typography>
                <AntSwitch
                  onChange={handleSwitchChange}
                  checked={isSameLocation}
                  inputProps={{ "aria-label": "ant design" }}
                  value={addrees_different}
                />
                <Typography>Si</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estado"
                name="state"
                required
                fullWidth
                value={state}
                onChange={(e) => setState(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ciudad"
                name="city"
                required
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Colonia"
                name="locality"
                required
                fullWidth
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Calle y Numero"
                name="calle"
                required
                fullWidth
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código postal"
                name="postal_code"
                required
                fullWidth
                value={postal_code}
                onChange={(e) => setPostalCode(e.target.value)}
                margin="dense"
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Box mb={2}>
                <Title>Seleccionar Centro de Reciclaje o Recolección</Title>
                <FormControl fullWidth mt={2} mb={2}>
                  <InputLabel id="rol-select-label">Centro</InputLabel>
                  <Select
                    labelId="rol-select-label"
                    id="rol-select"
                    required
                    onChange={(e) => handleCenterChange(e, setUser)}
                    value={recyclingCollection}
                  >
                    {recyclingCollectionCenters.map((name, index) => (
                      <MenuItem
                        key={index}
                        value={name.RecyclingCenterName}
                      >
                        {name.RecyclingCenterName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button type="submit" variant="contained" sx={{ width: "500px" }}>
              {mode}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal>,

    document.getElementById("modal")
  );
}

export { ModalReport };
