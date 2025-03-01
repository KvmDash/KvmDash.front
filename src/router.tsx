import { createBrowserRouter } from 'react-router-dom'
import { Login } from './components/auth/Login'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <div>Dashboard kommt später</div>
            </ProtectedRoute>
        )
    }
])