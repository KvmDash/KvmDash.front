import { VMResponse } from '@interfaces/vm.types';
import { handleApiError } from '@services/auth/handleApiError';
import { ApiError } from '@interfaces/api.types';
import { VmStatusResponse } from '@interfaces/vm.types';

/**
 * Holt die Liste aller virtuellen Maschinen vom Backend
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns Array von VMs mit Name und Status
 */
export const getVirtualMachines = async (): Promise<VMResponse[]> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch('/api/virt/domains', {
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
        return data.domains;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        // Type Assertion für den API Error
        return handleApiError(error as ApiError);
    }
    
};

/**
 * Holt den Status aller virtuellen Maschinen vom Backend
 * @throws Error wenn die Anfrage fehlschlägt oder der Token fehlt
 * @returns 
 */
export const getVirtualMachineStatus = async (): Promise<VmStatusResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch('/api/virt/domains/status', {
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
        // Type Assertion für den API Error
        return handleApiError(error as ApiError);
    }
}