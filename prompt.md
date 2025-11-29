Cursor AI Projekt-Prompt: WhatsApp Business Automation & Management GUI

1. PROJEKTZIEL

Entwicklung einer vollständigen, selbst gehosteten Webanwendung zur Verwaltung von WhatsApp Business Cloud API Templates, zum Senden und Empfangen von Nachrichten über eine interne API und Webhooks sowie zur Bereitstellung einer umfassenden Management-GUI für alle Funktionen. Das Ziel ist eine stabile und skalierbare Automatisierungsschnittstelle, die dem Funktionsumfang von Lösungen wie Superchat ähnelt oder diesen übertrifft.

2. TECHNISCHER STACK & DATENBANK

Backend: TypeScript (mit Node.js und Express oder NestJS, bevorzugt Express für Flexibilität und einfache API-Implementierung)

Frontend: React (mit TypeScript und Tailwind CSS)

Datenbank: SQLite (Standard, falls keine PostgreSQL-Umgebung erkannt wird).

WhatsApp API: Verwendung der offiziellen WhatsApp Business Cloud API (Meta/Facebook)

3. KERNFUNKTIONALITÄTEN (MVP)

Bereich

Funktion

Details

Templates

Template-Management (CRUD)

Anzeigen, Erstellen, Bearbeiten, Löschen von WhatsApp Business Templates. Status-Synchronisation mit der Meta API.

Nachrichten

Nachrichten senden

Endpoint zum Senden von Template-Nachrichten (mit dynamischen Parametern) und einfachen Textnachrichten.

Echtzeit

Nachrichten empfangen (Webhooks)

Robuster Webhook-Endpunkt zur Verarbeitung eingehender Nachrichten, Status-Updates (Gesendet, Zugestellt, Gelesen) und Fehlermeldungen.

GUI

User Interface

Management-Dashboard zur Konfiguration, Template-Vorschau und einem einfachen Chat-Protokoll.

Automatisierung

Interne API

Vollständige REST-API zur Nutzung aller Funktionen durch Drittsysteme.

4. DATENMODELL-ENTWURF (SQLite)

Es werden mindestens drei Haupttabellen benötigt:

templates

id (PRIMARY KEY)

name (VARCHAR, eindeutig)

language_code (VARCHAR, z.B. 'de', 'en')

category (VARCHAR, z.B. 'UTILITY', 'MARKETING')

meta_template_id (VARCHAR, ID von Meta)

status (VARCHAR, z.B. 'APPROVED', 'PENDING')

content_json (JSON, Speicherung des kompletten Template-Body mit Headern/Footern/Buttons)

messages

id (PRIMARY KEY)

whatsapp_id (VARCHAR, ID der Nachricht bei Meta, eindeutig)

to_number (VARCHAR, Empfänger-Nummer)

from_number (VARCHAR, WABA-Nummer)

template_name (VARCHAR, optional, falls Template verwendet wurde)

direction (VARCHAR, 'INBOUND' oder 'OUTBOUND')

status (VARCHAR, z.B. 'SENT', 'DELIVERED', 'READ', 'FAILED')

body (TEXT, Nachrichteninhalt)

timestamp (DATETIME)

config

key (VARCHAR, PRIMARY KEY, z.B. 'meta_access_token')

value (TEXT, Wert)

5. SCHRITT-FÜR-SCHRITT-ANLEITUNG FÜR CURSOR AI

Bitte implementiere das Projekt in der folgenden Reihenfolge. Generiere nur den Code für den jeweils aktuellen Schritt, es sei denn, ein späterer Schritt erfordert die gleichzeitige Fertigstellung einer Datei.

Schritt 1: Projektstruktur und Backend-Setup (TypeScript/Express & SQLite)

Erstelle die Grundstruktur für ein Node.js/TypeScript-Projekt mit Express.

Implementiere die SQLite-Datenbankverbindung (z.B. mit sqlite3 und einem ORM wie TypeORM oder Sequelize) und das Basis-Datenbankmodell (die drei Tabellen: templates, messages, config).

