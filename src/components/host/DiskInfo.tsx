import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DiskData } from '@interfaces/host.types';
import { getDiskInfo } from '@services/host';

export const DiskInfo = () => {
    const [diskData, setDiskData] = useState<DiskData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDiskInfo = async () => {
            try {
                const data = await getDiskInfo();
                setDiskData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
                console.error('Fehler beim Laden der Festplatten-Informationen:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiskInfo();
        
        // Aktualisierung alle 5 Sekunden
        const interval = setInterval(fetchDiskInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardHeader title="Festplatteninformationen" />
                    <CardContent>
                        <Box display="flex" justifyContent="center" p={2}>
                            <LinearProgress sx={{ width: '100%' }} />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Card elevation={3} sx={{ borderRadius: 3}}>
                    <CardHeader title="Festplatteninformationen" />
                    <CardContent>
                        <Alert severity="error">{error}</Alert>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Card elevation={3} sx={{ borderRadius: 3,  minHeight: 360 }}>
                <CardHeader title="Festplatteninformationen" />
                <CardContent>
                    <Grid container spacing={2}>
                        {diskData.map((disk, index) => (
                            <Grid size={{ xs: 12, md: 6 }} key={index}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {disk.Mounted} ({disk.Filesystem})
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
                                                value={parseInt(disk.Use)}
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
                                        Verfügbar: {disk.Avail} ({disk.Size} total, {disk.Used} belegt)
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};
export default  DiskInfo;