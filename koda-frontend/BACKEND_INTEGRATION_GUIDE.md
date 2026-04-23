# Guida all'Integrazione Backend - KODA Kiosk

Questo documento descrive la struttura dati attuale del frontend del totem KODA e fornisce le specifiche necessarie per sviluppare un backend (es. in Spring Boot, Node.js, etc.) in grado di gestire e configurare dinamicamente reparti, articoli e l'emissione dei ticket.

---

## 1. Stato Attuale del Frontend

Attualmente il frontend utilizza dei "mock" (dati finti) per funzionare senza un vero backend collegato:

- **Reparti (Departments):** Caricati dinamicamente ma da un file statico locale situato in `public/config/departments.json` tramite il `ConfigService`.
- **Articoli (Products):** Attualmente inseriti in modo "hardcoded" (fissi nel codice) all'interno dell'array `productDatabase` nel componente `home.ts`.
- **Emissione Ticket:** Simulata dal `TicketService` che genera numeri casuali e stima tempi di attesa fittizi.

L'obiettivo del backend sarà sostituire questi mock fornendo delle vere API REST.

---

## 2. Modelli Dati (Data Models)

Per essere compatibile con il frontend, il backend dovrà esporre le entità utilizzando le seguenti strutture JSON.

### 2.1 Modello: Reparto (`Department`)
Rappresenta una categoria principale del chiosco (es. Macelleria, Pescheria).

```json
{
  "id": "macelleria",
  "name": "Macelleria",
  "icon": "🥩",
  "color": "bg-rose-500/20 text-rose-100 border-rose-500/30"
}
```
**Dettagli dei campi:**
- `id` (String): Identificativo univoco del reparto (solitamente minuscolo e senza spazi).
- `name` (String): Nome visualizzato all'utente sul totem.
- `icon` (String): Un'emoji o il percorso di un'icona SVG da mostrare.
- `color` (String): Classi utility di Tailwind CSS per gestire l'aspetto grafico (sfondo, testo, bordo). **Nota:** Il backend dovrà permettere all'amministratore di assegnare dei colori predefiniti o di generare queste classi dinamicamente.

### 2.2 Modello: Articolo (`Product`)
Rappresenta un singolo prodotto associato a un reparto, ricercabile tramite la tastiera virtuale.

```json
{
  "name": "Mortadella Bologna",
  "departmentId": "salumeria",
  "departmentName": "Salumeria",
  "description": "Confezionata artigianalmente, con pistacchi...",
  "price": "€ 1.80 /etto",
  "ingredients": "Carne di suino, Tripping di suino, Sale...",
  "allergens": ["Pistacchi"]
}
```
**Dettagli dei campi:**
- `name` (String): Nome del prodotto.
- `departmentId` (String): Chiave esterna che collega il prodotto al suo reparto di appartenenza.
- `departmentName` (String): *Opzionale* dal backend se si fa la join lato frontend, ma attualmente richiesto dal componente di ricerca.
- `description` (String): Descrizione completa del prodotto mostrata nei dettagli.
- `price` (String): Prezzo formattato (es. con unità di misura come "/etto" o "/kg").
- `ingredients` (String): Lista degli ingredienti.
- `allergens` (Array di Stringhe): Lista degli allergeni per evidenziarli graficamente.

### 2.3 Modello: Ticket (`TicketResponse`)
La risposta restituita dopo la richiesta di accodamento.

```json
{
  "ticketNumber": "S12",
  "reparto": "salumeria",
  "timestamp": "2026-04-23T10:30:00Z",
  "estimatedWaitMinutes": 5
}
```

---

## 3. Specifiche API REST (Da implementare sul Backend)

Si consiglia di creare le seguenti API endpoints sul nuovo backend:

### Gestione Reparti
- `GET /api/v1/departments` -> Restituisce l'array di tutti i reparti configurati.
- *(Opzionale per backoffice)* `POST /api/v1/departments`, `PUT /api/v1/departments/{id}`, ecc.

### Gestione Articoli
- `GET /api/v1/products` -> Restituisce tutti i prodotti (utile per la ricerca globale sulla home).
- `GET /api/v1/departments/{departmentId}/products` -> Restituisce i prodotti di un singolo reparto.
- *(Opzionale per backoffice)* `POST /api/v1/products`, ecc.

### Gestione Eliminacode (Ticket)
- `POST /api/v1/tickets/issue` -> Richiede un nuovo ticket.
  - **Body (Richiesta):** `{ "departmentId": "salumeria" }`
  - **Risposta:** Oggetto `TicketResponse` come descritto sopra.

---

## 4. Prossimi Passi: Come Aggiornare il Frontend

Una volta che il backend sarà pronto e raggiungibile, andranno fatte le seguenti modifiche al codice frontend (Angular):

1. **Configurare gli Environment:**
   Creare o modificare `environment.ts` aggiungendo l'URL del backend (es. `apiUrl: 'http://localhost:8080/api/v1'`).
2. **Aggiornare `ConfigService`:**
   Sostituire `private configUrl = '/config/departments.json';` con la chiamata vera e propria all'endpoint `/api/v1/departments`.
3. **Creare un `ProductService`:**
   Eliminare il mock `productDatabase` in `home.ts` e sostituirlo con una chiamata HTTP (es. `this.productService.getAllProducts()`) da eseguire in fase di `ngOnInit()`.
4. **Aggiornare `TicketService`:**
   Modificare il metodo `issueTicket()` per inviare una vera richiesta `HTTP POST` invece di usare le funzioni `Math.random()`.
