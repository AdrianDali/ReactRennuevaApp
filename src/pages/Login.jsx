import React, { useState , useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import loginDonor from "../services/ApiLoginAWT";
import GetUser from "../services/ApiGetUser";
import { TodoContext } from "../context";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"© "}
      <Link color="inherit" href="https://mui.com/">
        Rennueva
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();
export default function SignInSide() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { userGroups, setUserGroups } = useContext(TodoContext);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("username", username);
    const req = {
      username: username,
      password: password,
    };

    try {
      const { data, success, message } = await loginDonor(req);

      if (success) {
        console.log("Login successful:", data);
      } else {
        console.log("Login failed:", message);
      }

      // Almacenar el token en el estado (y posiblemente en un almacenamiento persistente como localStorage)
      document.cookie = `refresh=${data.refresh}; SameSite=Lax; Secure`;
      document.cookie = `user=${username}; SameSite=Lax; Secure`;
      document.cookie = `access=${data.access}; SameSite=Lax; Secure`;

      setError(null);

      console.log("data", data);
      // obtner la informacion del usuario
      const { dataUser, successUser, messageUser } = await GetUser(username, data.access, data.refresh);

      if (!successUser) {
        console.log("Error al obtener los datos del usuario:", messageUser);
        setError("Login Failed");
        setShowModal(true); // Mostrar el modal de error
        setUsername(""); // Limpiar campo de usuario
        setPassword(""); // Limpiar campo de contraseña
      }

      setUserGroups(dataUser.groups[0]);

      if (dataUser.groups[0] === "Administrador") {
        console.log("Administrador");
        navigate("/dash");
      } else if (dataUser.groups[0] === "Generador") {
        console.log("Generador");
        navigate("/main-generator");

      } else if (dataUser.groups[0] === "Comunicacion") {
        console.log("Comunicacion");
        navigate("/donor-recollection-comunication");
      }else if (dataUser.groups[0] === "Logistica") {
        console.log("Logistica");
        navigate("/donor-recollection-logistic");
      } else if (dataUser.groups[0] === "Calidad") {
        console.log("Calidad");
        navigate("/donor-recollection-quality");
      }

    } catch (error) {
      // Manejar y mostrar error
      setError("Login Failed");
      setShowModal(true); // Mostrar el modal de error
      setUsername(""); // Limpiar campo de usuario
      setPassword(""); // Limpiar campo de contraseña
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar Sesion
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electronico"
                name="email"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Ingresar
              </Button>
              {showModal && (
                <div>
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="error">
                      {" "}
                      — Usuario o Contraseña Incorrecta —{" "}
                    </Alert>
                  </Stack>
                </div>
              )}

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Olvidaste tu Contrasena?
                  </Link>
                </Grid>
                {/* <Grid item>
                  <Link href="/register" variant="body2">
                    {"Aun no tienes cuenta? Registrate"}
                  </Link>
                </Grid> */}
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
