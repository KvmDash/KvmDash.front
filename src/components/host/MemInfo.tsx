import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { MemData } from '@interfaces/host.types';

/**
 * Konvertiert Speichereinheiten in GB
 */
const convertToGB = (value: string): number => {
    const unit = value.slice(-2);
    const num = parseFloat(value.slice(0, -2));
    switch (unit) {
        case 'Ti': return num * 1024;
        case 'Gi': return num;
        case 'Mi': return num / 1024;
        case 'Ki': return num / (1024 * 1024);
        default: return num;
    }
};

/**
 * Generiert Dummy-Speicherdaten für die Entwicklung
 */
const generateDummyMemData = (): MemData => ({
    total: "32Gi",
    used: `${Math.floor(Math.random() * 20)}Gi`,
    available: "12Gi"
});

export const MemInfo = () => {
    const [memData, setMemData] = useState<MemData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuliere API-Aufruf
        const timer = setTimeout(() => {
            setMemData(generateDummyMemData());
            setLoading(false);
        }, 1000);

        // Simuliere Polling
        const interval = setInterval(() => {
            setMemData(generateDummyMemData());
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!memData) {
        return null;
    }

    const totalGB = convertToGB(memData.total);
    const usedGB = convertToGB(memData.used);
    const availableGB = convertToGB(memData.available);
    const usedPercentage = (usedGB / totalGB) * 100;

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Speicherinformationen" />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12}}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Gesamtspeicher: {memData.total}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
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
                            </Box>
                            <Typography variant="body2">
                                Verfügbar: {availableGB.toFixed(1)} GiB (Gesamt: {totalGB.toFixed(1)} GiB, Belegt: {usedGB.toFixed(1)} GiB)
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MemInfo;