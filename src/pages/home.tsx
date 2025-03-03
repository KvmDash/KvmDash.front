import { Box, Typography } from '@mui/material'
import { HostInfo } from '@components/host/HostInfo'    

export default function Home() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Home
            </Typography>
            <HostInfo />
            
        </Box>
    )
}