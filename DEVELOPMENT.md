# 🛠️ Entwickler-Dokumentation

## Architektur-Übersicht

Greengate ist eine Full-Stack-Anwendung mit klarer Trennung zwischen Backend und Frontend:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  React Frontend │────▶│  Express Backend │────▶│  WhatsApp API   │
│  (Port 5173)    │     │  (Port 3000)     │     │  (Meta)         │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌──────────┐
                        │  SQLite  │
                        │  Database│
                        └──────────┘
```

## Backend-Architektur

### Layer-Struktur

1. **Models Layer** (`backend/models/`)
   - Datenbankzugriff und ORM-ähnliche Funktionalität
   - Typdefinitionen für Entitäten
   - CRUD-Operationen

2. **Services Layer** (`backend/services/`)
   - Business-Logik
   - Integration mit externen APIs (WhatsApp)
   - Komplexe Operationen

3. **Routes Layer** (`backend/routes/`)
   - HTTP-Endpunkt-Definitionen
   - Request-Validierung
   - Response-Formatierung

4. **Database Layer** (`backend/database.ts`)
   - SQLite-Verbindungsverwaltung
   - Wrapper für Datenbankoperationen
   - Schema-Initialisierung

### Wichtige Dateien

#### `database.ts`
Zentrale Datenbank-Klasse mit Promise-basierter API:

```typescript
// Verwendung
const db = new Database('./greengate.db');
await db.initialize();
const result = await db.get('SELECT * FROM templates WHERE id = ?', [1]);
```

#### `whatsapp.service.ts`
WhatsApp API Integration:

```typescript
// Template-Nachricht senden
await whatsappService.sendTemplateMessage({
  to: '491234567890',
  templateName: 'welcome',
  languageCode: 'de',
  components: [...]
});

// Templates von Meta API abrufen
const templates = await whatsappService.getTemplates();
```

## Frontend-Architektur

### Komponenten-Struktur

```
src/
├── components/        # Wiederverwendbare Komponenten
│   └── Layout.tsx    # Haupt-Layout mit Navigation
├── pages/            # Seiten-Komponenten (Routes)
│   ├── SetupPage.tsx
│   ├── DashboardPage.tsx
│   ├── TemplatesPage.tsx
│   ├── MessagesPage.tsx
│   └── SendMessagePage.tsx
├── services/         # API-Clients und externe Services
│   └── api.ts
└── App.tsx          # Haupt-App-Komponente mit Routing
```

### State Management

Aktuell verwendet die Anwendung lokalen React State. Für zukünftige Erweiterungen könnte Context API oder Redux hinzugefügt werden.

### API-Service

Zentrale API-Kommunikation über `apiService`:

```typescript
// Verwendung in Komponenten
import { apiService } from '../services/api';

const templates = await apiService.getTemplates();
await apiService.sendTemplateMessage({
  to_number: '491234567890',
  template_name: 'welcome'
});
```

## Datenfluss

### Nachricht senden (Beispiel)

```
1. User füllt Formular aus (SendMessagePage.tsx)
2. Form Submit → apiService.sendTemplateMessage()
3. HTTP POST → /api/messages/send
4. message.routes.ts → validiert Request
5. whatsapp.service.ts → sendet an Meta API
6. Meta API → gibt WhatsApp Message ID zurück
7. messageModel.create() → speichert in DB
8. Response → Frontend aktualisiert UI
```

### Webhook-Nachricht empfangen

```
1. Meta sendet POST → /webhook
2. webhook.routes.ts empfängt Daten
3. Sofortige 200 OK Response (wichtig!)
4. Asynchrone Verarbeitung:
   - Nachricht extrahieren
   - messageModel.create() → speichert in DB
5. Frontend holt Updates via polling/refresh
```

## Entwicklungs-Workflow

### Neue Feature hinzufügen

1. **Backend erweitern**
   ```bash
   # Neues Model erstellen
   backend/models/contact.model.ts
   
   # Service-Logik hinzufügen
   backend/services/contact.service.ts
   
   # Routes definieren
   backend/routes/contact.routes.ts
   
   # In server.ts registrieren
   app.use('/api/contacts', createContactRoutes(...));
   ```

2. **Frontend erweitern**
   ```bash
   # API-Service erweitern
   frontend/src/services/api.ts
   
   # Page-Komponente erstellen
   frontend/src/pages/ContactsPage.tsx
   
   # Route in App.tsx hinzufügen
   <Route path="/contacts" element={<ContactsPage />} />
   ```

### Testing

```bash
# Backend testen
npm run dev

