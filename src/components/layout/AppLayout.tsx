import { useState, useEffect } from 'react'
import { Outlet, useNavigate  } from 'react-router-dom'
import { Box } from '@mui/material'
import SideBar from '@components/layout/Sidebar'
import { TokenStorage } from '../../services/tokenStorage'

export const AppLayout = () => {
    const [open, setOpen] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Beim Mounten prüfen ob Token existiert
        const token = TokenStorage.getToken()
        if (!token) {
            navigate('/login')
        }
    }, [navigate])

    const toggleDrawer = () => {
        setOpen(!open)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <SideBar open={open} toggleDrawer={toggleDrawer} />
            <Box 
                component="main"  // Dies macht das Box-Element zu einem main-Element
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',  // Verwendet Theme Background
                    p: 3,  // padding: theme.spacing(3)
                    marginLeft: 8,  // 64px in MUI's 8px Einheiten
                    transition: 'margin 0.3s'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}