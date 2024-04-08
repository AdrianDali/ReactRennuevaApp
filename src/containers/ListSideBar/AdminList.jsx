import React, { useContext } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Divider from "@mui/material/Divider";
import { TodoContext } from "../../context";
import { useNavigate } from 'react-router-dom';
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import {
  DirectionsRunRounded,
  HomeWork,
  HomeWorkRounded,
  LeaderboardRounded,
  RecyclingRounded,
} from "@mui/icons-material";


import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import PersonIcon from '@mui/icons-material/Person';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HistoryIcon from '@mui/icons-material/History';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';


const AdminList = () => {
  const navigate = useNavigate();
  const { openSideBar, setOpenSideBar } = React.useContext(TodoContext);
  const [expanded, setExpanded] = React.useState(false); // Estado para controlar la expansión de los Accordion
  const [expanded2, setExpanded2] = React.useState(false); // Estado para controlar la expansión de los Accordion
  const [expanded3, setExpanded3] = React.useState(false); // Estado para controlar la expansión de los Accordion
  const [expanded4, setExpanded4] = React.useState(false); // Estado para controlar la expansión de los Accordion
  const [expanded5, setExpanded5] = React.useState(false); // Estado para controlar la expansión de los Accordion
  React.useEffect(() => {
    if (openSideBar === false) {
      setExpanded(false);
      setExpanded2(false);
      setExpanded3(false);
      setExpanded4(false);
      setExpanded5(false);

    }
  }, [openSideBar]);

// Definir arrays con iconos específicos
const items_residue = [{ label: "Residuo", icon: <DeleteIcon /> }];

const items_recollection = [
  { label: "Orden recoleccion", icon: <AssignmentReturnedIcon /> },
];

const items_users = [
  { label: "Usuario", icon: <PersonIcon /> },
  { label: "Generador", icon: <SettingsInputComponentIcon /> },
  { label: "Donador", icon: <FavoriteIcon /> },
  { label: "Conductor", icon: <LocalTaxiIcon /> },
  { label: "Transportista", icon: <LocalShippingIcon /> },
  { label: "Grupo", icon: <GroupIcon /> },
];

const items_report = [
  { label: "Reporte", icon: <BarChartIcon /> },
  { label: "Seguimiento", icon: <TrackChangesIcon /> },
  { label: "Historial", icon: <HistoryIcon /> },
];

const items_entities = [
  { label: "Centro Reciclaje", icon: <DeleteIcon /> }, // Asumiendo que quieres usar el mismo icono de "Residuo"
  { label: "Centro Recoleccion", icon: <AssignmentReturnedIcon /> },
  { label: "Compañia", icon: <BusinessIcon /> },
  { label: "Vehiculo", icon: <DirectionsCarIcon /> },
];
  // Método para manejar la navegación podría ser añadido aquí
  const doNavigate = (label) => {
    // Map of label to route
    const routeMap = {
      Residuo: "/residue",
      "Orden recoleccion": "/donor-recolection",
      Usuario: "/users",
      Generador: "/generator",
      Donador: "/donor",
      Conductor: "/driver",
      Transportista: "/carrier",
      Grupo: "/groups",
      Reporte: "/report",
      Seguimiento: "/tracking",
      Historial: "/report-history",
      "Centro Reciclaje": "/recycling-center",
      "Centro Recoleccion": "/collection-center",
      Compañia: "/company",
      Vehiculo: "/vehicle",
      Dashboard: "/dash",
    };

    const path = routeMap[label];
    if (path) {
      console.log(`Navigating to ${path}`);
      navigate(path);
      // Aquí iría la lógica real de navegación, por ejemplo: history.push(path);
    } else {
      console.error(`No route defined for label: ${label}`);
    }
  };

    // Método para manejar el cambio de expansión de los Accordion
    const handleAccordionChange = (mode) => {
      if (mode === 1) setExpanded(!expanded);
      if (mode === 2) setExpanded2(!expanded2);
      if (mode === 3) setExpanded3(!expanded3);
      if (mode === 4) setExpanded4(!expanded4);
      if (mode === 5) setExpanded5(!expanded5);
      
    };

  return (
    <div className="sidebar" style={{ maxHeight: "60%", minHeight : "60%",overflowY: "auto" , overflowX : "hidden" }}>
      <ListItem key={1} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: openSideBar ? "initial" : "center",
            px: 2.5,
          }}
          onClick={() => doNavigate("Dashboard")}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: openSideBar ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary={"Dashboard"}
            sx={{ opacity: openSideBar ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>

      <Divider></Divider>

      <Accordion  expanded={expanded} onChange={ () => handleAccordionChange(1)}>
        <AccordionSummary
          expandIcon={openSideBar ? <ExpandMoreIcon /> : null}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <AccountBoxRoundedIcon />
          <Typography>{openSideBar ? "Usuarios" : ""}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {items_users.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => doNavigate(item.label)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded2} onChange={ () => handleAccordionChange(2)}>
        <AccordionSummary
          expandIcon={openSideBar ? <ExpandMoreIcon /> : null}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <LeaderboardRounded />
          <Typography>{openSideBar ? "Reportes" : ""}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {items_report.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => doNavigate(item.label)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded3} onChange={ () => handleAccordionChange(3)}>
        <AccordionSummary
          expandIcon={openSideBar ? <ExpandMoreIcon /> : null}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <HomeWorkRounded/>
          <Typography> {openSideBar ? "Entidades" : ""}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {items_entities.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => doNavigate(item.label)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded4} onChange={ () => handleAccordionChange(4)}>
        <AccordionSummary
          expandIcon={openSideBar ? <ExpandMoreIcon /> : null}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <RecyclingRounded />
          <Typography>{openSideBar ? "Residuos" : ""}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {items_residue.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => doNavigate(item.label)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded5} onChange={ () => handleAccordionChange(5)}>
        <AccordionSummary
          expandIcon={openSideBar ? <ExpandMoreIcon /> : null}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          <DirectionsRunRounded />
          <Typography>{openSideBar ? "Recoleccion" : ""}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {items_recollection.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => doNavigate(item.label)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AdminList;
