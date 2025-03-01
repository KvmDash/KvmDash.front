import { Navigate } from 'react-router-dom'
import { TokenStorage } from '../../services/tokenStorage'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = TokenStorage.getToken()
    
    if (!token) {
        return <Navigate to="/login" />
    }
    
    return <>{children}</>
}