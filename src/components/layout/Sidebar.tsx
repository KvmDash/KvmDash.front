import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List, Box, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Toolbar, Collapse } from '@mui/material';
import { sidebarStyles } from '@theme/components/SidebarStyles'
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

// KVMDash Logo
import KvmLogo from '@assets/kvmdash.svg';

// Types
import { type VMData, type VirtualMachine } from '@interfaces/vm.types';
import { TokenStorage } from '../../services/tokenStorage'

const drawerWidth = 240;

const dummyVMs: VirtualMachine = {
    'ubuntu-server': { 'state.state': '1' },
    'debian-test': { 'state.state': '0' },
    'windows-dev': { 'state.state': '1' }
};

interface SidebarProps {
    open: boolean;
    toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
    const [openVm, setOpenVm] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        TokenStorage.removeToken(); 
        navigate('/login');
    };

    const handleVmClick = () => {
        if (!open) {
            toggleDrawer();
        }
        setOpenVm(!openVm);
    };

    const getVmStatusColor = (vmData: VMData): string => {
        return vmData['state.state'] === '1' ? 'green' : 'grey';
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
            sx={{
                width: open ? drawerWidth : '64px',
                '& .MuiDrawer-paper': {
                    width: open ? drawerWidth : '64px'
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
                        {open && <ListItemText primary="Home" />}
                    </ListItemButton>
                </ListItem>

                <ListItem key="vm" disablePadding>
                    <ListItemButton onClick={handleVmClick} sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <StorageIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary="Virtual Machines" />}
                        {open ? (openVm ? <ExpandLess /> : <ExpandMore />) : null}
                    </ListItemButton>
                </ListItem>

                {open && (
                    <Collapse in={openVm} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {Object.entries(dummyVMs).map(([vmName, vmData]) => (
                                <ListItem key={vmName} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={`/vm/${vmName}`}
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon>
                                            <ComputerIcon sx={{ color: getVmStatusColor(vmData) }} />
                                        </ListItemIcon>
                                        <ListItemText primary={vmName} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}

                <ListItem key="settings" disablePadding>
                    <ListItemButton component={Link} to="/settings" sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary="Settings" />}
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
                        {open && <ListItemText primary="Logout" />}
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;