# 🌿 Greengate - WhatsApp Business Management Platform

Greengate ist eine vollständige, selbst gehostete Webanwendung zur Verwaltung von WhatsApp Business Cloud API Templates, zum Senden und Empfangen von Nachrichten über Webhooks sowie zur Bereitstellung einer umfassenden Management-GUI für alle Funktionen.

## 🚀 Features

- ✅ **Template-Management**: CRUD-Operationen für WhatsApp Business Templates mit Synchronisation zur Meta API
- ✅ **Nachrichtenverwaltung**: Senden und Empfangen von Nachrichten (Template- und Textnachrichten)
- ✅ **Webhook-Integration**: Robuste Webhook-Endpoints für eingehende Nachrichten und Status-Updates
- ✅ **Echtzeit-Dashboard**: Übersicht über alle Nachrichten, Templates und Aktivitäten
- ✅ **Moderne UI**: React-basierte Benutzeroberfläche mit Tailwind CSS
- ✅ **SQLite-Datenbank**: Einfache, dateibasierte Datenbank ohne externe Dependencies
- ✅ **REST API**: Vollständige API für Drittanwendungen

## 📋 Technischer Stack

- **Backend**: TypeScript, Node.js, Express
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Datenbank**: SQLite
- **WhatsApp API**: Meta WhatsApp Business Cloud API

## 📦 Installation

### Voraussetzungen

- Node.js 18+ und npm
- WhatsApp Business API Zugangsdaten (Access Token, Phone Number ID)
- Optional: WhatsApp Business Account ID (WABA ID) für Template-Management

### 1. Repository klonen und Dependencies installieren

```bash
# Backend Dependencies
npm install

# Frontend Dependencies
cd frontend
npm install
cd ..
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Bearbeiten Sie `.env` nach Bedarf:

```env
PORT=3000
DATABASE_PATH=./greengate.db
NODE_ENV=development
```

### 3. Datenbank initialisieren

Die Datenbank wird automatisch beim ersten Start des Servers erstellt und initialisiert.

## 🎯 Verwendung

### Entwicklungsmodus

**Terminal 1 - Backend starten:**
```bash
npm run dev
```

**Terminal 2 - Frontend starten:**
```bash
cd frontend
npm run dev
```

Der Backend-Server läuft auf `http://localhost:3000`
Das Frontend ist verfügbar unter `http://localhost:5173`

### Produktionsmodus

```bash
# Backend kompilieren
npm run build

# Frontend kompilieren
cd frontend
npm run build
cd ..

# Server starten
npm start
```

Für Production sollten Sie den Frontend-Build mit einem Webserver wie nginx bereitstellen.

## ⚙️ Erstkonfiguration

Beim ersten Aufruf der Anwendung werden Sie zur Eingabe der WhatsApp Business API Zugangsdaten aufgefordert:

1. **Access Token** (erforderlich): Ihr Meta API Access Token
2. **Phone Number ID** (erforderlich): Ihre WhatsApp Business Phone Number ID
3. **WABA ID** (optional): Erforderlich für Template-Management
4. **Webhook Verify Token** (optional): Wird automatisch generiert, wenn nicht angegeben

Diese Informationen finden Sie in Ihrem Meta Business Manager unter "WhatsApp" → "API Setup".

## 📡 Webhook-Konfiguration

### Webhook-URL

Konfigurieren Sie in der Meta Business Manager Konsole folgende Webhook-URL:

```
https://ihre-domain.de/webhook
```

### Webhook-Verifizierung

1. Gehen Sie zu Meta Business Manager → WhatsApp → Configuration → Webhooks
2. Klicken Sie auf "Edit" bei Ihrem Webhook
3. Geben Sie die Webhook-URL ein
4. Als Verify Token verwenden Sie den Token aus Ihrer Konfiguration
5. Abonnieren Sie folgende Webhook-Felder:
   - `messages` (Eingehende Nachrichten)
   - `message_status` (Status-Updates)

## 🗂️ Projektstruktur

