declare module '@assets/spice-html5/src/main' {
    export interface SpiceAgent {
        connect_display?: (display: HTMLElement) => boolean;
        main?: {
            connect_display: (display: HTMLElement) => boolean;
            agent?: {
                connect_display: (display: HTMLElement) => boolean;
            }
            display?: HTMLElement; // Neue Eigenschaft für den direkten Zugriff
        };
    }

    export class SpiceMainConn {
        constructor(options: {
            uri: string;
            screen_id: string;
            password?: string;
            message_id?: string;
            onerror: (e: Event) => void;
            onsuccess?: () => void;
            onagent: (agent: SpiceAgent) => void;
        });
        
        // Methoden der Klasse, nicht des Konstruktors
        stop(): void;
    }
}

