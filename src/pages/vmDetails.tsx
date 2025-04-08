import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getVmDetails, getSpiceConnection } from '../services/virtualization';
import { SpiceViewer, SpiceViewerRef } from '../components/vm/SpiceViewer';
import { sendCtrlAltDel } from '@assets/spice-html5/src/inputs';
import type { VmStats } from '../types/vm.types';

import { Box, Card, CardContent, CardHeader, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VmMetrics from '../components/vm/VmMetrics';  
import VmSnapshots from '../components/vm/VmSnapshots';  

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
    const spiceViewerRef = useRef<SpiceViewerRef>(null);

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
                            action={
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        const conn = spiceViewerRef.current?.spiceConnection;
                                        console.log('Button clicked', {
                                            ref: spiceViewerRef.current,
                                            connection: conn,
                                            hasInputs: !!conn?.inputs
                                        });
                                        if (conn) {
                                            sendCtrlAltDel(conn);
                                        } else {
                                            console.warn('Keine SPICE Verbindung verfügbar');
                                        }
                                    }}
                                    sx={{ 
                                        color: 'action.active',
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                >
                                    <LockOpenIcon />
                                </IconButton>
                            }
                        />
                        <CardContent sx={{ p: 1 }}>
                            <SpiceViewer
                                ref={spiceViewerRef}
                                host={spiceConnection.host}
                                port={spiceConnection.wsPort}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <VmSnapshots vmName={vmName!} />
                </Grid>

            </Grid>
        </Box>
    );
}