```
greengate/
├── backend/
│   ├── database.ts              # SQLite Datenbankverbindung
│   ├── server.ts                # Express Server & Routing
│   ├── models/                  # Datenbank-Modelle
│   │   ├── config.model.ts
│   │   ├── message.model.ts
│   │   └── template.model.ts
│   ├── routes/                  # API-Routen
│   │   ├── config.routes.ts
│   │   ├── webhook.routes.ts
│   │   ├── message.routes.ts
│   │   └── template.routes.ts
│   └── services/
│       └── whatsapp.service.ts  # WhatsApp API Integration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── SetupPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TemplatesPage.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   └── SendMessagePage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── ...
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API-Endpunkte

### Konfiguration

- `GET /api/config` - Aktuelle Konfiguration abrufen
- `POST /api/config/whatsapp` - WhatsApp-Konfiguration speichern

### Templates

- `GET /api/templates` - Alle Templates abrufen
- `GET /api/templates/:id` - Template nach ID abrufen
- `POST /api/templates/sync` - Templates von Meta API synchronisieren
- `POST /api/templates` - Neues Template erstellen
- `PUT /api/templates/:id` - Template aktualisieren
- `DELETE /api/templates/:id` - Template löschen

### Nachrichten

- `GET /api/messages` - Alle Nachrichten abrufen (mit limit Parameter)
- `GET /api/messages/:id` - Nachricht nach ID abrufen
- `POST /api/messages/send` - Template-Nachricht senden
- `POST /api/messages/send-text` - Text-Nachricht senden

### Webhooks

- `GET /webhook` - Webhook-Verifizierung
- `POST /webhook` - Eingehende Nachrichten und Status-Updates empfangen

## 📊 Datenbank-Schema

### `templates`

- `id` - Primary Key
- `name` - Template-Name (eindeutig)
- `language_code` - Sprachcode (z.B. 'de', 'en')
- `category` - Kategorie ('UTILITY', 'MARKETING', etc.)
- `meta_template_id` - Meta API Template-ID
- `status` - Status ('APPROVED', 'PENDING', 'REJECTED')
- `content_json` - Template-Inhalt als JSON
- `created_at`, `updated_at` - Zeitstempel

### `messages`

- `id` - Primary Key
- `whatsapp_id` - WhatsApp Message ID (eindeutig)
- `to_number` - Empfänger-Nummer
- `from_number` - Absender-Nummer
- `template_name` - Verwendetes Template (optional)
- `direction` - 'INBOUND' oder 'OUTBOUND'
- `status` - Status ('SENT', 'DELIVERED', 'READ', 'FAILED', etc.)
- `body` - Nachrichteninhalt
- `timestamp` - Nachrichtenzeitstempel
- `created_at`, `updated_at` - Zeitstempel

### `config`

- `key` - Konfigurationsschlüssel (Primary Key)
- `value` - Konfigurationswert
- `created_at`, `updated_at` - Zeitstempel

## 🎨 Frontend-Features

### Dashboard
- Übersicht über Nachrichtenstatistiken
- Anzeige der letzten Nachrichten
- Echtzeit-Status-Updates

### Template-Management
- Liste aller Templates mit Status
- Synchronisation mit Meta API
- Template-Löschung

### Nachrichten-Historie
- Chronologische Anzeige aller Nachrichten
- Filterung nach Anzahl
- Unterscheidung zwischen ein- und ausgehenden Nachrichten

### Nachrichten senden
- Template-Nachrichten mit dynamischen Parametern
- Text-Nachrichten (innerhalb 24h-Fenster)
- Validierung und Fehlerbehandlung

## 🔐 Sicherheit

- API Access Tokens werden nicht im Frontend angezeigt
- Sensible Daten werden nur im Backend gespeichert
- Webhook-Verifizierung mit Verify Token
- SQLite-Datenbank sollte durch Dateisystemberechtigungen geschützt werden

## 🐛 Fehlerbehebung

### Backend startet nicht
- Überprüfen Sie, ob Port 3000 verfügbar ist
- Prüfen Sie Schreibrechte für die Datenbank-Datei
- Kontrollieren Sie die Logs in der Konsole

### Webhook-Verifizierung schlägt fehl
- Stellen Sie sicher, dass der Verify Token in der Konfiguration gespeichert ist
- Überprüfen Sie, ob der Webhook-Endpoint öffentlich erreichbar ist
- Verwenden Sie HTTPS in Produktionsumgebungen

### Templates werden nicht synchronisiert
- Überprüfen Sie, ob die WABA ID korrekt konfiguriert ist
- Stellen Sie sicher, dass der Access Token gültig ist
- Prüfen Sie die Berechtigungen des Access Tokens

### Nachrichten können nicht gesendet werden
- Verifizieren Sie die Telefonnummern (Format ohne +, mit Ländercode)
- Stellen Sie sicher, dass Templates den Status "APPROVED" haben
- Für Text-Nachrichten muss ein 24h-Fenster offen sein

## 📝 Template-Beispiel

Beispiel für einen Template-Body mit Parametern:

```json
{
  "name": "welcome_message",
  "language": "de",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Hallo {{1}}, willkommen bei {{2}}! Ihre Bestellung {{3}} wurde bestätigt."
    }
  ]
}
```

Beim Senden werden die Parameter als Array übergeben:
```json
{
  "to_number": "491234567890",
  "template_name": "welcome_message",
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "Max Mustermann" },
        { "type": "text", "text": "Greengate" },
        { "type": "text", "text": "#12345" }
      ]
    }
  ]
}
```

## 🚀 Nächste Schritte

- [ ] Medien-Unterstützung (Bilder, Videos, Dokumente)
- [ ] Erweiterte Template-Erstellung direkt in der GUI
- [ ] Kontakt-Management
- [ ] Automatische Antworten und Workflows
- [ ] Analytics und Reporting
- [ ] Multi-User-Unterstützung mit Authentifizierung
- [ ] WebSocket für Echtzeit-Updates
- [ ] Export von Nachrichten und Statistiken

## 📄 Lizenz

MIT

## 🤝 Beitragen

Contributions sind willkommen! Bitte erstellen Sie einen Pull Request oder öffnen Sie ein Issue für Vorschläge und Fehlerberichte.

## 📞 Support

Bei Fragen oder Problemen öffnen Sie bitte ein Issue im Repository.

---

**Entwickelt mit ❤️ für WhatsApp Business Automation**
