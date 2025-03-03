import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Box, Card, CardContent, CardHeader,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { SpiceViewer } from '../components/vm/SpiceViewer';
import type { VmDetails } from '../types/vm.types';

// Dummy-Daten für die Entwicklung
const dummyVmDetails: VmDetails = {
    name: "test-vm",
    spice: {
        port: "5900",     // Basis SPICE-Port
        type: "spice",
        listen: "192.168.0.200"
    },
 };

export default function VmDetailsPage() {
    const { vmName } = useParams<{ vmName: string }>();
    const [vmDetails, setVmDetails] = useState<VmDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuliere API-Aufruf
        const timer = setTimeout(() => {
            setVmDetails(dummyVmDetails);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [vmName]);

    if (loading) return <Typography>Lade VM Details...</Typography>;
    if (!vmDetails) return <Typography>Keine Details verfügbar</Typography>;

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="SPICE Remote Konsole"
                            avatar={<DisplaySettingsIcon color="primary" />}
                        />
                        <CardContent>
                            <SpiceViewer
                                host="192.168.0.200"
                                port={parseInt(vmDetails.spice.port) + 1000}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}