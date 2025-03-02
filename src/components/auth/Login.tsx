import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/auth'
import { LoginResponse } from '../../types/auth'
import { TokenStorage } from '../../services/tokenStorage'

export const Login = () => {
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
                setError('Login fehlgeschlagen')
            }
        } catch (error) {
            console.error('Login failed:', error)
            setError('Login fehlgeschlagen')
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}