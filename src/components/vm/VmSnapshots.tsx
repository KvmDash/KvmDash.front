import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getVmSnapshots, deleteVmSnapshot, createVmSnapshot, revertVmSnapshot } from '../../services/virtualization';
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

// Component props definition
interface VmSnapshotsProps {
    vmName: string;
}

export default function VmSnapshots({ vmName }: VmSnapshotsProps) {
    const { t } = useTranslation();
    
    // State for storing snapshot list
    const [snapshots, setSnapshots] = useState<Array<{
        name: string;
        creationTime: string;
        state: string;
        description: string;
        parent: string | null;
    }>>([]);
    
    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Dialog states for different operations
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
    
    const [revertDialog, setRevertDialog] = useState<{
        open: boolean;
        snapshot: string | null;
    }>({
        open: false,
        snapshot: null
    });
    
    // Snackbar for operation feedback
    const [snackbar, setSnackbar] = useState<{
        open: boolean,
        message: string,
        severity: 'success' | 'error'
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch snapshots on component mount or when VM name changes
    useEffect(() => {
        const fetchSnapshots = async () => {
            try {
                setLoading(true);
                const response = await getVmSnapshots(vmName);
                setSnapshots(response.snapshots);
            } catch (err) {
                setError(err instanceof Error ? err.message : t('vm.snapshots.loadError'));
            } finally {
                setLoading(false);
            }
        };

        fetchSnapshots();
    }, [vmName, t]);

    // Helper function to format Unix timestamp to localized date string
    const formatDate = (timestamp: string) => {
        return new Date(parseInt(timestamp) * 1000).toLocaleString();
    };

    // Handler for snapshot delete button click
    const handleDeleteClick = (snapshotName: string) => {
        // Check if the snapshot has child snapshots
        const hasChildren = snapshots.some(s => s.parent === snapshotName);
        setDeleteDialog({
            open: true,
            snapshot: snapshotName,
            hasChildren
        });
    };

    // Handler for snapshot delete confirmation
    const handleDeleteConfirm = async () => {
        if (!deleteDialog.snapshot) return;

        try {
            await deleteVmSnapshot(vmName, deleteDialog.snapshot);
            setSnackbar({
                open: true,
                message: t('vm.snapshots.deleteSuccess'),
                severity: 'success'
            });
            // Refresh snapshot list after deletion
            const response = await getVmSnapshots(vmName);
            setSnapshots(response.snapshots);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : t('vm.snapshots.deleteError'),
                severity: 'error'
            });
        } finally {
            setDeleteDialog({ open: false, snapshot: null, hasChildren: false });
        }
    };

    // Handler for snapshot create button click
    const handleCreateClick = () => {
        setCreateDialog({
            open: true,
            name: '',
            description: ''
        });
    };

    // Handler for snapshot create confirmation
    const handleCreateConfirm = async () => {
        try {
            await createVmSnapshot(vmName, {
                name: createDialog.name,
                description: createDialog.description
            });
            setSnackbar({
                open: true,
                message: t('vm.snapshots.createSuccess'),
                severity: 'success'
            });
            // Refresh snapshot list after creation
            const response = await getVmSnapshots(vmName);
            setSnapshots(response.snapshots);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : t('vm.snapshots.createError'),
                severity: 'error'
            });
        } finally {
            setCreateDialog(prev => ({ ...prev, open: false }));
        }
    };

    // Handler for snapshot revert button click
    const handleRevertClick = (snapshotName: string) => {
        setRevertDialog({
            open: true,
            snapshot: snapshotName
        });
    };

    // Handler for snapshot revert confirmation
    const handleRevertConfirm = async () => {
        if (!revertDialog.snapshot) return;

        try {
            await revertVmSnapshot(vmName, revertDialog.snapshot);
            setSnackbar({
                open: true,
                message: t('vm.snapshots.revertSuccess'),
                severity: 'success'
            });
            // Refresh snapshot list after revert
            const response = await getVmSnapshots(vmName);
            setSnapshots(response.snapshots);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : t('vm.snapshots.revertError'),
                severity: 'error'
            });
        } finally {
            setRevertDialog({ open: false, snapshot: null });
        }
    };

    // Show loading state
    if (loading) return <div>{t('common.loading')}</div>;
    // Show error state if any
    if (error) return <div>{t('common.error')}: {error}</div>;

    return (
        <>
            {/* Main snapshot card */}
            <Card elevation={3}>
                <CardHeader
                    title={t('vm.snapshots.title')}
                    avatar={<PhotoCameraIcon color="primary" />}
                    action={
                        <Tooltip title={t('vm.snapshots.createNew')}>
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
                                    <TableCell>{t('vm.snapshots.name')}</TableCell>
                                    <TableCell>{t('vm.snapshots.createdAt')}</TableCell>
                                    <TableCell>{t('vm.snapshots.status')}</TableCell>
                                    <TableCell>{t('vm.snapshots.description')}</TableCell>
                                    <TableCell>{t('vm.snapshots.parent')}</TableCell>
                                    <TableCell>{t('vm.snapshots.actions')}</TableCell>
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
                                            {/* Revert snapshot button */}
                                            <Tooltip title={t('vm.snapshots.revert')}>
                                                <IconButton onClick={() => handleRevertClick(snapshot.name)}>
                                                    <RestoreIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {/* Delete snapshot button */}
                                            <Tooltip title={t('common.delete')}>
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
                <DialogTitle>{t('vm.snapshots.createNew')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('vm.snapshots.name')}
                        fullWidth
                        value={createDialog.name}
                        onChange={(e) => setCreateDialog(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label={t('vm.snapshots.descriptionOptional')}
                        fullWidth
                        multiline
                        rows={2}
                        value={createDialog.description}
                        onChange={(e) => setCreateDialog(prev => ({ ...prev, description: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialog(prev => ({ ...prev, open: false }))}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleCreateConfirm}
                        color="primary"
                        variant="contained"
                        disabled={!createDialog.name}
                    >
                        {t('vm.snapshots.create')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, snapshot: null, hasChildren: false })}
            >
                <DialogTitle>{t('vm.snapshots.deleteTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('vm.snapshots.deleteConfirm', { snapshot: deleteDialog.snapshot })}
                        {deleteDialog.hasChildren && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                {t('vm.snapshots.deleteChildrenWarning')}
                            </Alert>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, snapshot: null, hasChildren: false })}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        {deleteDialog.hasChildren ? t('vm.snapshots.deleteAll') : t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Revert Confirmation Dialog */}
            <Dialog
                open={revertDialog.open}
                onClose={() => setRevertDialog({ open: false, snapshot: null })}
            >
                <DialogTitle>{t('vm.snapshots.revertTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('vm.snapshots.revertConfirm', { snapshot: revertDialog.snapshot })}
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            {t('vm.snapshots.revertWarning')}
                        </Alert>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRevertDialog({ open: false, snapshot: null })}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={handleRevertConfirm} color="primary" variant="contained">
                        {t('vm.snapshots.revert')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Status Snackbar for user feedback */}
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