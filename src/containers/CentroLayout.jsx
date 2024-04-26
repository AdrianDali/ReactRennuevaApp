import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import RennuevaLogo from '../assets/Rennueva.jpg';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useState } from 'react';
import { useEffect } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import HomeIcon from '@mui/icons-material/Home';
import DocIcon from '@mui/icons-material/Description';
import MuiDrawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';


const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const user = {
    name: "Usuario Ejemplo",
    email: "usuario@example.com",
    avatar: "/avatar.jpg",
};

const defaultTheme = createTheme();
const drawerWidth = 250;

const openedMixin = (theme) => ({
    width: drawerWidth,
    top: '100px',
    left: '10px',
    borderRadius: '25px',
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
    top: '100px',
    left: '10px',
    borderRadius: '25px',
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

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
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



const DrawerList = ({ open, setOpen, desktop }) => (
    <Box sx={{ width: '100%', py: 2 }} role="presentation" onClick={() => setOpen(false)} >
        <Box
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Avatar

                src={user.avatar}
                sx={{ width: '64px', mb: 1, height: '64px', transform: !open && 'scale(0.5)', transition: 'transform 0.25s'}}
            />

            <Typography variant="h6" sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.25s' }}>
                {user.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.25s' }}>
                {user.email}
            </Typography>
        </Box>
        <Divider />
    </Box>
);


const MobileMenu = ({ open, setOpen }) => {

    return (
        <Drawer open={open} onClose={() => setOpen(false)} sx={{ '& .MuiPaper-root': { top: '85px', borderRadius: '25px' } }}>
            <DrawerList open={open} setOpen={setOpen} desktop={false} />
        </Drawer>
    )

}


const DesktopMenu = ({ open, setOpen }) => {
    const theme = useTheme();

    return (
        <StyledDrawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={() => setOpen(!open)}>
                    {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <DrawerList open={open} setOpen={setOpen} desktop={true} />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
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
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </StyledDrawer>)
}





export default function CentroLayout({ children }) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [desktop, setDesktop] = useState(window.innerWidth > 899);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };





    useEffect(() => {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 899) {
                setDesktop(true);
            } else {
                setDesktop(false);
            }
        });

        return () => {
            window.removeEventListener('resize', () => {
                if (window.innerWidth > 899) {
                    setDesktop(true);
                } else {
                    setDesktop(false);
                }
            });
        }

    }, []);




    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ bgcolor: (theme) => theme.palette.grey[100] }}>
                <AppBar position="sticky" sx={{ display: 'flex', flexDirection: 'row', padding: 0, backgroundColor: 'white', borderRadius: { xs: '0 0 25px 25px', md: '25px' }, width: { xs: '100%', md: 'calc(100% - 16px)' }, left: { xs: 0, md: '8px' }, top: { xs: '0', md: '8px' }, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Container maxWidth="xl" >
                        <Toolbar disableGutters sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={() => {
                                        open ? setOpen(false) : setOpen(true);
                                    }}
                                    color="primary"
                                >
                                    {open ? <ArrowBackIcon /> : <MenuIcon />}
                                </IconButton>
                            </Box>
                            <Box sx={{ height: '50px', marginX: { xs: 'auto', md: '0' } }}>
                                <img src={RennuevaLogo} alt="Rennueva" style={{ height: '100%' }} />
                            </Box>
                            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Box sx={{ display: 'flex', maxWidth: '100vw', overflow: 'hidden' }}>
                    {desktop
                        ? <DesktopMenu open={open} setOpen={setOpen} />
                        : <MobileMenu open={open} setOpen={setOpen} />}
                    <Box sx={{ flexGrow: { xs: 0, md: 1 } }}>
                        {children}
                    </Box>

                </Box>
            </Box>
        </ThemeProvider>
    );

}