import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { MemData } from '@interfaces/host.types';
import { getMemInfo } from '@services/host';



export const MemInfo = () => {
    const [memData, setMemData] = useState<MemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMemInfo = async () => {
            try {
                const data = await getMemInfo();
                setMemData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
                console.error('Fehler beim Laden der Speicher-Informationen:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMemInfo();

        // Aktualisierung alle 5 Sekunden
        const interval = setInterval(fetchMemInfo, 5000);
        return () => clearInterval(interval);
    }, []);


    // Prozentsatz des benutzten Speichers berechnen
    const getUsedPercentage = () => {
        if (!memData) return 0;
        // Entferne 'G' und konvertiere zu number
        const total = parseFloat(memData.total.replace('G', ''));
        const used = parseFloat(memData.used.replace('G', ''));
        return (used / total) * 100;
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={2}>
                <LinearProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!memData) {
        return null;
    }



    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Speicherinformationen" />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="textSecondary">
                                Speichernutzung
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={getUsedPercentage()}
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
                                <Typography variant="body2" sx={{ minWidth: 45 }}>
                                    {getUsedPercentage().toFixed(1)}%
                                </Typography>
                            </Box>
                            <Grid container spacing={1}>
                                {[
                                    { label: 'Gesamt', value: memData?.total },
                                    { label: 'Verwendet', value: memData?.used },
                                    { label: 'Verfügbar', value: memData?.available }
                                ].map(({ label, value }) => (
                                    <Grid size={{ xs: 6, md: 4 }} key={label}>
                                        <Typography variant="body2" color="textSecondary">{label}</Typography>
                                        <Typography variant="body1">{value || 'N/A'}</Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MemInfo;