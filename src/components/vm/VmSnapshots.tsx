import { useState, useEffect } from 'react';
import { getVmSnapshots, deleteVmSnapshot, createVmSnapshot } from '../../services/virtualization';
import {
    Card, CardContent, CardHeader, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions,
    Button, Alert, Snackbar, TextField
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';

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
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean,
        snapshot: string | null,
        hasChildren: boolean
    }>({
        open: false,
        snapshot: null,
        hasChildren: false
    });
    const [createDialog, setCreateDialog] = useState<{
        open: boolean;
        name: string;
        description: string;
    }>({
        open: false,
        name: '',
        description: ''
    });
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
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
        // Prüfen ob der Snapshot Children hat
        const hasChildren = snapshots.some(s => s.parent === snapshotName);

        setDeleteDialog({
            open: true,
            snapshot: snapshotName,
            hasChildren
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
            setDeleteDialog({ open: false, snapshot: null, hasChildren: false });
        }
    };

    const handleCreateClick = () => {
        setCreateDialog({
            open: true,
            name: '',
            description: ''
        });
    };

    const handleCreateConfirm = async () => {
        try {
            await createVmSnapshot(vmName, {
                name: createDialog.name,
                description: createDialog.description
            });
            setSnackbar({
                open: true,
                message: 'Snapshot erfolgreich erstellt',
                severity: 'success'
            });
            // Snapshot-Liste neu laden
            const response = await getVmSnapshots(vmName);
            setSnapshots(response.snapshots);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Fehler beim Erstellen des Snapshots',
                severity: 'error'
            });
        } finally {
            setCreateDialog(prev => ({ ...prev, open: false }));
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
                    action={
                        <Tooltip title="Neuen Snapshot erstellen">
                            <IconButton onClick={handleCreateClick} color="primary">
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    }
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

            {/* Create Snapshot Dialog */}
            <Dialog
                open={createDialog.open}
                onClose={() => setCreateDialog(prev => ({ ...prev, open: false }))}
            >
                <DialogTitle>Neuen Snapshot erstellen</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={createDialog.name}
                        onChange={(e) => setCreateDialog(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label="Beschreibung (optional)"
                        fullWidth
                        multiline
                        rows={2}
                        value={createDialog.description}
                        onChange={(e) => setCreateDialog(prev => ({ ...prev, description: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialog(prev => ({ ...prev, open: false }))}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleCreateConfirm}
                        color="primary"
                        variant="contained"
                        disabled={!createDialog.name}
                    >
                        Erstellen
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, snapshot: null, hasChildren: false })}
            >
                <DialogTitle>Snapshot löschen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Möchten Sie den Snapshot "{deleteDialog.snapshot}" wirklich löschen?
                        {deleteDialog.hasChildren && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                Achtung: Dieser Snapshot hat abhängige Snapshots, die ebenfalls gelöscht werden!
                            </Alert>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, snapshot: null, hasChildren: false })}>
                        Abbrechen
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        {deleteDialog.hasChildren ? 'Alle löschen' : 'Löschen'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Status Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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