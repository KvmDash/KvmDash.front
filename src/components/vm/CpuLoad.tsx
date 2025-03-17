import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LinearProgress, Typography, Box } from '@mui/material';
import type { VmStats } from '../../types/vm.types';

interface CpuLoadProps {
    stats: VmStats;
}

export default function CpuLoad({ stats }: CpuLoadProps) {
    const { t } = useTranslation();
    const [lastCpuTime, setLastCpuTime] = useState(stats.stats.cpu_time);
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [cpuUsage, setCpuUsage] = useState(0);

    useEffect(() => {
        const now = Date.now();
        const timeDiff = (now - lastUpdate) / 1000; // Zeit in Sekunden
        const cpuTimeDiff = stats.stats.cpu_time - lastCpuTime;
        
        // CPU Usage in Prozent (cpuTimeDiff / timeDiff gibt uns die CPU-Zeit pro Sekunde)
        const usage = (cpuTimeDiff / timeDiff) * 100 / stats.cpuCount;
        
        setCpuUsage(Math.min(Math.max(usage, 0), 100));
        setLastCpuTime(stats.stats.cpu_time);
        setLastUpdate(now);
    }, [stats]);

    return (    
        <Box sx={{ width: '100%' }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 0.5
            }}>
                <Typography variant="body2" fontWeight="medium">
                    {t('vm.metrics.cpuUsage')}: {cpuUsage.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('vm.metrics.cpuTime')}: {stats.stats.cpu_time.toFixed(2)}s
                </Typography>
            </Box>
            
            <LinearProgress
                variant="determinate"
                value={cpuUsage}
                sx={{
                    height: 15,
                    borderRadius: 2,
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: (theme) => {
                            if (cpuUsage < 70) return theme.palette.success.main;
                            if (cpuUsage < 90) return theme.palette.warning.main;
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
                    {t('vm.metrics.used')}
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
                    <span>{t('vm.metrics.cpuCount')}:</span>
                    <span style={{ fontWeight: 'bold' }}>{stats.cpuCount}</span>
                </Typography>
            </Box>
        </Box>
    );
}