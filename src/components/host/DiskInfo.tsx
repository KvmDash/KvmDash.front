import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DiskData } from '@interfaces/host.types';

/**
 * Konvertiert Speichereinheiten in GB
 */
const convertToGB = (value: string): number => {
    const unit = value.slice(-1);
    const num = parseFloat(value.slice(0, -1));
    switch (unit) {
        case 'T': return num * 1024;
        case 'G': return num;
        case 'M': return num / 1024;
        case 'K': return num / (1024 * 1024);
        default: return num;
    }
};

/**
 * Generiert Dummy-Festplattendaten für die Entwicklung
 */
const generateDummyDiskData = (): DiskData[] => ([
    {
        Filesystem: '/dev/sda1',
        Size: '500G',
        Used: '250G',
        Avail: '250G',
        Use: '50%',
        Mounted: '/'
    },
    {
        Filesystem: '/dev/sdb1',
        Size: '1T',
        Used: '600G',
        Avail: '400G',
        Use: '60%',
        Mounted: '/home'
    }
]);

export const DiskInfo = () => {
    const [diskData, setDiskData] = useState<DiskData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuliere API-Aufruf
        const timer = setTimeout(() => {
            setDiskData(generateDummyDiskData());
            setLoading(false);
        }, 1000);

        // Simuliere Polling
        const interval = setInterval(() => {
            const randomizedData = generateDummyDiskData().map(disk => ({
                ...disk,
                Used: `${Math.floor(Math.random() * parseInt(disk.Size))}${disk.Size.slice(-1)}`,
                Use: `${Math.floor(Math.random() * 100)}%`
            }));
            setDiskData(randomizedData);
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Festplatteninformationen" />
                <CardContent>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {diskData.map((disk, index) => {
                                const totalGB = convertToGB(disk.Size);
                                const usedGB = convertToGB(disk.Used);
                                const usedPercentage = (usedGB / totalGB) * 100;
                                return (
                                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {disk.Mounted} 
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <Box sx={{ width: '100%', mr: 1, position: 'relative' }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={100}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: 'transparent',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: '#00c853'
                                                            }
                                                        }}
                                                    />
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={usedPercentage}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: 'transparent',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: '#ff4444'
                                                            },
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%'
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="body2" sx={{ minWidth: 45 }}>
                                                    {disk.Use}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Verfügbar: {disk.Avail} ({disk.Size} total, {disk.Used} used)
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default DiskInfo;