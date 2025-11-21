import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ResponsiveAppBar from './LayoutAppBar';
import { useNavigate } from 'react-router-dom';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import RecyclingRoundedIcon from '@mui/icons-material/RecyclingRounded';
import Man2RoundedIcon from '@mui/icons-material/Man2Rounded';
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import ElectricRickshawRoundedIcon from '@mui/icons-material/ElectricRickshawRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpenClose = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClickUsersGroups = (index) => {
    console.log("index");
    console.log(index);
    if (index == 0) {
      navigate('/users');
    } else if (index == 1) {
      navigate('/groups');
    }
  }
  const handleClickResidueGeneratorDonor = (index) => {
    console.log("index");
    console.log(index);
    if (index == 0) {
      navigate('/residue');
    } else if (index == 1) {
      navigate('/generator');
    } else if (index == 2) {
      navigate('/company');
    } else if (index == 3) {
      navigate('/donor');
    } else if (index == 4) {
      navigate('/donor-recolection');
    }

  }
  const handleClickCCDriverCarrier = (index) => {
    console.log("index");
    console.log(index);
    if (index == 0) {
      navigate('/recycling-center');
    } else if (index == 1) {
      navigate('/collection-center');
    } else if (index == 2) {
      navigate('/driver');
    } else if (index == 3) {
      navigate('/vehicle');
    }
    else if (index == 4) {
      navigate('/carrier');
    }

  }

  const handleClickResponsivas = (index) => {
    console.log("index");
    console.log(index);
    if (index == 0) {
      navigate('/report');
    } else if (index == 1) {
      navigate('/tracking');
    }
    else if (index == 2) {
      navigate('/report-history');
    }
  }
  




  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ResponsiveAppBar />
      <Drawer variant="permanent" open={open}>

        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: .9, marginBottom: .9 }}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerOpenClose}>
              {open === false ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
        </Box>


        <Divider />
        <List>
          {['Dashboard'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => { navigate('/dash') }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index === 0 ? <LeaderboardRoundedIcon /> : null}


                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
    
        <Divider />
        <List>
          {['Usuarios', 'Grupos'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleClickUsersGroups(index)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <AccountBoxRoundedIcon /> : <GroupsRoundedIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />

        <List>
          {['Residuos', 'Generadores',"Compañías", 'Donadores', "Orden de Recolección"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleClickResidueGeneratorDonor(index)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index === 0 ? <RecyclingRoundedIcon /> : null}
                  {index === 1 ? <ElectricBoltRoundedIcon /> : null}
                  {index === 2 ? <Man2RoundedIcon /> : null}
                  {index === 3 ? <Man2RoundedIcon /> : null}
                  {index === 4 ? <Man2RoundedIcon /> : null}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Centros Reciclaje', 'Centros de Recolección', "Conductor", "Vehículo","Transportista"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleClickCCDriverCarrier(index)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >

                  {index === 0 ? <HomeRoundedIcon /> : null}
                  {index === 1 ? <HomeWorkRoundedIcon /> : null}
                  {index === 2 ? <DirectionsRunRoundedIcon /> : null}
                  {index === 3 ? <LocalShippingRoundedIcon /> : null}
                  {index === 4 ? <ElectricRickshawRoundedIcon /> : null}



                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Divider />
        <List>
          {['Responsivas', "Busqueda","Historial"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleClickResponsivas(index)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index === 0 ? <AssignmentRoundedIcon /> : null}
                  {index === 1 ? <AssignmentRoundedIcon /> : null}
                  {index === 2 ? <AssignmentRoundedIcon /> : null}


                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

    </Box>
  );
}