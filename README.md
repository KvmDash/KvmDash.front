# Projektbeschreibung: KVMDash Frontend

<table style="border-collapse: collapse; width: 100%;">
    <tr>
        <td style="width: 150px; padding: 10px; vertical-align: middle;">
            <img src="src/assets/kvmdash.svg" alt="KvmDash Logo" style="max-width: 100%;">
        </td>
        <td style="padding: 10px; vertical-align: middle;">
            KVMDash ist eine Webanwendung, die die Verwaltung von Virtual Machines (VMs) auf Linux-Systemen ermöglicht. 
            Mit einer benutzerfreundlichen Oberfläche erleichtert KVMDash die Administration und Überwachung von Virtualisierungsumgebungen.
            
            Dieses Repository enthält das Frontend der KVMDash-Anwendung.
        </td>
    </tr>
</table>

## Features

### VM Verwaltung
* Erstellen, Löschen und Konfigurieren von VMs und Containern über die Weboberfläche.
* Nutzung von Vorlagen für die schnelle und standardisierte Erstellung von VMs.

### Systemmonitoring
* Echtzeitüberwachung von Ressourcen wie CPU, Arbeitsspeicher, Festplattenauslastung und weiteren wichtigen Systemmetriken.
* Übersichtliche Darstellung der Systemleistung für eine optimale Kontrolle und Fehleranalyse.

## Demo-Videos

https://github.com/user-attachments/assets/ec76e8fa-f9b1-487d-87a8-6d370dbfb73c

## Systemvoraussetzungen

* Node.js 18.x oder neuer
* npm 9.x oder neuer
* KVMDash Backend (separat installiert und konfiguriert)

## Installation & Konfiguration

### 1. Repository klonen

```bash
# Repository herunterladen
git clone https://github.com/KvmDash/KvmDash.front.git kvmdash-frontend
cd kvmdash-frontend
```

### 2. Git-Submodule initialisieren

```bash
# Spice-HTML5 Submodul initialisieren und abrufen
git submodule init
git submodule update
```

Alternativ können Sie das Repository auch direkt mit Submodulen klonen:

```bash
git clone --recurse-submodules https://github.com/KvmDash/KvmDash.front.git kvmdash-frontend
cd kvmdash-frontend
```

### 3. Frontend einrichten

```bash
# SPICE HTML5 Client konfigurieren
cd src/assets/spice-html5
cp package.json.in package.json
sed -i 's/VERSION/0.3/g' package.json

# Zurück ins Hauptverzeichnis wechseln
cd ../../..

# Dependencies installieren
npm install
```

### 4. Backend-Verbindung konfigurieren

Öffne die Datei `src/config.ts` und passe die Backend-Einstellungen an:

```javascript
/// Testumgebung
// export const BACKEND_PORT = 8000; // Port des Backends
// export const BACKEND_HOST = 'localhost'; // Hostname/IP-Adresse des Backends

export const BACKEND_PORT = 80; // Port des Backends
export const BACKEND_HOST = 'kvmdash'; // Hostname/IP-Adresse des Backends
```

### 5. Entwicklungs-Server starten

```bash
npm run dev
```

Nach dem Start können Sie auf das KVMDash Frontend über http://localhost:5173 zugreifen.

### 6. Für Produktion bauen

```bash
npm run build
```

Die Build-Dateien finden Sie im `dist`-Verzeichnis und können auf einem Webserver Ihrer Wahl bereitgestellt werden.

## Hinweis

Dieses Frontend benötigt eine Verbindung zum KVMDash Backend, um ordnungsgemäß zu funktionieren. Bitte stellen Sie sicher, dass das Backend verfügbar und korrekt konfiguriert ist.