import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Card,
    CardContent,
    CardHeader,
    TextField,
    Button,
    MenuItem,
    Box,
    Autocomplete,
    CircularProgress,
    Box as MuiBox
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import Grid from '@mui/material/Grid2';
import { VmFormData } from '@interfaces/vm.types';
import { NetworkOption, IsoFile } from '@interfaces/qemu.types';
import { getNetworks, getOsVariants, getIsoImages, DEFAULT_OS_VARIANT } from '@/services/qemu';
import { createVirtualMachine } from '@/services/virtualization';

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
    const { t } = useTranslation();
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
                console.error(t('vm.create.loadError'), error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            const success = await createVirtualMachine(formData);
            if (success) {
                onSubmit(formData);
            }
        } catch (error) {
            console.error(t('vm.create.error'), error);
        }
    };

    return (
        <Card elevation={3}>
            <CardHeader
                title={t('vm.create.title')}
                avatar={<ComputerIcon color="primary" />}
                titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label={t('vm.create.name')}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={t('vm.create.ram')}
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
                                label={t('vm.create.cpus')}
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
                                label={t('vm.create.diskSize')}
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
                                label={t('vm.create.network')}
                                name="network_bridge"
                                value={formData.network_bridge}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <MenuItem disabled>{t('vm.create.loadingNetworks')}</MenuItem>
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
                                label={t('vm.create.isoImage')}
                                name="iso_image"
                                value={formData.iso_image}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: isLoading && (
                                        <MuiBox sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            position: 'absolute',
                                            left: 0
                                        }}>
                                            <CircularProgress size={20} />
                                        </MuiBox>
                                    )
                                }}
                            >
                                {isLoading ? (
                                    <MenuItem disabled>{t('vm.create.loadingIsos')}</MenuItem>
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
                                onChange={(_, newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        os_variant: newValue || ''
                                    }));
                                }}
                                loading={isLoading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('vm.create.osVariant')}
                                        required
                                        error={isLoading}
                                        helperText={isLoading ? t('vm.create.loadingOs') : ''}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoading && (
                                                        <MuiBox sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '100%',
                                                            position: 'absolute',
                                                            left: 0
                                                        }}>
                                                            <CircularProgress size={20} />
                                                        </MuiBox>
                                                    )}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            )
                                        }}
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
                                {t('vm.create.submit')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CreateForm;