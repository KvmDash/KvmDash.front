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
    LinearProgress
} from '@mui/material';
import { uploadIso, getIsoStatus } from '../services/qemu';

const IsoImages: FC = (): ReactElement => {
    const [isoUrl, setIsoUrl] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [downloadProgress, setDownloadProgress] = useState<boolean>(false);

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
                    <Typography variant="body1">
                        Noch keine Boot Images verfügbar
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default IsoImages;