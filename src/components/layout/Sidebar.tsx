import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// mui
import { List, Box, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Toolbar, Collapse, Tooltip } from '@mui/material';
import Drawer from '@mui/material/Drawer';

// MUI Icons
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from '@mui/icons-material/Logout';
import AlbumIcon from '@mui/icons-material/Album';


// Components
import { sidebarStyles } from '@theme/components/SidebarStyles'

// KVMDash Logo
import KvmLogo from '@assets/kvmdash.svg';

// types and interfaces
import { VMResponse } from '@interfaces/vm.types';

// Services
import { getVirtualMachines } from '@services/virtualization';
import { TokenStorage } from '@services/tokenStorage'



interface SidebarProps {
    open: boolean;
    toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
    const { t } = useTranslation(); // Translation Hook
    const [openVm, setOpenVm] = useState(false);
    const [vms, setVms] = useState<VMResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVMs = async () => {
            try {
                const vmList = await getVirtualMachines();
                setVms(vmList);
            } catch (err) {
                setError(t('common.error'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVMs();
        // Aktualisierung alle 5 Sekunden
        const interval = setInterval(fetchVMs, 5000);
        return () => clearInterval(interval);
    }, [t]);

    const handleLogout = () => {
        TokenStorage.removeToken();
        navigate('/login');
    };

    const handleVmClick = () => {
        if (!open) {
            toggleDrawer();
        }
        setOpenVm(!openVm);
        navigate('/vm');
    };

    /**
     * Bestimmt die Farbe des VM-Icons basierend auf dem Status
     * @param state - Status der VM als Nummer
     * @returns MUI Farb-String (success.main, warning.main, etc.)
     */
    const getVmStatusColor = (state: number): string => {
        switch (state) {
            case 1:
                return 'success.main';  // Grün = VM läuft
            case 3:
                return 'warning.main';  // Orange = VM pausiert
            case 5:
                return 'grey';    // Rot = VM heruntergefahren
            default:
                return 'text.grey'; // Grau = Status unbekannt
        }
    };

    /**
     * Prüft, ob eine VM aktiv ist
     * @param state - Status der VM als Nummer
     * @returns boolean - true wenn VM aktiv ist, sonst false
     */
    const isVmActive = (state: number): boolean => {
        return state !== 5; // VM ist aktiv wenn sie nicht heruntergefahren ist (state 5)
    };

    /**
     * Behandelt den Klick auf eine VM
     * @param vmName - Name der VM
     * @param isActive - Ist die VM aktiv?
     * @param event - Event-Objekt
     */
    const handleVmItemClick = (vmName: string, isActive: boolean, event: React.MouseEvent) => {
        if (!isActive) {
            event.preventDefault();
            // Optional: Hier könnte man ein Toast/Snackbar anzeigen, das erklärt, dass inaktive VMs nicht verfügbar sind
            console.log(`VM ${vmName} ist nicht verfügbar, da sie nicht aktiv ist.`);
        }
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
            sx={{
                width: sidebarStyles.drawer.width(open),
                '& .MuiDrawer-paper': {
                    ...sidebarStyles.drawer.paper,
                    width: sidebarStyles.drawer.width(open)
                }
            }}
        >
            <Toolbar>
                <img
                    src={KvmLogo}
                    alt="Logo"
                    style={{
                        ...sidebarStyles.logo.transition.common,
                        ...(open ? sidebarStyles.logo.transition.open : sidebarStyles.logo.transition.closed)
                    }}
                />
            </Toolbar>

            <Divider />

            <Box sx={sidebarStyles.drawerControlIcon.container}>
                <IconButton onClick={toggleDrawer}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

            <List>
                <ListItem key="home" disablePadding>
                    <ListItemButton component={Link} to="/" sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <HomeIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary={t('sidebar.home')} />}
                    </ListItemButton>
                </ListItem>

                <ListItem key="vm" disablePadding>
                    <ListItemButton onClick={handleVmClick} sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <StorageIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary={t('sidebar.virtualMachines')} />}
                        {open ? (openVm ? <ExpandLess /> : <ExpandMore />) : null}
                    </ListItemButton>
                </ListItem>

                {open && (
                    <Collapse in={openVm} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {loading ? (
                                <ListItem>
                                    <ListItemText primary={t('common.loading')} />
                                </ListItem>
                            ) : error ? (
                                <ListItem>
                                    <ListItemText primary={error} sx={{ color: 'error.main' }} />
                                </ListItem>
                            ) : vms.map((vm) => {
                                const active = isVmActive(vm.state);
                                return (
                                    <ListItem key={vm.name} disablePadding>
                                        <Tooltip title={!active ? t('sidebar.vmInactive', 'VM ist nicht aktiv') : ""} placement="right">
                                            <ListItemButton
                                                component={Link}
                                                to={active ? `/vm/${vm.name}` : '#'}
                                                onClick={(e) => handleVmItemClick(vm.name, active, e)}
                                                sx={{ 
                                                    pl: 4, 
                                                    opacity: active ? 1 : 0.6,
                                                    pointerEvents: active ? 'auto' : 'auto' // Wir behalten pointer-events bei, um den Tooltip zu zeigen
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <ComputerIcon sx={{ color: getVmStatusColor(vm.state) }} />
                                                </ListItemIcon>
                                                <ListItemText primary={vm.name} />
                                            </ListItemButton>
                                        </Tooltip>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Collapse>
                )}



                <ListItem key="iso-images" disablePadding>
                    <ListItemButton component={Link} to="/iso-images" sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <AlbumIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary={t('sidebar.isoImages')} />}
                    </ListItemButton>
                </ListItem>

                <ListItem key="settings" disablePadding>
                    <ListItemButton component={Link} to="/settings" sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary={t('sidebar.settings')} />}
                    </ListItemButton>
                </ListItem>
            </List>

            <List sx={{ marginTop: 'auto' }}>
                <ListItem key="logout" disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            justifyContent: open ? 'initial' : 'center',
                            color: 'error.main'
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <LogoutIcon sx={{ color: 'error.main' }} />
                        </ListItemIcon>
                        {open && <ListItemText primary={t('sidebar.logout')} />}
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;