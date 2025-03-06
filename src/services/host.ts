import { SystemInfo, CpuData, MemData, DiskData } from '@interfaces/host.types';
import { handleApiError } from '@services/auth/handleApiError';
import { ApiError } from '@interfaces/api.types';

// zuerst eine Typprüfung
function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        ('status' in error || 'message' in error)
    );
}

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
        // Typgeprüfte Fehlerbehandlung
        if (isApiError(error)) {
            return handleApiError(error);
        }
        // Fallback für andere Fehlertypen
        throw new Error(`Unerwarteter Fehler: ${String(error)}`);
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
        if (isApiError(error)) {
            return handleApiError(error);
        }
        // Fallback für andere Fehlertypen
        throw new Error(`Unerwarteter Fehler: ${String(error)}`);
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
        if (isApiError(error)) {
            return handleApiError(error);
        }
        // Fallback für andere Fehlertypen
        throw new Error(`Unerwarteter Fehler: ${String(error)}`);
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
        if (isApiError(error)) {
            return handleApiError(error);
        }
        // Fallback für andere Fehlertypen
        throw new Error(`Unerwarteter Fehler: ${String(error)}`);
    }
};