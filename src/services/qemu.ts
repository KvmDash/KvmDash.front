import { NetworkOption } from '@interfaces/qemu.types';
import { handleApiError } from '@services/auth/handleApiError';
import { ApiError } from '@interfaces/api.types';

/**
 * Holt die Liste aller verfügbaren Netzwerke vom Backend
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns Array von Netzwerk-Optionen mit Name, Typ und Status
 */
export const getNetworks = async (): Promise<NetworkOption[]> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch('/api/qemu/networks', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText
            };
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        return handleApiError(error as ApiError);
    }
};