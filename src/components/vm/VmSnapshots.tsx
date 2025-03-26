import { useState, useEffect } from 'react';
import { getVmSnapshots } from '../../services/virtualization';
import {
    Card,
    CardContent,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface VmSnapshotsProps {
    vmName: string;
}

export default function VmSnapshots({ vmName }: VmSnapshotsProps) {
    const [snapshots, setSnapshots] = useState<Array<{
        name: string;
        creationTime: string;
        state: string;
        description: string;
        parent: string | null;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSnapshots = async () => {
            try {
                setLoading(true);
                const response = await getVmSnapshots(vmName);
                setSnapshots(response.snapshots);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Fehler beim Laden der Snapshots');
            } finally {
                setLoading(false);
            }
        };

        fetchSnapshots();
    }, [vmName]);

    const formatDate = (timestamp: string) => {
        return new Date(parseInt(timestamp) * 1000).toLocaleString('de-DE');
    };

    if (loading) return <div>Lade Snapshots...</div>;
    if (error) return <div>Fehler: {error}</div>;

    return (
        <Card elevation={3}>
            <CardHeader
                title="VM Snapshots"
                avatar={<PhotoCameraIcon color="primary" />}
            />
            <CardContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Erstellt am</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Beschreibung</TableCell>
                                <TableCell>Parent</TableCell>
                                <TableCell>Aktionen</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {snapshots.map((snapshot) => (
                                <TableRow key={snapshot.name}>
                                    <TableCell>{snapshot.name}</TableCell>
                                    <TableCell>{formatDate(snapshot.creationTime)}</TableCell>
                                    <TableCell>{snapshot.state}</TableCell>
                                    <TableCell>{snapshot.description || '-'}</TableCell>
                                    <TableCell>{snapshot.parent || '-'}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Wiederherstellen">
                                            <IconButton>
                                                <RestoreIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Löschen">
                                            <IconButton color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}