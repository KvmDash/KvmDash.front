import { NetworkOption } from '@interfaces/qemu.types';
import { handleApiError } from '@services/auth/handleApiError';
import { ApiError } from '@interfaces/api.types';
import { IsoFile } from '@interfaces/qemu.types';
import { IsoResponse, IsoStatusResponse, DeleteIsoResponse } from '@interfaces/qemu.types';

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

/**
 * Standard OS-Variante die verwendet wird
 */
export const DEFAULT_OS_VARIANT = 'linux2022';

/**
 * Holt die Liste verfügbarer Betriebssystem-Varianten
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns Array von OS-IDs
 */
export const getOsVariants = async (): Promise<string[]> => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }

    try {
        const response = await fetch('/api/qemu/osinfo', {
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
        const variants = data.data as string[];

        // linux2022 an den Anfang der Liste setzen
        return [
            DEFAULT_OS_VARIANT,
            ...variants.filter(v => v !== DEFAULT_OS_VARIANT)
        ];

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        return handleApiError(error as ApiError);
    }
};


/**
 * Holt die Liste verfügbarer ISO-Images
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns Array von ISO-Dateien mit Name, Pfad und Größe
 */
export const getIsoImages = async (): Promise<IsoFile[]> => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }

    try {
        const response = await fetch('/api/qemu/images', {
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


/**
 * Startet den Download einer ISO-Datei
 * @param url URL der ISO-Datei
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 */
export const uploadIso = async (url: string): Promise<IsoResponse> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Nicht authentifiziert');

    try {
        console.log('Sending request with payload:', { url }); // Debug

        const response = await fetch('/api/qemu/iso/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server response:', errorData); // Debug
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success response:', data); // Debug
        return data;
    } catch (error) {
        console.error('Upload error:', error); // Debug
        throw error;
    }
};

/**
 * Prüft den Status aller ISO-Downloads
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 */
export const getIsoStatus = async (): Promise<IsoStatusResponse> => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }

    try {
        const response = await fetch('/api/qemu/iso/status', {
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

        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        return handleApiError(error as ApiError);
    }
};


/**
 * Löscht ein ISO-Image aus dem Storage Pool
 * @param path Pfad zur ISO-Datei
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns DeleteIsoResponse mit Status und Nachricht
 */
export const deleteIso = async (path: string): Promise<DeleteIsoResponse> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Nicht authentifiziert');

    const response = await fetch('/api/qemu/iso/delete', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const uploadIsoFile = async (file: File): Promise<IsoResponse> => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Nicht authentifiziert');

    const formData = new FormData();
    formData.append('file', file);

    try {
        // API-Pfad anpassen um mit Backend übereinzustimmen
        const response = await fetch('/api/qemu/iso/upload/file', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            // Besseres Error-Handling
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};