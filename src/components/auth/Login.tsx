import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/auth/auth'
import { LoginResponse } from '../../types/auth'
import { TokenStorage } from '../../services/tokenStorage'
import { 
    Card, 
    CardContent, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Alert, 
    Container,
    Grid
} from '@mui/material'
import logo from '../../assets/kvmdash.svg'

export const Login = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            const response: LoginResponse = await login(email, password)
            if (response.token) {
                // Token speichern
                TokenStorage.setToken(response.token);
                navigate('/')
            } else {
                setError(t('auth.loginFailed'))
            }
        } catch (error) {
            console.error('Login failed:', error)
            setError(t('auth.loginFailed'))
        }
    }

    return (
        <Container maxWidth="md" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh' 
        }}>
            <Card elevation={6} sx={{ width: '100%', maxWidth: 800 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRight: { xs: 'none', md: '1px solid #eee' },
                            p: 2
                        }}>
                            <img src={logo} alt="KVM Dash Logo" style={{ 
                                maxWidth: '100%', 
                                height: 'auto',
                                maxHeight: '200px' 
                            }} />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
                                    {t('auth.login')}
                                </Typography>
                                
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                
                                <form onSubmit={handleSubmit}>
                                    <Box sx={{ mb: 2 }}>
                                        <TextField
                                            label={t('auth.email')}
                                            variant="outlined"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            fullWidth
                                        />
                                    </Box>
                                    <Box sx={{ mb: 3 }}>
                                        <TextField
                                            label={t('auth.password')}
                                            variant="outlined"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            fullWidth
                                        />
                                    </Box>
                                    <Box>
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            color="primary" 
                                            fullWidth
                                            size="large"
                                        >
                                            {t('auth.signIn')}
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    )
}