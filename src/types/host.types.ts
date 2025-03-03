/**
 * CPU-Informationen des Hosts
 */
export interface CpuData {
    cpu: string;      // CPU Bezeichnung
    total: number;    // Gesamte CPU-Zeit
    idle: number;     // Leerlauf-Zeit
    used: number;     // Genutzte Zeit
    usage: number;    // Auslastung in Prozent
}

/**
 * Festplatten-Informationen
 */
export interface DiskData {
    Filesystem: string;   // Dateisystem-Name
    Size: string;        // Gesamtgröße
    Used: string;        // Genutzter Speicherplatz
    Avail: string;       // Verfügbarer Speicherplatz
    Use: string;         // Nutzung in Prozent
    Mounted: string;     // Mount-Punkt
}

/**
 * Arbeitsspeicher-Informationen
 */
export interface MemData {
    total: string;       // Gesamter RAM
    used: string;        // Genutzter RAM
    available: string;   // Verfügbarer RAM
}

/**
 * System-Informationen des Hosts
 */
export interface SystemInfo {
    Hostname: string;                    // Hostname des Systems
    KernelName: string;                 // Name des Kernels (z.B. "Linux")
    KernelRelease: string;              // Kernel-Version
    OperatingSystemPrettyName: string;  // Betriebssystem-Name
    HardwareVendor: string;             // Hardware-Hersteller
    HardwareModel: string;              // Hardware-Modell
}