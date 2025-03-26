import { VMResponse } from '@interfaces/vm.types';
import { handleApiError } from '@services/auth/handleApiError';
import { ApiError } from '@interfaces/api.types';
import { VmStatusResponse, VmFormData, VmActionResponse, VmStats } from '@interfaces/vm.types';

/**
 * Fetches the list of all virtual machines from the backend
 * @throws Error when the request fails or the token is missing
 * @returns Array of VMs with name and status
 */
export const getVirtualMachines = async (): Promise<VMResponse[]> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
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
        // Type Assertion for the API Error
        return handleApiError(error as ApiError);
    }
    
};

/**
 * Fetches the status of all virtual machines from the backend
 * @throws Error when the request fails or the token is missing
 * @returns Status information for all VMs
 */
export const getVirtualMachineStatus = async (): Promise<VmStatusResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
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
        // Type Assertion for the API Error
        return handleApiError(error as ApiError);
    }
}

/**
 * Creates a new virtual machine
 * @param vmData Form data containing virtual machine configuration
 * @returns Boolean indicating success
 */
export const createVirtualMachine = async (vmData: VmFormData): Promise<boolean> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
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
 * Starts a virtual machine
 * @param name Name of the VM
 * @throws Error when the request fails
 * @returns Promise with the response from the VM action
 */
export const startVirtualMachine = async (name: string): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
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
 * Stops a virtual machine
 * @param name Name of the VM
 * @param force If true, the VM will be hard stopped
 * @returns Promise with the response from the VM action
 */
export const stopVirtualMachine = async (name: string, force = false): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
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
 * Reboots a virtual machine
 * @param name Name of the VM
 * @returns Promise with the response from the VM action
 */
export const rebootVirtualMachine = async (name: string): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
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
 * Deletes a virtual machine
 * @param name Name of the VM
 * @param deleteVhd If true, the VHD files will also be deleted
 * @returns Promise with the response from the VM action
 */
export const deleteVirtualMachine = async (name: string, deleteVhd = false): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
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
 * Fetches detailed information about a virtual machine
 * @param vmName Name of the VM
 * @returns Promise with VM statistics
 */
export const getVmDetails = async (vmName: string): Promise<VmStats> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
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

/**
 * Gets SPICE connection details for a virtual machine
 * @param vmName Name of the VM
 * @returns Connection details including ports and host
 */
export const getSpiceConnection = async (vmName: string): Promise<{
    spicePort: number;
    wsPort: number;
    host: string;
}> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${vmName}/spice`, {
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
 * Fetches all snapshots of a VM
 * @param vmName Name of the virtual machine
 * @returns Promise with snapshot information
 */
export const getVmSnapshots = async (vmName: string): Promise<{
    vm: string;
    snapshots: Array<{
        name: string;
        creationTime: string;
        state: string;
        description: string;
        parent: string | null;
    }>;
}> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${vmName}/snapshots`, {
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
 * Deletes a snapshot of a VM
 * @param vmName Name of the VM
 * @param snapshotName Name of the snapshot
 * @returns Promise with the response from the VM action
 */
export const deleteVmSnapshot = async (vmName: string, snapshotName: string): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${vmName}/snapshot/${snapshotName}/delete`, {
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
 * Creates a snapshot for a virtual machine
 * @param vmName Name of the VM
 * @param data Object containing snapshot details (name and optional description)
 * @returns Promise with the response from the VM action
 */
export const createVmSnapshot = async (vmName: string, data: { name: string; description?: string }): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${vmName}/snapshot/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
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
 * Reverts a VM to a specific snapshot
 * @param vmName Name of the VM
 * @param snapshotName Name of the snapshot to revert to
 * @returns Promise with the response from the VM action
 */
export const revertVmSnapshot = async (vmName: string, snapshotName: string): Promise<VmActionResponse> => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        throw new Error('No auth token found');
    }
    
    try {
        const response = await fetch(`/api/virt/domain/${vmName}/snapshot/${snapshotName}/revert`, {
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