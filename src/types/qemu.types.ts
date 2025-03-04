
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
 * Status einer ISO-Datei
 */
export interface IsoStatus {
    status: 'downloading' | 'success' | 'error';  // Aktueller Status
    message?: string;                             // Optionale Statusmeldung
    timestamp?: number;                           // Zeitstempel der letzten Änderung
}

/**
 * Informationen zu einer ISO-Datei
 */
export interface IsoFile {
    name: string;    // Anzeigename der ISO
    path: string;    // Dateipfad im System
}