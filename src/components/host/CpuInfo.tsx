import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { CpuData } from '@interfaces/host.types';

/**
 * Bestimmt die Farbe basierend auf der CPU-Auslastung
 */
const getUsageColor = (usage: number): string => {
    if (usage > 80) return '#ff4444';     // Rot bei hoher Last
    if (usage > 60) return '#ffaa00';     // Orange bei mittlerer Last
    return '#00c853';                     // Grün bei niedriger Last
};

/**
 * Generiert Dummy-CPU-Daten für die Entwicklung
 */
const generateDummyCpuData = (): CpuData[] => {
    return Array.from({ length: 8 }, (_, i) => ({
        cpu: `cpu${i}`,
        total: 100,
        idle: Math.random() * 40,
        used: Math.random() * 60,
        usage: Math.random() * 100
    }));
};

export const CpuInfo = () => {
    const [cpuData, setCpuData] = useState<CpuData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuliere API-Aufruf
        const timer = setTimeout(() => {
            setCpuData(generateDummyCpuData());
            setLoading(false);
        }, 1000);

        // Simuliere Polling
        const interval = setInterval(() => {
            setCpuData(generateDummyCpuData());
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="CPU Auslastung" />
                <CardContent>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <Grid container spacing={1}>
                            {cpuData.map((cpu) => (
                                <Grid size={{xs: 12, md: 6}} key={cpu.cpu}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                                            Core {cpu.cpu.replace('cpu', '')}
                                        </Typography>
                                        <Box sx={{ width: '100%', mr: 1 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={cpu.usage} 
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: 'surface.main',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: getUsageColor(cpu.usage)
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" sx={{ minWidth: 45 }}>
                                            {cpu.usage.toFixed(1)}%
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default CpuInfo;