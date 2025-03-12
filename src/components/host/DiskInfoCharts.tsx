import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DiskData } from '@interfaces/host.types';
import { getDiskInfo } from '@services/host';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

    // Daten für recharts aufbereiten
    const prepareChartData = (disk: DiskData) => {
        const usedPercentage = parseInt(disk.Use);
        const freePercentage = 100 - usedPercentage;
        
        return [
            { name: 'Belegt', value: usedPercentage },
            { name: 'Frei', value: freePercentage }
        ];
    };
    
    const COLORS = ['#ff4444', '#00c853'];

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Card elevation={3} sx={{ borderRadius: 3,  minHeight: 360 }}>
                <CardHeader title="Festplatteninformationen" />
                <CardContent>
                    <Grid container spacing={2}>
                        {diskData.map((disk, index) => (
                            <Grid size={{ xs: 12, md: 6 }} key={index}>
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                color: 'primary.main',
                                                mr: 1
                                            }}
                                        >
                                            {disk.Mounted}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            ({disk.Filesystem})
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 180 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                                                <Pie
                                                    data={prepareChartData(disk)}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={60}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {prepareChartData(disk).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `${value}%`} />
                                                <Legend verticalAlign="bottom" height={36} />
                                                <text 
                                                    x="50%" 
                                                    y="40%" 
                                                    textAnchor="middle" 
                                                    dominantBaseline="middle"
                                                    style={{ fontSize: '14px', fontWeight: 'bold', fill: 'white' }}
                                                >
                                                    {disk.Use}
                                                </text>
                                                <text 
                                                    x="50%" 
                                                    y="40%" 
                                                    dy="18" 
                                                    textAnchor="middle" 
                                                    dominantBaseline="middle"
                                                    style={{ fontSize: '12px', fill: 'white' }}
                                                >
                                                    belegt
                                                </text>
                                            </PieChart>
                                        </ResponsiveContainer>
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
export default DiskInfo;