# API-Endpunkt testen
curl http://localhost:3000/api/templates

# Frontend testen
cd frontend
npm run dev
```

### Debugging

**Backend:**
- Logs werden in der Konsole ausgegeben
- Verwenden Sie `console.log()` für Debug-Ausgaben
- Fehler werden im Express Error Handler gefangen

**Frontend:**
- Browser DevTools Console
- React DevTools Extension
- Network Tab für API-Calls

## Datenbank-Migration

Bei Schema-Änderungen:

1. Ändern Sie die Schema-Definition in `database.ts` → `initialize()`
2. Für Produktionsdaten: Erstellen Sie ein Migrations-Script
3. Oder: Löschen Sie die `.db` Datei für Neustart (nur Development!)

Beispiel Migration:

```typescript
// In database.ts
async migrate() {
  await this.run(`ALTER TABLE messages ADD COLUMN read_at DATETIME`);
}
```

## API-Dokumentation

### Request-Formate

#### Template-Nachricht senden

```bash
POST /api/messages/send
Content-Type: application/json

{
  "to_number": "491234567890",
  "template_name": "welcome",
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "Max Mustermann" }
      ]
    }
  ]
}
```

#### Text-Nachricht senden

```bash
POST /api/messages/send-text
Content-Type: application/json

{
  "to_number": "491234567890",
  "text": "Hallo, wie kann ich helfen?"
}
```

#### Templates synchronisieren

```bash
POST /api/templates/sync

Response:
{
  "success": true,
  "synced_count": 5,
  "total_count": 5
}
```

## Umgebungsvariablen

Alle verfügbaren Umgebungsvariablen:

```env
# Server
PORT=3000                          # Backend Port
NODE_ENV=development               # Environment

# Database
DATABASE_PATH=./greengate.db       # SQLite Datenbankpfad

# Für Production zusätzlich empfohlen:
LOG_LEVEL=info                     # Logging Level
CORS_ORIGIN=https://your-domain.de # CORS Origin
```

## Sicherheitshinweise

1. **Access Tokens**: Niemals im Frontend speichern oder loggen
2. **Webhook Verify Token**: Sollte stark und zufällig sein
3. **HTTPS**: In Production immer HTTPS verwenden
4. **Rate Limiting**: Für Production implementieren
5. **Input Validation**: Alle User-Inputs validieren

## Performance-Optimierung

### Backend
- Connection Pooling für Datenbank (aktuell Single Connection)
- Caching für häufig abgerufene Templates
- Async/Await konsequent nutzen

### Frontend
- Code Splitting für große Komponenten
- Lazy Loading für Routes
- Image Optimization
- Memoization mit `React.memo()` und `useMemo()`

## Deployment

### Backend

```bash
# Build
npm run build

# Start
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
npm run build

# Output in frontend/dist/
# Mit nginx oder anderem Webserver bereitstellen
```

### Nginx-Konfiguration (Beispiel)

```nginx
server {
    listen 80;
    server_name your-domain.de;

    # Frontend
    location / {
        root /var/www/greengate/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Webhook
    location /webhook {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### Docker (Optional)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Bekannte Einschränkungen

1. **Keine Authentifizierung**: Aktuell kein User-Management
2. **Einzelne WhatsApp-Nummer**: Nur eine Business-Nummer pro Instance
3. **Keine Medien-Verwaltung**: Nur Text und Templates
4. **Kein Echtzeit-Update**: Frontend muss manuell aktualisiert werden
5. **Einfaches Logging**: Keine strukturierten Logs

## Roadmap

### Kurzfristig (v1.1)
- [ ] Authentifizierung und User-Management
- [ ] WebSocket für Echtzeit-Updates
- [ ] Besseres Error Handling und Logging
- [ ] Unit und Integration Tests

### Mittelfristig (v1.2)
- [ ] Medien-Upload und -Verwaltung
- [ ] Kontakt-Management
- [ ] Automatische Antworten (Chatbot-Basis)
- [ ] Template-Editor in der GUI

### Langfristig (v2.0)
- [ ] Multi-Tenant Support
- [ ] Analytics Dashboard
- [ ] Integration mit CRM-Systemen
- [ ] Workflow-Automation
- [ ] Mobile App

## Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

### Code Style

- TypeScript strict mode
- ESLint rules befolgen
- Sinnvolle Kommentare für komplexe Logik
- Type-Safety bevorzugen

## Support & Community

- GitHub Issues für Bugs und Features
- Diskussionen für Fragen und Ideen

---

**Happy Coding! 🚀**
