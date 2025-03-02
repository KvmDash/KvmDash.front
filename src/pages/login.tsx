import { Box } from '@mui/material'
import { Login } from '@components/auth/Login'

export default function LoginPage() {
    return (
        <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default'
        }}>
            <Login />
        </Box>
    )
}