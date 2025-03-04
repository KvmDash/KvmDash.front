// Zweck: Behandlung von API-Fehlern
// Diese Funktion wird verwendet, um Fehler von API-Anfragen zu behandeln. Wenn ein 401-Fehler auftritt und ein Token vorhanden ist, wird der Token entfernt und der Benutzer zur Login-Seite weitergeleitet.
//
// Diese Funktion wird in den Dateien 
// frontend/src/services/host.ts, 
// frontend/src/services/virtualization.ts 

export const handleApiError = (error: any) => {
    const token = localStorage.getItem('jwt_token');
    
    console.log('Error Objekt:', error); // Debug-Log
    console.log('Error Status:', error?.status); // Debug-Log
    
    if (error?.status === 401 && token) {
        console.log('Token wird gelöscht und Weiterleitung...'); // Debug-Log
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
    }
    
    throw error;
};