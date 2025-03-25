import { JSX, useEffect, useRef } from 'react';
import { SpiceMainConn, SpiceAgent } from '@assets/spice-html5/src/main';
//import { SpiceMainConn } from 'spice-html5/src/main';

interface SpiceViewerProps {
    host: string;
    port: number;
    password?: string;
}



const createSpiceDisplay = (container: HTMLDivElement): HTMLDivElement => {
    const display = document.createElement('div');
    display.id = 'spice-area';
    Object.assign(display.style, {
        position: 'absolute',
        top: '50%',               // Vertikale Zentrierung
        left: '50%',             // Horizontale Zentrierung
        transform: 'translate(-50%, -50%)', // Perfekte Zentrierung
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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



export const SpiceViewer = ({ host, port, password }: SpiceViewerProps): JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);
    const spiceConnectionRef = useRef<SpiceMainConn | null>(null);
    const renderLoopRef = useRef<number | undefined>(undefined); // Animation Frame Referenz
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
                        // Erweiterte Prüfung für verschiedene Display-Server
                        if (typeof agent.connect_display === 'function') {
                            console.log('📺 Verwende direkten connect_display');
                            return agent.connect_display;
                        } else if (agent.main?.connect_display) {
                            console.log('📺 Verwende main.connect_display');
                            return agent.main.connect_display;
                        } else if (agent.main?.agent?.connect_display) {
                            console.log('📺 Verwende main.agent.connect_display');
                            return agent.main.agent.connect_display;
                        }
                
                        // Wenn keine Methode gefunden wurde, versuche display direkt zu verbinden
                        console.log('⚠️ Keine standard connect_display Methode gefunden');
                        return (display: HTMLElement) => {
                            if (agent.main) {
                                // Versuche display direkt zu setzen
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
                height: '100%',           // Volle Höhe des Containers
                aspectRatio: '16/9',      // 16:9 Seitenverhältnis
                maxWidth: '1920px',       // Full HD Breite
                maxHeight: '1080px',      // Full HD Höhe
                border: '1px solid #ccc',
                overflow: 'hidden',
                backgroundColor: '#000',
                position: 'relative',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />
    );
};