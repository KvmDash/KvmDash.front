/**
 * Eine virtuelle Maschine, wie sie von der API zurückgegeben wird
 */
export interface VMResponse {
    name: string;    // Name der VM (z.B. "ubuntu-server")
    state: number;   // Status der VM (1 = running, 3 = paused, 5 = shutdown)
}