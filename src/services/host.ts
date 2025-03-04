import { SystemInfo, CpuData, MemData, DiskData } from '@interfaces/host.types';
import { handleApiError } from '@services/auth/handleApiError';


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
            throw {
                status: response.status,
                statusText: response.statusText
            };
        }

        return response.json();
    } catch (error) {
        return handleApiError(error);
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
            throw {
                status: response.status,
                statusText: response.statusText
            };
        }

        return response.json();
    } catch (error) {
        return handleApiError(error);
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
            throw {
                status: response.status,
                statusText: response.statusText
            };
        }

        return response.json();
    } catch (error) {
        return handleApiError(error);
    }
};



/**
 * Festplatten-Informationen vom Backend abrufen
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns Array von Festplatten-Informationen
 */
export const getDiskInfo = async (): Promise<DiskData[]> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }

    try {
        const response = await fetch('/api/host/disk', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText
            };
        }

        return response.json();
    } catch (error) {
        return handleApiError(error);
    }
};