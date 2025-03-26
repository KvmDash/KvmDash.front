import { useState, useEffect } from 'react';
import { getVmSnapshots, deleteVmSnapshot } from '../../services/virtualization';
import {
    Card, CardContent, CardHeader, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions,
    Button, Alert, Snackbar
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
    const [deleteDialog, setDeleteDialog] = useState<{open: boolean, snapshot: string | null}>({
        open: false,
        snapshot: null
    });
    const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
        open: false,
        message: '',
        severity: 'success'
    });

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

    const handleDeleteClick = (snapshotName: string) => {
        setDeleteDialog({
            open: true,
            snapshot: snapshotName
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.snapshot) return;

        try {
            await deleteVmSnapshot(vmName, deleteDialog.snapshot);
            setSnackbar({
                open: true,
                message: 'Snapshot erfolgreich gelöscht',
                severity: 'success'
            });
            // Snapshot-Liste neu laden
            const response = await getVmSnapshots(vmName);
            setSnapshots(response.snapshots);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Fehler beim Löschen des Snapshots',
                severity: 'error'
            });
        } finally {
            setDeleteDialog({ open: false, snapshot: null });
        }
    };

    if (loading) return <div>Lade Snapshots...</div>;
    if (error) return <div>Fehler: {error}</div>;

    return (
        <>
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
                                                <IconButton 
                                                    color="error"
                                                    onClick={() => handleDeleteClick(snapshot.name)}
                                                >
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, snapshot: null })}
            >
                <DialogTitle>Snapshot löschen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Möchten Sie den Snapshot "{deleteDialog.snapshot}" wirklich löschen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, snapshot: null })}>
                        Abbrechen
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Status Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert 
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}