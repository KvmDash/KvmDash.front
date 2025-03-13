import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getVmDetails, getSpiceConnection } from '../services/virtualization';
import { SpiceViewer } from '../components/vm/SpiceViewer';
import type { VmStats } from '../types/vm.types';

import { Box, Card, CardContent, CardHeader} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { BACKEND_HOST } from '../config';
import VmMetrics from '../components/vm/VmMetrics';  // Nur noch default import

export default function VmDetailsPage() {
    const { vmName } = useParams<{ vmName: string }>();
    const [vmDetails, setVmDetails] = useState<VmStats | null>(null);
    const [spiceConnection, setSpiceConnection] = useState<{
        spicePort: number;
        wsPort: number;
        host: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeSpiceConnection = async () => {
            if (!vmName) return;

            try {
                setLoading(true);
                const details = await getVmDetails(vmName);
                setVmDetails(details);
                const spiceInfo = await getSpiceConnection(vmName);
                setSpiceConnection(spiceInfo);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
            } finally {
                setLoading(false);
            }
        };

        initializeSpiceConnection();
    }, [vmName]);

    if (loading) return <div>Initialisiere SPICE Verbindung...</div>;
    if (error) return <div>Fehler: {error}</div>;
    if (!vmDetails || !spiceConnection) return <div>Keine Verbindung möglich</div>;

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <VmMetrics vmName={vmName!} initialStats={vmDetails} />
                </Grid>

                {/* SPICE Remote Konsole */}
                <Grid size={{ xs: 12 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="SPICE Remote Konsole"
                            avatar={<DisplaySettingsIcon color="primary" />}
                        />
                        <CardContent>
                            <SpiceViewer
                                host={BACKEND_HOST}
                                port={spiceConnection.wsPort}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}