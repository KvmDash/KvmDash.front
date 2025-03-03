import { SystemInfo, CpuData, MemData } from '@interfaces/host.types';



/**
 * Holt die Systeminformationen vom Backend
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns Systeminformationen
 */
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


/**
 * CPU-Informationen vom Backend abrufen
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns Array von CPU-Informationen
 */
export const getCpuInfo = async (): Promise<CpuData[]> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }

    try {
        const response = await fetch('/api/host/cpu', {
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
            : new Error('Fehler beim Abrufen der CPU-Informationen');
    }
};


// ...existing imports and code...

/**
 * Speicher-Informationen vom Backend abrufen
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns Memory-Informationen
 */
export const getMemInfo = async (): Promise<MemData> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }

    try {
        const response = await fetch('/api/host/mem', {
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
            : new Error('Fehler beim Abrufen der Speicher-Informationen');
    }
};