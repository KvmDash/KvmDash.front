import { SystemInfo } from '@interfaces/host.types';

export const getSystemInfo = async (): Promise<SystemInfo> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }

    try {
        const response = await fetch('/api/host/info', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('API Fehler:', {
                status: response.status,
                statusText: response.statusText
            });
            throw new Error(`Server antwortet mit Status ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Netzwerk oder Parse Fehler:', error);
        throw error instanceof Error 
            ? error 
            : new Error('Fehler beim Abrufen der Systeminformationen');
    }
};