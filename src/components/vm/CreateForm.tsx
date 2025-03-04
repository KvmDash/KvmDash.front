import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    TextField,
    Button,
    MenuItem,
    Box,
    Autocomplete
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import Grid from '@mui/material/Grid2';
import { VmFormData } from '@interfaces/vm.types';
import { NetworkOption, IsoFile } from '@interfaces/qemu.types';
import { getNetworks, getOsVariants, getIsoImages, DEFAULT_OS_VARIANT } from '@/services/qemu';



// initialFormData
const initialFormData: VmFormData = {
    name: '',
    memory: 2048,
    vcpus: 2,
    disk_size: 20,
    iso_image: '',
    network_bridge: '',
    os_variant: DEFAULT_OS_VARIANT
};


interface CreateVmFormProps {
    onSubmit: (data: VmFormData) => void;
}



export const CreateForm: React.FC<CreateVmFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<VmFormData>(initialFormData);
    const [networkOptions, setNetworkOptions] = useState<NetworkOption[]>([]);
    const [osVariants, setOsVariants] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isoFiles, setIsoFiles] = useState<IsoFile[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [networks, variants, isos] = await Promise.all([
                    getNetworks(),
                    getOsVariants(),
                    getIsoImages()
                ]);

                setNetworkOptions(networks);
                setOsVariants(variants);
                setIsoFiles(isos);

                // Standardwerte setzen
                setFormData(prev => ({
                    ...prev,
                    os_variant: variants[0],
                    iso_image: isos[0]?.path || '' // Erste ISO wenn verfügbar
                }));
            } catch (error) {
                console.error('Fehler beim Laden der Daten:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card elevation={3}>
            <CardHeader
                title="Neue VM erstellen"
                avatar={<ComputerIcon color="primary" />}
                titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="VM Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="RAM (MB)"
                                name="memory"
                                type="number"
                                value={formData.memory}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 512, step: 512 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="CPUs"
                                name="vcpus"
                                type="number"
                                value={formData.vcpus}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 1, max: 16 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Festplattengröße (GB)"
                                name="disk_size"
                                type="number"
                                value={formData.disk_size}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 5 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                select
                                label="Netzwerk"
                                name="network_bridge"
                                value={formData.network_bridge}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <MenuItem disabled>Lade Netzwerke...</MenuItem>
                                ) : (
                                    networkOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                            disabled={!option.active}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                select
                                label="ISO Image"
                                name="iso_image"
                                value={formData.iso_image}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <MenuItem disabled>Lade ISO-Dateien...</MenuItem>
                                ) : (
                                    isoFiles.map((iso) => (
                                        <MenuItem key={iso.path} value={iso.path}>
                                            {iso.name} ({Math.round(iso.size / 1024 / 1024)}MB)
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                fullWidth
                                options={osVariants}
                                value={formData.os_variant}
                                onChange={(event, newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        os_variant: newValue || ''
                                    }));
                                }}
                                loading={isLoading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Betriebssystem"
                                        required
                                        error={isLoading}
                                        helperText={isLoading ? 'Lade Betriebssysteme...' : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                VM erstellen
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CreateForm;