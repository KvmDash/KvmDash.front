import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Login from './pages/login';
import Home from './pages/home';
import Vm from './pages/vm';
import VmDetailsPage from './pages/vmDetails';
import Settings from './pages/settings';
import IsoImages from './pages/iso-image';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/vm',
                element: <Vm />
            },
            {
                path: '/vm/:vmName',
                element: <VmDetailsPage />
            },
            {
                path: '/iso-images',
                element: <IsoImages />
            },
            {
                path: '/settings',
                element: <Settings />
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '*',
        element: <Navigate to="/" />
    }
]);