import { FC, ReactElement, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { uploadIso, getIsoStatus, getIsoImages, deleteIso } from '@services/qemu';
import { IsoFile } from '@interfaces/qemu.types';

const IsoImages: FC = (): ReactElement => {
    const { t } = useTranslation();
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
                        setUploadStatus(response.data[0].message || t('iso.downloadInProgress'));
                    } else {
                        setDownloadProgress(false);
                        setIsUploading(false);
                        setUploadStatus(t('iso.downloadComplete'));
                    }
                } catch (error) {
                    console.error(t('iso.statusCheckFailed'), error);
                    setError(t('iso.statusCheckError'));
                }
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [downloadProgress, t]);


    // Polling für ISO-Liste alle 15 Sekunden
    useEffect(() => {
        const loadIsoImages = async () => {
            try {
                const images = await getIsoImages();
                setIsoFiles(images);
            } catch (error) {
                console.error(t('iso.loadError'), error);
            }
        };

        // Initial laden
        loadIsoImages();

        // Polling alle 15 Sekunden
        const intervalId = setInterval(loadIsoImages, 15000);

        // Cleanup beim Unmount
        return () => clearInterval(intervalId);
    }, [t]);

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

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.iso) return;

        try {
            setIsLoading(true);
            await deleteIso(deleteDialog.iso.path);

            // Aktualisiere die Liste nach erfolgreichem Löschen
            const images = await getIsoImages();
            setIsoFiles(images);

            // Zeige Erfolgs-Nachricht
            setUploadStatus(t('iso.deleteSuccess'));
        } catch (error) {
            console.error(t('iso.deleteFailed'), error);
            setError(t('iso.deleteError'));
        } finally {
            setIsLoading(false);
            setDeleteDialog({ open: false, iso: null });
        }
    };


    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');

        try {
            setIsUploading(true);
            setDownloadProgress(false);
            setUploadStatus(t('iso.startingDownload'));

            const response = await uploadIso(isoUrl);

            if (response.status === 'success') {
                setUploadStatus(t('iso.downloadStarted'));
                setDownloadProgress(true);
            } else {
                throw new Error(response.message || t('iso.downloadFailed'));
            }
        } catch (err) {
            console.error(t('iso.formError'), err);
            setError(err instanceof Error ? err.message : t('iso.requestError'));
            setDownloadProgress(false);
            setIsUploading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 4, display: 'grid', gap: 4 }}>
            <Card>
                <CardHeader title={t('iso.uploadTitle')} />
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                value={isoUrl}
                                onChange={(e) => setIsoUrl(e.target.value)}
                                placeholder="https://example.com/image.iso"
                                label={t('iso.urlLabel')}
                                error={!!error}
                                helperText={error || t('iso.urlHelper')}
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
                                {isUploading ? t('iso.uploading') : t('iso.uploadButton')}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title={t('iso.availableImages')} />
                <CardContent>
                    {isLoading ? (
                        <LinearProgress />
                    ) : isoFiles.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('iso.name')}</TableCell>
                                        <TableCell>{t('iso.size')}</TableCell>
                                        <TableCell>{t('iso.path')}</TableCell>
                                        <TableCell align="right">{t('iso.actions')}</TableCell>
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
                                                    aria-label={t('common.delete')}
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
                            {t('iso.noImages')}
                        </Typography>
                    )}
                </CardContent>
            </Card>
            <Dialog
                open={deleteDialog.open}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>{t('iso.deleteTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('iso.deleteConfirm', { name: deleteDialog.iso?.name })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        {t('common.delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default IsoImages;