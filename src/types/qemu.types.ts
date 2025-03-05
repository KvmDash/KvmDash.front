
/**
 * Netzwerk-Optionen für die VM-Konfiguration
 */
export interface NetworkOption {
    name: string;                  // Anzeigename
    type: 'bridge' | 'nat';        // Netzwerktyp
    value: string;                 // Technischer Name
    active?: boolean;              // Aktiv/Inaktiv Status
}


/**
 * Informationen zu einer ISO-Datei
 */
export interface IsoFile {
    name: string;    // Anzeigename der ISO
    path: string;    // Dateipfad im System
    size: number;     // Größe der ISO
}

export interface IsoStatusData {
    pid?: number;
    log_file?: string;
    url?: string;
    target_path?: string;
    filesize?: number;
    start_time?: number;
    end_time?: number;
    message?: string;
}

export interface IsoDownloadStatus {
    status: string;
    message: string;
    timestamp: number;
    data: IsoStatusData;
}

export interface IsoResponse {
    status: string;
    message: string;
    data: {
        pid?: number;
        log_file?: string;
    };
}

export interface IsoStatusResponse {
    status: string;
    data: IsoDownloadStatus[];
}