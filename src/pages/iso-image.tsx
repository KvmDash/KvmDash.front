import { FC, ReactElement, useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Button,
    Alert,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { uploadIso, getIsoStatus, getIsoImages } from '@services/qemu';
import { IsoFile } from '@interfaces/qemu.types';

const IsoImages: FC = (): ReactElement => {
    const [isoUrl, setIsoUrl] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [downloadProgress, setDownloadProgress] = useState<boolean>(false);
    const [isoFiles, setIsoFiles] = useState<IsoFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; iso: IsoFile | null }>({
        open: false,
        iso: null
    });

    // Status-Polling
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (downloadProgress) {
            intervalId = setInterval(async () => {
                try {
                    const response = await getIsoStatus();
                    if (response.status === 'success' && response.data.length > 0) {
                        setUploadStatus(response.data[0].message || 'Download läuft...');
                    } else {
                        setDownloadProgress(false);
                        setIsUploading(false);
                        setUploadStatus('Download abgeschlossen');
                    }
                } catch (error) {
                    console.error('Status check failed:', error);
                    setError('Fehler beim Prüfen des Download-Status');
                }
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [downloadProgress]);


    // Laden der ISO-Images
    useEffect(() => {
        const loadIsoImages = async () => {
            setIsLoading(true);
            try {
                const images = await getIsoImages();
                setIsoFiles(images);
            } catch (error) {
                console.error('Failed to load ISO images:', error);
                setError('Fehler beim Laden der Boot Images');
            } finally {
                setIsLoading(false);
            }
        };

        loadIsoImages();
    }, []);

    // Hilfsfunktion für Dateigrößen
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    
    // Dialog-Handler hinzufügen
    const handleDeleteClick = (iso: IsoFile) => {
        setDeleteDialog({ open: true, iso });
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, iso: null });
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.iso) {
            console.log('Lösche ISO:', deleteDialog.iso.name);
            // TODO: Implementiere deleteIso Funktion
        }
        setDeleteDialog({ open: false, iso: null });
    };


    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');

        try {
            setIsUploading(true);
            setDownloadProgress(false);
            setUploadStatus('Download wird gestartet...');

            const response = await uploadIso(isoUrl);

            if (response.status === 'success') {
                setUploadStatus('ISO-Download gestartet');
                setDownloadProgress(true);
            } else {
                throw new Error(response.message || 'Download fehlgeschlagen');
            }
        } catch (err) {
            console.error('Form submission error:', err);
            setError(err instanceof Error ? err.message : 'Fehler beim Senden der Anfrage');
            setDownloadProgress(false);
            setIsUploading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 4, display: 'grid', gap: 2 }}>
            <Card>
                <CardHeader title="Boot Image hochladen" />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                value={isoUrl}
                                onChange={(e) => setIsoUrl(e.target.value)}
                                placeholder="https://example.com/image.iso"
                                label="Boot Image URL"
                                error={!!error}
                                helperText={error || 'Bitte geben Sie eine gültige ISO-URL ein'}
                                fullWidth
                                disabled={isUploading || downloadProgress}
                            />
                            {downloadProgress && (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {uploadStatus}
                                    </Typography>
                                </Box>
                            )}
                            {error && (
                                <Alert severity="error">{error}</Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isUploading || downloadProgress}
                            >
                                {isUploading ? 'Lädt...' : 'ISO-Image hochladen'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Verfügbare Boot Images" />
                <CardContent>
                    {isLoading ? (
                        <LinearProgress />
                    ) : isoFiles.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Größe</TableCell>
                                        <TableCell>Pfad</TableCell>
                                        <TableCell align="right">Aktionen</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isoFiles.map((iso) => (
                                        <TableRow key={iso.path}>
                                            <TableCell>{iso.name}</TableCell>
                                            <TableCell>{formatFileSize(iso.size)}</TableCell>
                                            <TableCell>{iso.path}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={() => {
                                                        console.log('Delete clicked for:', iso.name);
                                                        handleDeleteClick(iso); 
                                                    }}
                                                    sx={{
                                                        color: 'error.main',  
                                                        '&:hover': {
                                                            color: 'error.dark'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body1">
                            Noch keine Boot Images verfügbar
                        </Typography>
                    )}
                </CardContent>
            </Card>
            <Dialog
                open={deleteDialog.open}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>ISO-Image löschen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Möchten Sie wirklich das ISO-Image "{deleteDialog.iso?.name}" löschen?
                        Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>
                        Abbrechen
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm}
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

export default IsoImages;