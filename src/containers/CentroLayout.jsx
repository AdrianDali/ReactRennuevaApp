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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import RennuevaLogo from '../assets/Rennueva.jpg';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useState, useEffect } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MuiDrawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useAuth from '../hooks/useAuth';
import theme from '../context/theme';
import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';
import { useNavigate } from 'react-router-dom';



const settings = ['Profile', 'Account', 'Logout'];
const user = {
    name: "Usuario Ejemplo",
    email: "usuario@example.com",
    avatar: "/avatar.jpg",
};


const drawerWidth = 300;

const openedMixin = (theme) => ({
    width: drawerWidth,
    top: '100px',
    left: '10px',
    bottom: '0',
    borderRadius: '25px',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'scroll',
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
        '& .MuiPaper-root': {
            height: 'calc(100% - 100px)',
            width: drawerWidth,
            borderRadius: '25px'
        },

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



const ProfileSection = ({ open, setOpen, desktop, dataUser }) => (

    <Box sx={{ width: '100%', py: 2, pb: 0 }} role="presentation" onClick={() => setOpen(false)} >
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
                sx={{ width: '64px', mb: 1, height: '64px', transform: !open && 'scale(0.5)', transition: 'transform 0.25s' }}
            />

            <Typography variant="h6" sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}>
                {dataUser ? dataUser.first_name : 'Usuario'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}>
                {dataUser ? dataUser.email : ''}
            </Typography>
            <Typography variant="body2" sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}>
                {dataUser ? dataUser.groups[0] : ''}
            </Typography>
        </Box>
        <Divider />
    </Box>
);


const MobileMenu = ({ children, open, setOpen }) => {

    return (
        <Drawer open={open}
            onClose={() => setOpen(false)}
            sx={{
                '& .MuiPaper-root': {
                    height: 'calc(100% - 90px)',
                    top: '85px',
                    width: drawerWidth,
                    borderRadius: '25px'
                }
            }}>
            <ProfileSection open={open} setOpen={setOpen} desktop={false} />
            {children}
        </Drawer>
    )

}


const DesktopMenu = ({ open, setOpen, children, dataUser }) => {

    return (
        <StyledDrawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={() => setOpen(!open)}>
                    {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <ProfileSection open={open} setOpen={setOpen} desktop={true} dataUser={dataUser} />
            <Box sx={{
                height: '100%',
                overflowY: 'scroll',
                pb: '1rem',
                overflowX: 'hidden',
            }}>
                {children}
            </Box>

        </StyledDrawer>)
}





export default function CentroLayout({ children, List }) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [desktop, setDesktop] = useState(window.innerWidth > 899);
    const navigate = useNavigate();

    const dataUser = useAuth();
    //console.log(dataUser);


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        navigate('/');
        setAnchorElUser(null);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 899) {
                setDesktop(true);
            } else {
                setDesktop(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);


    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: (theme) => theme.palette.grey[100], minHeight: '100vh' }}>
                <AppBar position="sticky" sx={{ display: 'flex', flexDirection: 'row', padding: 0, backgroundColor: 'white', borderRadius: { xs: '0 25px 25px 25px', md: '25px' }, width: { xs: '100%', md: 'calc(100% - 16px)' }, left: { xs: 0, md: '8px' }, top: { xs: '0', md: '5px' }, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Cerrar sesión</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Box sx={{ display: 'flex', width: '100vw' }}>
                    {desktop
                        ? <DesktopMenu open={open} setOpen={setOpen} dataUser={dataUser}>
                            {List}
                        </DesktopMenu>
                        : <MobileMenu open={open} setOpen={setOpen} >
                            {List}
                        </MobileMenu>
                    }

                    {children}

                </Box>
            </Box>
        </ThemeProvider>
    );

}