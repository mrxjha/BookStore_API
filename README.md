# Bookstore REST API

A SQLite-backed REST API with full CRUD operations, filtering, pagination, and validation — built with **Node.js (ESM)**, **Express 4**, and **express-validator**.

Part of the [Vizuara Modern Software Developer Bootcamp](https://modern-software-bootcamp.vercel.app/) — Day 1: Git, APIs & the Developer Mindset.

---

## Tech Stack

| Package | Purpose |
|---------|---------|
| `express` ^4.21 | HTTP server & routing |
| `cors` ^2.8 | Cross-origin access |
| `express-validator` ^7.2 | Declarative request validation |
| `node:sqlite` (built-in) | Synchronous file-backed SQLite (no native compilation needed) |

> **Note:** The official spec lists `better-sqlite3`. This project uses Node's built-in `node:sqlite` (`DatabaseSync`) because `better-sqlite3` requires native compilation which fails in certain corporate/Windows environments. The API contract is identical either way. Requires **Node 22.5+**.

---

## Requirements

- **Node.js 22.5+** (uses built-in `node:sqlite`)
- No database installation needed — SQLite file is created automatically

---

## Setup & Run

```bash
# Install dependencies
npm install

# Start server (port 3000 by default)
npm start

# Development mode with live reload
npm run dev

# Custom port
PORT=4000 npm start
```

Server starts at: `http://localhost:3000`

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/api/books` | List books with filtering & pagination |
| GET | `/api/stats` | Aggregate statistics |
| GET | `/api/books/:id` | Get a single book |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/:id` | Partial update |
| DELETE | `/api/books/:id` | Delete a book |

### Query Parameters for `GET /api/books`

| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category (exact, lowercase) |
| `search` | string | Case-insensitive search across title and author |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |

**Allowed categories:** `fiction` · `non-fiction` · `science` · `technology` · `history`

---

## Response Examples

### `GET /health`
```json
{ "status": "OK", "timestamp": "2026-06-20T06:30:14.947Z", "uptime": 23.93 }
```

### `GET /api/books`
```json
{
  "books": [
    {
      "id": 1, "title": "Clean Code", "author": "Robert C. Martin",
      "isbn": "9780132350884", "price": 39.99, "category": "technology",
      "stock": 20, "createdAt": "2026-06-20 06:29:51", "updatedAt": "2026-06-20 06:29:51"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

### `GET /api/stats`
```json
{
  "totalBooks": 5,
  "totalValue": 4063.50,
  "booksByCategory": { "technology": 2, "fiction": 1, "science": 1, "history": 1 },
  "averagePrice": 29.59
}
```

### `POST /api/books` — 201 Created
```json
{
  "title": "Refactoring",
  "author": "Martin Fowler",
  "price": 44.99,
  "category": "technology",
  "isbn": "9780134757599",
  "stock": 8
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Book created |
| 400 | Validation failed — `{ "error": "Validation failed", "details": [{ "field", "message" }] }` |
| 404 | Book not found / Route not found |
| 409 | Duplicate ISBN |
| 500 | Server error |

---

## Validation Rules

**POST (create):** `title` required (≤200 chars), `author` required, `price` required and > 0, `category` required and in allow-list, `isbn` optional but exactly 13 chars, `stock` optional non-negative integer.

**PUT (update):** All fields optional, same constraints apply when provided.

---

## Seed Data

On first start (empty database), these 5 books are seeded automatically:

| Title | Author | Category | Price |
|-------|--------|----------|-------|
| The Pragmatic Programmer | David Thomas & Andrew Hunt | technology | $49.99 |
| Dune | Frank Herbert | fiction | $15.99 |
| A Brief History of Time | Stephen Hawking | science | $18.99 |
| Clean Code | Robert C. Martin | technology | $39.99 |
| Sapiens | Yuval Noah Harari | history | $22.99 |

---

## Project Structure

```
bookstore-api/
├── package.json
├── src/
│   ├── index.js              # Express app, middleware, /health, error handlers
│   ├── database.js           # SQLite setup, schema, seed, data-access functions
│   ├── middleware/
│   │   └── validate.js       # express-validator rules + validate handler
│   └── routes/
│       └── books.js          # All 7 endpoints
└── PROMPTS.md                # Claude Code prompt scripts to rebuild from scratch
```

---

## Facilitation Materials

This repo includes a complete session facilitation kit for the Vizuara bootcamp:

| File | Purpose |
|------|---------|
| `PROMPTS.md` | Step-by-step Claude Code prompts to build the API |
| `FACILITATION_GUIDE.md` | Full facilitator playbook (prep, session structure, delivery tips) |
| `HOW_TO_RUN.md` | Run & test guide (Windows / PowerShell) |
| `HANDOUT_prerequisites.md` | Send to participants 48h before the session |
| `HANDOUT_prompt_cheatsheet.md` | Live prompt script + money moments |
| `HANDOUT_followup.md` | Post-session recap email |

---

## Built With

[Claude Code](https://claude.ai/code) — as part of the Vizuara AI bootcamp at Ramco Systems.
