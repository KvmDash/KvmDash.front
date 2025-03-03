import { Box, Card, CardHeader, Typography, CardContent, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { SystemInfo } from '@interfaces/host.types';

export const HostInfo = () => {
    // Dummy-Daten für die Entwicklung
    const dummyData: SystemInfo = {
        Hostname: "kvm-server-01",
        OperatingSystemPrettyName: "Ubuntu 22.04.3 LTS",
        KernelName: "Linux",
        KernelRelease: "6.5.0-generic",
        HardwareVendor: "Dell Inc.",
        HardwareModel: "PowerEdge R740"
    };

    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuliere API-Aufruf mit Timeout
        const timer = setTimeout(() => {
            setSystemInfo(dummyData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader 
                    title="Systeminformationen"
                />
                <CardContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
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
                                    <Typography variant="body1">{value}</Typography>
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