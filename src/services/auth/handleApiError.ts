// Zweck: Behandlung von API-Fehlern
// Diese Funktion wird verwendet, um Fehler von API-Anfragen zu behandeln. Wenn ein 401-Fehler auftritt und ein Token vorhanden ist, wird der Token entfernt und der Benutzer zur Login-Seite weitergeleitet.
//
// Diese Funktion wird in den Dateien 
// frontend/src/services/host.ts, 
// frontend/src/services/virtualization.ts 

export const handleApiError = (error: any) => {
    // Token aus localStorage holen
    const token = localStorage.getItem('jwt_token');
    
    // Wenn ein 401 Fehler auftritt und wir ein Token haben
    if (error?.status === 401 && token) {
        // Token entfernen
        localStorage.removeItem('jwt_token');
        // Zur Login-Seite weiterleiten
        window.location.href = '/login';
    }
    
    throw error;
};