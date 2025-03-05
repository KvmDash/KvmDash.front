import { Box } from '@mui/material'
import HostInfo from '@components/host/HostInfo'   
import CpuInfo from '@/components/host/CpuInfo' 
import MemInfo from '@/components/host/MemInfo'
import DiskInfo from '@/components/host/DiskInfo'

export default function Home() {
    return (
        <Box sx={{ p: 3 }}>
            <HostInfo />
            <CpuInfo />
            <MemInfo />
            <DiskInfo />
        </Box>
    )
}