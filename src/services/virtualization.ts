import { VMResponse } from '@interfaces/vm.types';
import { handleApiError } from '@services/auth/handleApiError';
import { ApiError } from '@interfaces/api.types';
import { VmStatusResponse, VmFormData, VmActionResponse, VmStats } from '@interfaces/vm.types';

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


export const createVirtualMachine = async (vmData: VmFormData): Promise<boolean> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch('/api/virt/domain/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vmData)
        });

        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText
            };
        }

        const data = await response.json();
        return data.success;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        return handleApiError(error as ApiError);
    }
};


/**
 * Startet eine virtuelle Maschine
 * @param name Name der VM
 * @throws Error wenn die Anfrage fehlschlägt
 */
export const startVirtualMachine = async (name: string): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${name}/start`, {
            method: 'POST',
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
 * Stoppt eine virtuelle Maschine
 * @param name Name der VM
 * @param force Wenn true, wird die VM hart gestoppt
 */
export const stopVirtualMachine = async (name: string, force = false): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${name}/stop`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ force })
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
 * Startet eine virtuelle Maschine neu
 * @param name Name der VM
 */
export const rebootVirtualMachine = async (name: string): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${name}/reboot`, {
            method: 'POST',
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
 * Löscht eine virtuelle Maschine
 * @param name Name der VM
 * @param deleteVhd Wenn true, werden auch die VHD-Dateien gelöscht
 */
export const deleteVirtualMachine = async (name: string, deleteVhd = false): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${name}/delete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deleteVhd })
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
 * Holt detaillierte Informationen zu einer virtuellen Maschine
 * @param vmName Name der VM
 */
export const getVmDetails = async (vmName: string): Promise<VmStats> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('Kein Auth-Token gefunden');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${vmName}/details`, {
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