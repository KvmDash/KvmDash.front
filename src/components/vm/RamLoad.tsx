import { LinearProgress, Typography, Box } from '@mui/material';
import type { VmStats } from '../../types/vm.types';

interface RamLoadProps {
    stats: VmStats;
}

export default function RamLoad({ stats }: RamLoadProps) {
    // Umrechnung in GB für bessere Lesbarkeit
    const totalRamGB = (stats.stats.max_memory / 1048576).toFixed(2);
    const usedRamGB = (stats.stats.memory_usage / 1048576).toFixed(2);
    
    // Berechnung der Prozentuale Auslastung
    const ramUsagePercent = (stats.stats.memory_usage / stats.stats.max_memory) * 100;

    return (    
        <Box sx={{ width: '100%' }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 0.5
            }}>
                <Typography variant="body2" fontWeight="medium">
                    RAM Auslastung: {ramUsagePercent.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {usedRamGB} / {totalRamGB} GB
                </Typography>
            </Box>
            
            <LinearProgress
                variant="determinate"
                value={ramUsagePercent}
                sx={{
                    height: 15,
                    borderRadius: 2,
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: (theme) => {
                            if (ramUsagePercent < 70) return theme.palette.success.main;
                            if (ramUsagePercent < 90) return theme.palette.warning.main;
                            return theme.palette.error.main;
                        },
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.09)'
                }}
            />
            
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 1, 
                color: 'text.secondary',
                fontSize: '0.8rem'
            }}>
                <Typography variant="caption">
                    0%
                </Typography>
                <Typography variant="caption">
                    Belegt
                </Typography>
                <Typography variant="caption">
                    100%
                </Typography>
            </Box>
            
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 1
                }}>
                    <span>Gesamt RAM:</span>
                    <span style={{ fontWeight: 'bold' }}>{totalRamGB} GB</span>
                </Typography>
            </Box>
        </Box>
    );
}
