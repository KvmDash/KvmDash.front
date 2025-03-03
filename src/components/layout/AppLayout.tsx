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
            <main style={{
                flexGrow: 1,
                padding: '20px',
                marginLeft: 64,
                transition: 'margin 0.3s'
            }}>
                <Outlet />
            </main>
        </Box>
    )
}