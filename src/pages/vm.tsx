import { Box, Typography } from '@mui/material'
import CreateForm from '@/components/vm/CreateForm'

export default function VM() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                VM
            </Typography>
            <CreateForm />
        </Box>
    )
}