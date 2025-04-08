declare module '@assets/spice-html5/src/spicetype' {
    export class SpiceChannelId {
        type: number;
        id: number;
        from_dv(dv: DataView, at: number, mb: ArrayBuffer): number;
    }

    export class SpiceRect {
        top: number;
        left: number;
        bottom: number;
        right: number;
        from_dv(dv: DataView, at: number, mb: ArrayBuffer): number;
    }
}

declare module '@assets/spice-html5/src/main' {
    export interface SpiceAgent {
        connect_display?: (display: HTMLElement) => boolean;
        main?: {
            connect_display: (display: HTMLElement) => boolean;
            display?: HTMLElement;
        };
    }

    export class SpiceMainConn {
        constructor(options: {
            uri: string;
            screen_id: string;
            password?: string;
            onerror: (e: Event) => void;
            onsuccess?: () => void;
            onagent: (agent: SpiceAgent) => void;
        });
        
        stop(): void;
    }
}

declare module '@assets/spice-html5/src/inputs' {
    import { SpiceMainConn } from '@assets/spice-html5/src/main';
    
    export function sendCtrlAltDel(sc: SpiceMainConn): void;
    
    // Optional: Weitere Input-bezogene Funktionen, falls benötigt
    export function handle_keydown(e: KeyboardEvent): void;
    export function handle_keyup(e: KeyboardEvent): void;
    export function handle_mousemove(e: MouseEvent): void;
    export function handle_mousedown(e: MouseEvent): void;
    export function handle_mouseup(e: MouseEvent): void;
}
