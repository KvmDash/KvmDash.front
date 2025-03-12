import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import HostInfo from '@components/host/HostInfo'   
import CpuInfo from '@/components/host/CpuInfoCharts' 
import MemInfo from '@/components/host/MemInfo'
import DiskInfo from '@/components/host/DiskInfoCharts'

export default function Home() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid size={{xs: 12, md: 6 }}>
                    <HostInfo />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <MemInfo />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <DiskInfo />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <CpuInfo />
                </Grid>


            </Grid>
        </Box>
    )
}