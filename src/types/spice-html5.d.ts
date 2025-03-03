declare module '@assets/spice-html5/src/main' {
    export class SpiceMainConn {
        constructor(options: {
            uri: string;
            screen_id: string;
            password?: string;
            message_id?: string;  // message_id hinzugefügt
            onerror?: (e: any) => void;
            onsuccess?: () => void;
            onagent?: (agent: any) => void;  // onagent hinzugefügt
        });
        
        stop(): void;
    }
}

