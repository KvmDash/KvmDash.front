import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { SpiceMainConn, SpiceAgent } from '@assets/spice-html5/src/main';
import { sendCtrlAltDel } from '@assets/spice-html5/src/inputs';

interface SpiceViewerProps {
    host: string;
    port: number;
    password?: string;
}

export interface SpiceViewerRef {
    spiceConnection: SpiceMainConn | null;
}

const createSpiceDisplay = (container: HTMLDivElement): HTMLDivElement => {
    const display = document.createElement('div');
    display.id = 'spice-area';
    Object.assign(display.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1 // Expliziter z-Index für das Display
    });
    container.appendChild(display);
    return display;
};

const createMessageDiv = (container: HTMLDivElement): HTMLDivElement => {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message-div';
    Object.assign(messageDiv.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: '1000',
        padding: '5px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        transition: 'opacity 0.5s ease-out' // Smooth fade-out Animation
    });
    container.appendChild(messageDiv);
    return messageDiv;
};

const SpiceViewer = forwardRef<SpiceViewerRef, SpiceViewerProps>(({ host, port, password }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const spiceConnectionRef = useRef<SpiceMainConn | null>(null);
    const renderLoopRef = useRef<number | undefined>(undefined); // Animation Frame Referenz

    useImperativeHandle(ref, () => ({
        get spiceConnection() {
            console.log('SpiceConnection requested:', spiceConnectionRef.current);
            return spiceConnectionRef.current;
        }
    }), []);  // Leere Dependencies, da wir nur die Ref weitergeben

    const handleKeyboardShortcut = useCallback((e: KeyboardEvent) => {
        // Nur aktiv wenn Spice verbunden ist
        if (!spiceConnectionRef.current) return;

        // STRG+ALT+ENTF
        if (e.ctrlKey && e.altKey && e.key === 'Delete') {
            e.preventDefault();
            sendCtrlAltDel(spiceConnectionRef.current);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardShortcut);
        return () => window.removeEventListener('keydown', handleKeyboardShortcut);
    }, [handleKeyboardShortcut]);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Sicherstellen, dass alte Elemente entfernt werden
        const oldDisplay = document.getElementById('spice-area');
        const oldMessage = document.getElementById('message-div');
        if (oldDisplay) oldDisplay.remove();
        if (oldMessage) oldMessage.remove();

        container.innerHTML = '';
        container.style.position = 'relative';

        const messageDiv = createMessageDiv(container);
        const display = createSpiceDisplay(container);

        let isComponentMounted = true; // Flag für Cleanup

        console.log('SpiceViewer Props:', {
            receivedHost: host,
            receivedPort: port,
            uri: `ws://${host}:${port}`
        });

        try {
            spiceConnectionRef.current = new SpiceMainConn({
                uri: `ws://${host}:${port}`,
                screen_id: 'spice-area',
                password: password,
                onerror: (e: Event): void  => {
                    if (!isComponentMounted) return;
                    console.error('🔴 SPICE Error:', e);
                    messageDiv.textContent = `Fehler: ${e.type}`;
                },
                onsuccess: (): void  => {
                    if (!isComponentMounted) return;
                    console.log('🟢 SPICE Verbindung hergestellt');
                    messageDiv.textContent = 'Verbunden';
                    display.focus();
                    setTimeout(() => {
                        if (isComponentMounted && messageDiv) {
                            messageDiv.style.opacity = '0';  // Sanftes Ausblenden
                            // Nach der Animation komplett verstecken
                            setTimeout(() => {
                                if (isComponentMounted && messageDiv) {
                                    messageDiv.style.display = 'none';
                                }
                            }, 500);  // 500ms = Dauer der opacity transition
                        }
                    }, 5000); 
                },
                onagent: (agent: SpiceAgent) : void  => {
                    if (!isComponentMounted) return;
                    
                    // Erweiterte Debug-Ausgabe
                    console.log('🤝 SPICE Agent Details:', {
                        agent,
                        hasConnectDisplay: typeof agent.connect_display === 'function',
                        hasMain: !!agent.main,
                        mainMethods: agent.main ? Object.keys(agent.main) : [],
                        prototype: Object.getPrototypeOf(agent)
                    });
                
                    let isConnected = false;
                
                    const connectDisplay = (): ((display: HTMLElement) => boolean) => {
                        if (typeof agent.connect_display === 'function') {
                            console.log('📺 Verwende direkten connect_display');
                            return agent.connect_display;
                        } else if (agent.main?.connect_display) {
                            console.log('📺 Verwende main.connect_display');
                            return agent.main.connect_display;
                        }

                        // Wenn keine Methode gefunden wurde, versuche display direkt zu verbinden
                        console.log('⚠️ Keine standard connect_display Methode gefunden');
                        return (display: HTMLElement) => {
                            if (agent.main) {
                                agent.main.display = display;
                                return true;
                            }
                            return false;
                        };
                    };

                    const displayConnector = connectDisplay();
                    if (!displayConnector) {
                      console.error('🔴 Agent hat keine connect_display Funktion:', agent);
                      messageDiv.textContent = 'Agent Verbindungsfehler';
                      return;
                    }

                    const renderLoop = (): void => {
                        if (!isComponentMounted) return;

                        try {
                            if (!isConnected && spiceConnectionRef.current) {
                                if (display instanceof HTMLElement) {
                                    displayConnector(display);
                                    isConnected = true;
                                    console.log('🔗 Display verbunden');
                                    
                                    // Canvas anpassen
                                    const canvas = display.querySelector('canvas');
                                    if (canvas) {
                                        Object.assign(canvas.style, {
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            width: 'auto',
                                            height: 'auto'
                                        });
                                    }
                                } else {
                                    throw new Error('Display ist kein HTMLElement');
                                }
                            }
                            renderLoopRef.current = requestAnimationFrame(renderLoop);
                        } catch (error) {
                            console.error('🔴 Display Connection Error:', error, {
                                agent,
                                display,
                                isConnected
                            });
                            messageDiv.textContent = 'Verbindungsfehler';
                        }
                    };

                    renderLoopRef.current = requestAnimationFrame(renderLoop);
                    display.focus();
                }
            });
        } catch (error) {
            console.error('💥 SPICE Initialisierungsfehler:', error);
            messageDiv.textContent = `Initialisierungsfehler: ${error}`;
        }

        // Verbessertes Cleanup
        return (): void => {
            isComponentMounted = false; // Verhindert weitere Updates

            // Animation Frame stoppen
            if (renderLoopRef.current !== undefined) {
                cancelAnimationFrame(renderLoopRef.current);
                renderLoopRef.current = undefined;
            }

            // SPICE Verbindung beenden
            if (spiceConnectionRef.current) {
                try {
                    spiceConnectionRef.current.stop();
                    spiceConnectionRef.current = null;
                } catch (error) {
                    console.error('Cleanup error:', error);
                }
            }

            // Explizites DOM Cleanup
            const spiceArea = document.getElementById('spice-area');
            const messageDiv = document.getElementById('message-div');
            if (spiceArea) spiceArea.remove();
            if (messageDiv) messageDiv.remove();

            // Container leeren
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [host, port, password]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                aspectRatio: '16/9',
                maxWidth: '1920px',
                maxHeight: '1080px',
                border: '1px solid #ccc',
                overflow: 'hidden',
                backgroundColor: '#000',
                position: 'relative',
                margin: '0 auto',
            }}
        />
    );
});

SpiceViewer.displayName = 'SpiceViewer';
export { SpiceViewer };