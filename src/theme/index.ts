import { createTheme } from '@mui/material';

// Theme Konstanten
const themeColors = {
    primary: {
        main: '#954b1e',     // primary-a10
        light: '#c28c6d',    // primary-a40
        dark: '#853500',     // primary-a0
    },
    background: {
        default: '#121212',  // surface-a0
        paper: '#282828',    // surface-a10
    },
    text: {
        primary: '#ffffff',  // light-a0
        secondary: '#8b8b8b' // surface-a50
    },
    surface: {
        main: '#3f3f3f',    // surface-a20
        light: '#575757',   // surface-a30
        dark: '#282828',    // surface-a10
    },
    surfaceTonal: {
        main: '#72503c',    // surface-tonal-a20
        light: '#9a7e6f',   // surface-tonal-a40
        dark: '#4a250e',    // surface-tonal-a0
    }
};

export const theme = createTheme({
    palette: themeColors,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: themeColors.background.default,
                    margin: 0,
                    padding: 0,
                    minHeight: '100vh'
                },
                html: {
                    margin: 0,
                    padding: 0,
                    height: '100%'
                }
            }
        }
    }
});
