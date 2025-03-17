import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Box, 
    Typography, 
    Card, 
    CardHeader, 
    CardContent, 
    FormControl, 
    FormLabel, 
    RadioGroup, 
    FormControlLabel, 
    Radio,
    Divider
} from '@mui/material';

export default function Settings() {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'de');

    // Speichern der Spracheinstellung im localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
            i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLang = event.target.value;
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('settings.title')}
            </Typography>

            <Card sx={{ mb: 3, maxWidth: 600 }}>
                <CardHeader title={t('settings.language.title')} />
                <Divider />
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{t('settings.language.select')}</FormLabel>
                        <RadioGroup
                            row
                            aria-label="language"
                            name="language"
                            value={language}
                            onChange={handleLanguageChange}
                        >
                            <FormControlLabel 
                                value="de" 
                                control={<Radio />} 
                                label={t('settings.language.german')} 
                            />
                            <FormControlLabel 
                                value="en" 
                                control={<Radio />} 
                                label={t('settings.language.english')} 
                            />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        </Box>
    );
}