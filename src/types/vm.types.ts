// single vm
export interface VMData {
    'state.state': string;
}

// all vms
export interface VirtualMachine {
    [key: string]: VMData;
}