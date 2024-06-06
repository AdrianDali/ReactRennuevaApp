import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#93c030',
      },
      secondary: {
        main: '#203567',
      },
      background: {
        default: '#f5f7f6',
        paper: '#ffffff',
      },
      divider: 'rgba(32,53,103,0.12)',
    },
    typography: {
      fontFamily: 'Poppins',
    },
    shape: {
      borderRadius: 8,
    },
    overrides: {
      MuiAppBar: {
        colorInherit: {
          backgroundColor: '#689f38',
          color: '#fff',
        },
      },
    },
    props: {
      MuiAppBar: {
        color: 'inherit',
      },
    },
  });

  export default theme;