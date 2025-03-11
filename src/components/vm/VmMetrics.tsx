import { useState, useEffect } from 'react';
import { getVmDetails } from '../../services/virtualization';
import type { VmStats } from '../../types/vm.types';
import { Card, CardContent, CardHeader } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import CpuLoad from './CpuLoad';
import RamLoad from './RamLoad';

interface VmMetricsProps {
    vmName: string;
    initialStats: VmStats;
}

export default function VmMetrics({ vmName, initialStats }: VmMetricsProps) {
    const [metrics, setMetrics] = useState<VmStats>(initialStats);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const details = await getVmDetails(vmName);
                setMetrics(details);
            } catch (err) {
                console.error('Metrics update failed:', err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [vmName]);

    return (
        <Grid container spacing={2}>


            <Grid size={{ xs: 6 }}>
                <Card elevation={3}>
                    <CardHeader
                        title="RAM"
                        avatar={<DisplaySettingsIcon color="primary" />}
                    />
                    <CardContent>
                        <RamLoad stats={metrics} />
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 6 }}>
                <Card elevation={3}>
                    <CardHeader
                        title="CPU"
                        avatar={<DisplaySettingsIcon color="primary" />}
                    />
                    <CardContent>
                        <CpuLoad stats={metrics}/>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}