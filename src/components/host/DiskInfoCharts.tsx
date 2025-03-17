import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DiskData } from '@interfaces/host.types';
import { getDiskInfo } from '@services/host';

export const DiskInfo = () => {
    const { t } = useTranslation();
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
                setError(err instanceof Error ? err.message : t('host.unknownError'));
                console.error(t('host.diskInfoLoadError'), err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiskInfo();
        
        // Aktualisierung alle 5 Sekunden
        const interval = setInterval(fetchDiskInfo, 5000);
        return () => clearInterval(interval);
    }, [t]);

    if (loading) {
        return (
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardHeader title={t('host.disk.information')} />
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
                    <CardHeader title={t('host.disk.information')} />
                    <CardContent>
                        <Alert severity="error">{error}</Alert>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Card elevation={3} sx={{ borderRadius: 3, minHeight: 360 }}>
                <CardHeader title={t('host.disk.information')} />
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
                                    
                                    {/* Verbesserte Festplatten-Visualisierung mit Fortschrittsbalken */}
                                    <Box sx={{ width: '100%', mt: 2 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            mb: 0.5
                                        }}>
                                            <Typography variant="body2" fontWeight="medium">
                                                {t('host.disk.usage')}: {disk.Use}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {disk.Used} / {disk.Size}
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={parseInt(disk.Use)}
                                            sx={{
                                                height: 15,
                                                borderRadius: 2,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: (theme) => {
                                                        const usedPercent = parseInt(disk.Use);
                                                        if (usedPercent < 70) return theme.palette.success.main;
                                                        if (usedPercent < 90) return theme.palette.warning.main;
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
                                                {t('host.disk.used')}
                                            </Typography>
                                            <Typography variant="caption">
                                                100%
                                            </Typography>
                                        </Box>
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
                                            <span>{t('host.disk.available')}:</span>
                                            <span style={{ fontWeight: 'bold' }}>{disk.Avail}</span>
                                        </Typography>
                                    </Box>
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