Erstelle das config-Modell und implementiere einen initialen Endpoint zur Speicherung der WhatsApp Business API Credentials (Access Token, WABA ID, Phone Number ID) in der config-Tabelle.

Schritt 2: WhatsApp Webhook-Empfang

Implementiere einen öffentlichen Webhook-Endpunkt (/webhook), der die Meta-Anforderungen für die Webhook-Verifizierung (GET-Anfrage mit hub.mode, hub.challenge, hub.verify_token) erfüllt. Der verify_token sollte aus der config-Tabelle gelesen werden.

Implementiere die POST-Logik für den /webhook-Endpunkt, um eingehende Nachrichten (INBOUND) und Status-Updates zu verarbeiten.

Speichere jede eingehende Nachricht und jedes Status-Update in der messages-Tabelle, wobei der status (z.B. 'DELIVERED') entsprechend aktualisiert wird.

Schritt 3: Interne API zum Senden von Nachrichten (Template-Fokus)

Implementiere einen POST-Endpoint (/api/messages/send), der eine Template-Nachricht an eine beliebige Nummer senden kann.

Erwarte die Parameter: to_number (String), template_name (String), components (JSON, für dynamische Variablen).

Die Logik muss:

Den template_name in der templates-Tabelle suchen, um die Meta template_id zu erhalten.

Die config-Tabelle für den access_token und die phone_number_id abfragen.

Die offizielle Meta API aufrufen (z.B. mit axios oder nativem fetch), um die Nachricht zu senden.

Die gesendete Nachricht mit dem Status 'SENT' und der zurückgegebenen Meta whatsapp_id in der messages-Tabelle speichern.

Schritt 4: Template-Management API (CRUD)

Erstelle die vollen CRUD-Endpunkte für die templates-Tabelle (/api/templates).

Implementiere einen Endpunkt (/api/templates/sync), der die Liste der Templates von der Meta API abruft und die lokale templates-Tabelle mit den Namen, IDs und Status synchronisiert.

Schritt 5: Frontend-Setup (React/Tailwind) und Auth-Gate

Erstelle eine Single-Page React-Anwendung (TypeScript) mit Tailwind CSS.

Erstelle eine Initialisierungs-Seite, die prüft, ob die Meta-Zugangsdaten in der config-Tabelle vorhanden sind. Falls nicht, wird ein Formular zur Eingabe und Speicherung angezeigt (Aufruf des Konfigurations-Endpoints aus Schritt 1).

Sobald die Konfiguration abgeschlossen ist, leite zur Haupt-GUI weiter.

Schritt 6: Template-Management GUI

Implementiere eine Ansicht im Frontend, die alle in der Datenbank gespeicherten Templates anzeigt (Abruf via /api/templates).

Füge Buttons für "Sync Templates" (Aufruf von /api/templates/sync) und "Delete/Edit" hinzu.

Erstelle eine Modal-Komponente zum Erstellen neuer Templates (unterstützt mindestens Text-Body und dynamische Variablen {1}, {2}, ...). Das Backend muss dies dann an die Meta API weiterleiten (Erweiterung des CRUD-Endpoints aus Schritt 4).

Schritt 7: Nachrichten-Monitoring und Sende-Test

Erstelle eine Dashboard-Ansicht im Frontend, die die letzten 50 Einträge aus der messages-Tabelle anzeigt (Datum, Richtung, Status, Empfänger, Body-Vorschau).

Füge eine Test-Sektion hinzu, die es ermöglicht, manuell eine Template-Nachricht zu senden, indem man eine Nummer, einen Templatenamen und die benötigten Parameter eingibt (Aufruf des Endpoints aus Schritt 3).

Schritt 8: Finalisierung und Dokumentation

Erstelle eine README.md (Deutsch) mit Installationsanweisungen (Dependencies, DB-Setup, Starten von Backend/Frontend).

Stelle sicher, dass die TypeScript/Express-Anwendung eine klare API-Struktur und Dokumentation bietet.

Überprüfe alle Fehlerfälle, insbesondere bei API-Aufrufen, und sorge für robustes Logging.
