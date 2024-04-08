import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ResponsiveAppBar from "./LayoutAppBar";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";

import { ThemeContext, ThemeProvider } from "@emotion/react";
import ResponsiveAppBarGenerator from "./ResponsiveAppBarGenerator";
const drawerWidth = 240;
const drawerWidthView = 27;
const headerWidth = 20;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",

  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    //esta parte controla el anchor del drawer cuando esta cerrado
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: "#f1f1f1", // Set your desired green color here
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: "#f1f1f1", // Set your desired green color here
    },
  }),
}));

const LayoutGenerator = ({ children }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpenClose = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClickUsersGroups = (index) => {
    console.log("index");
    console.log(index);
    if (index == 0) {
      navigate("/users");
    } else if (index == 1) {
      navigate("/groups");
    }
  };

  const user = {
    name: "Usuario Ejemplo",
    email: "usuario@example.com",
    avatar: "/avatar.jpg",
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: "100%", backgroundColor: "#f1f1f1" }}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          

          <Drawer variant="permanent" open={open} sx={{ bgcolor: "#f1f1f1" }}>
            <Box
              sx={{
                bgcolor: "#ffffff",
                borderRight: "1px solid #f1f1f1",
                height: "100vh",
                borderRadius: "25px",
                marginTop: 1,
                marginBottom: 1,
                marginLeft: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: 0.9,
                  paddingBottom: 0.9,
                }}
              >
                <DrawerHeader>
                  <IconButton onClick={handleDrawerOpenClose}>
                    {open === false ? (
                      <ChevronRightIcon />
                    ) : (
                      <ChevronLeftIcon />
                    )}
                  </IconButton>
                </DrawerHeader>
              </Box>
              <Divider />
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: 150,
                }}
              >
                <Avatar
                  src={user.avatar}
                  sx={{ width: open ? 64 : 32, height: open ? 64 : 32, mb: 1 }}
                />
                <Typography variant="h6" sx={{ opacity: open ? 1 : 0 }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: open ? 1 : 0 }}>
                  {user.email}{" "}
                </Typography>
              </Box>

              <Divider />
              <List>
                {["Responsivas"].map((text, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      onClick={() => {
                        navigate("/dash");
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {index === 0 ? <LeaderboardRoundedIcon /> : null}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              <Divider />
              <List>
                {["Usuarios", "Grupos"].map((text, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      onClick={() => handleClickUsersGroups(index)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {index % 2 === 0 ? (
                          <AccountBoxRoundedIcon />
                        ) : (
                          <GroupsRoundedIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />

              <Divider />
            </Box>
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f1f1f1",
            p: 3,
            //width: `calc(100% - ${drawerWidthView}px)`, // Remueve esta línea
            height: "100vh",
            marginLeft: open ? drawerWidthView : 5, // Añade esta línea
            transition: theme.transitions.create(["margin", "width"], {
              // Añade esta línea
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }), // Añade esta línea
          }}
        >
          <DrawerHeader />
          
          
            <ResponsiveAppBarGenerator />
          
          {children}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default LayoutGenerator;
