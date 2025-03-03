import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';

import { CpuData } from '@interfaces/host.types';
import { getCpuInfo } from '@services/host';


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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCpuInfo = async () => {
            try {
                const data = await getCpuInfo();
                setCpuData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
                console.error('Fehler beim Laden der CPU-Informationen:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCpuInfo();
        
        // Aktualisierung alle 5 Sekunden
        const interval = setInterval(fetchCpuInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="CPU Auslastung" />
                <CardContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <LinearProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <Grid container spacing={1}>
                            {/* Gesamt-CPU zuerst anzeigen */}
                            {cpuData
                                .filter(cpu => cpu.cpu === 'cpu')
                                .map(cpu => (
                                    <Grid size={{xs: 12}} key={cpu.cpu}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="body1" sx={{ minWidth: 60, fontWeight: 'bold' }}>
                                                Total
                                            </Typography>
                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={cpu.usage} 
                                                    sx={{
                                                        height: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: 'surface.main',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: getUsageColor(cpu.usage)
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body1" sx={{ minWidth: 45, fontWeight: 'bold' }}>
                                                {cpu.usage.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            
                            {/* Dann die einzelnen Cores */}
                            {cpuData
                                .filter(cpu => cpu.cpu !== 'cpu')
                                .map((cpu) => (
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