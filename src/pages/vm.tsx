import { useState, useEffect, JSX } from 'react';
import { Link } from 'react-router-dom';

import {
    Box, Card, CardContent, CardHeader, Typography,
    Chip, IconButton, CardActions, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Checkbox, FormControlLabel, Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';

import { CreateForm } from '@components/vm/CreateForm';
import type { VmFormData } from '@interfaces/vm.types';
import { VmStatus, VmStatusResponse } from '@interfaces/vm.types';
import {
    getVirtualMachineStatus, startVirtualMachine, stopVirtualMachine,
    rebootVirtualMachine, deleteVirtualMachine
} from '@services/virtualization';

export default function VmContent(): JSX.Element {
    const [vms, setVms] = useState<VmStatusResponse>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [vmToDelete, setVmToDelete] = useState<string>('');
    const [confirmationName, setConfirmationName] = useState<string>('');
    const [deleteVhd, setDeleteVhd] = useState<boolean>(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = await getVirtualMachineStatus();
                setVms(status);
            } catch (err: unknown) {
                let errorMessage = 'Ein unbekannter Fehler ist aufgetreten';

                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (
                    typeof err === 'object' &&
                    err !== null &&
                    'message' in err &&
                    typeof err.message === 'string'
                ) {
                    errorMessage = err.message;
                }

                setError(errorMessage);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleVmAction = async (action: 'start' | 'stop' | 'reboot', vmName: string): Promise<void> => {
        setLoading(vmName);
        try {
            switch (action) {
                case 'start':
                    await startVirtualMachine(vmName);
                    break;
                case 'stop':
                    await stopVirtualMachine(vmName);
                    break;
                case 'reboot':
                    await rebootVirtualMachine(vmName);
                    break;
            }

            // Status neu laden nach erfolgreicher Aktion
            const status = await getVirtualMachineStatus();
            setVms(status);
        } catch (err) {
            let errorMessage = 'Fehler bei der VM-Aktion';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading('');
        }
    };

    const handleDeleteClick = (vmName: string): void => {
        setVmToDelete(vmName);
        setDeleteDialogOpen(true);
        setConfirmationName('');
        setDeleteVhd(false);
    };

    const handleDeleteConfirm = async (): Promise<void> => {
        if (confirmationName === vmToDelete) {
            setLoading(vmToDelete);
            try {
                await deleteVirtualMachine(vmToDelete, deleteVhd);

                // Status neu laden nach erfolgreicher Löschung
                const status = await getVirtualMachineStatus();
                setVms(status);

                // Dialog schließen und Status zurücksetzen
                setDeleteDialogOpen(false);
                setVmToDelete('');
                setConfirmationName('');
                setDeleteVhd(false);
            } catch (err) {
                let errorMessage = 'Fehler beim Löschen der VM';
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            } finally {
                setLoading('');
            }
        }
    };

    const handleCreateVm = async (formData: VmFormData): Promise<void> => {
        setLoading('new-vm');
        setTimeout(() => {
            setLoading('');
            console.log('Neue VM erstellen:', formData);
        }, 1000);
    };

    const getStatusColor = (state: string): "success" | "error" => {
        return state === '1' ? 'success' : 'error';
    };

    const getStatusText = (state: string): "Aktiv" | "Gestoppt" => {
        return state === '1' ? 'Aktiv' : 'Gestoppt';
    };

    const formatMemory = (memoryKB: string): string => {
        return (parseInt(memoryKB) / 1024 / 1024).toFixed(1) + ' GB';
    };

    const isVmActive = (state: string): boolean => {
        return state !== '5'; // VM ist aktiv wenn sie nicht heruntergefahren ist (state 5)
    };

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} >
                        <CreateForm onSubmit={handleCreateVm} />
                    </Grid>
                    {Object.entries(vms).map(([vmName, vmData]: [string, VmStatus]) => {
                        const isActive = isVmActive(vmData['state.state']);
                        return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vmName}>
                            <Card elevation={3}>
                                <CardHeader
                                    title={
                                        isActive ? (
                                            <Link
                                                to={`/vm/${vmName}`}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    display: 'block',
                                                    fontSize: '1.25rem',
                                                    fontWeight: 500,
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {vmName}
                                            </Link>
                                        ) : (
                                            <Tooltip title="VM ist nicht aktiv" placement="top">
                                                <Typography 
                                                    sx={{ 
                                                        opacity: 0.6,
                                                        cursor: 'not-allowed',
                                                        fontSize: '1.25rem',
                                                        fontWeight: 500,
                                                        lineHeight: 1.6,
                                                        display: 'block'
                                                    }}
                                                >
                                                    {vmName}
                                                </Typography>
                                            </Tooltip>
                                        )
                                    }
                                    action={
                                        <Chip
                                            label={getStatusText(vmData['state.state'])}
                                            color={getStatusColor(vmData['state.state'])}
                                            size="small"
                                        />
                                    }
                                    sx={{ 
                                        '& .MuiCardHeader-content': {
                                            minHeight: '40px', // Einheitliche Höhe für den Header
                                            display: 'flex',
                                            alignItems: 'center'
                                        }
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        RAM: {formatMemory(vmData['balloon.current'])}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        vCPUs: {vmData['vcpu.current']}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            disabled={vmData['state.state'] === '1' || loading === vmName}
                                            onClick={() => handleVmAction('start', vmName)}
                                        >
                                            <PlayArrowIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            disabled={vmData['state.state'] === '5' || loading === vmName}
                                            onClick={() => handleVmAction('stop', vmName)}
                                        >
                                            <StopIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            disabled={vmData['state.state'] === '5' || loading === vmName}
                                            onClick={() => handleVmAction('reboot', vmName)}
                                        >
                                            <RestartAltIcon />
                                        </IconButton>
                                        {loading === vmName && <CircularProgress size={20} />}
                                    </Box>
                                    <Box sx={{ marginLeft: 'auto' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteClick(vmName)}
                                            disabled={loading === vmName}
                                        >
                                            <DeleteIcon sx={{ color: 'error.main' }} />
                                        </IconButton>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                        );
                    })}
                </Grid>
            )}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>VM löschen</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Um die VM "{vmToDelete}" zu löschen, geben Sie bitte den Namen der VM ein:
                    </Typography>
                    <TextField
                        fullWidth
                        value={confirmationName}
                        onChange={(e) => setConfirmationName(e.target.value)}
                        error={confirmationName !== '' && confirmationName !== vmToDelete}
                        helperText={confirmationName !== '' && confirmationName !== vmToDelete ?
                            'Name stimmt nicht überein' : ''}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={deleteVhd}
                                onChange={(e) => setDeleteVhd(e.target.checked)}
                                color="error"
                            />
                        }
                        label={
                            <Typography color="error">
                                Auch die zugehörigen VHD-Dateien (*.cow) löschen
                            </Typography>
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        disabled={confirmationName !== vmToDelete}
                        color="error"
                        variant="contained"
                    >
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}