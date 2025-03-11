import { LinearProgress, Typography, Box, Stack } from '@mui/material';
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
        <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
                Gesamt RAM: {totalRamGB} GB
            </Typography>
            
            <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    RAM Auslastung: {ramUsagePercent.toFixed(1)}%
                </Typography>
                <LinearProgress 
                    variant="determinate" 
                    value={ramUsagePercent}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#00c853', // Grüner Hintergrund für freien Speicher
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#ff4444'  // Roter Balken für belegten Speicher
                        }
                    }}
                />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
                Verwendet: {usedRamGB} /  {totalRamGB} GB
            </Typography>
          </Stack>
    );
}
