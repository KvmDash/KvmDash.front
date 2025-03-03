import { Box, Card, CardHeader, Typography, CardContent, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { SystemInfo } from '@interfaces/host.types';
import { getSystemInfo } from '@services/host';

export const HostInfo = () => {
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const data = await getSystemInfo();
                setSystemInfo(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
                console.error('Fehler beim Laden der Systeminformationen:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSystemInfo();
        
        // Aktualisierung alle 30 Sekunden
        const interval = setInterval(fetchSystemInfo, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Systeminformationen" />
                <CardContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <Grid container spacing={2} alignItems="center">
                            {[
                                { label: "Hostname", value: systemInfo?.Hostname },
                                { label: "Betriebssystem", value: systemInfo?.OperatingSystemPrettyName },
                                { label: "Kernel", value: `${systemInfo?.KernelName} ${systemInfo?.KernelRelease}` },
                                { label: "Hardware", value: `${systemInfo?.HardwareVendor} ${systemInfo?.HardwareModel}` }
                            ].map(({ label, value }, index) => (
                                <Grid size={{xs: 12, md: 6}} key={index}>
                                    <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
                                    <Typography variant="body1">{value || 'N/A'}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default HostInfo;