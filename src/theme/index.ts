import { createTheme } from '@mui/material/styles';

// Konstanten
const DRAWER_WIDTH = 240;
const DRAWER_MINI_WIDTH = 64;

// Theme-Erweiterung für TypeScript
declare module '@mui/material/styles' {
    interface Theme {
        drawer: {
            width: number;
            miniWidth: number;
        };
    }
    interface ThemeOptions {
        drawer?: {
            width: number;
            miniWidth: number;
        };
    }
}

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
    // Basis Theme-Konfiguration
    palette: {
        mode: 'dark',
        ...themeColors
    },

    // Custom Drawer Konfiguration
    drawer: {
        width: DRAWER_WIDTH,
        miniWidth: DRAWER_MINI_WIDTH
    },

    // Komponenten-Styles
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: themeColors.background.default,
                    margin: 0,
                    padding: 0,
                    minHeight: '100vh'
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                root: {
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                        transition: 'width 0.3s',
                        boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.5)',
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: themeColors.background.default,
                    color: themeColors.text.primary
                }
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    backgroundColor: themeColors.primary.dark,
                    color: themeColors.text.primary
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    color: themeColors.text.primary,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: themeColors.surfaceTonal.dark,
                        '& .MuiListItemIcon-root': {
                            color: themeColors.primary.light
                        },
                        '& .MuiListItemText-primary': {
                            color: themeColors.primary.light
                        }
                    }
                }
            }
        }
    }
});

// Separate Style-Definitionen für die Sidebar
export const sidebarStyles = {
    drawer: {
        width: (open: boolean) => open ? DRAWER_WIDTH : DRAWER_MINI_WIDTH,
        paper: {
            width: (open: boolean) => open ? DRAWER_WIDTH : DRAWER_MINI_WIDTH
        }
    },
    logo: {
        transition: {
            open: {
                width: '100%',
                maxWidth: '100px',
            },
            closed: {
                width: '50%',
                maxWidth: '32px',
            },
            common: {
                minWidth: '32px',
                height: 'auto',
                transition: 'width 0.3s, max-width 0.3s'
            }
        }
    },
    drawerControlIcon: {
        container: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px'
        }
    }
};