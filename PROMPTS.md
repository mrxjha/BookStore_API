# Bookstore API — Build Prompts

Use these prompts with Claude Code to build this project from scratch. The contract below
matches the official reference solution at
https://modern-software-bootcamp.vercel.app/project/day-1-bookstore-api.html

> **Windows note:** The official stack lists `better-sqlite3`, which is a *native* module
> that compiles on install. On corporate/Windows machines this often fails
> (`node-gyp` cannot fetch Node headers / `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`).
> This project instead uses Node's built-in **`node:sqlite`** (`DatabaseSync`), which needs
> no compilation and requires **Node 22.5+**. The API contract is identical either way.

## Setup

```
mkdir bookstore-api && cd bookstore-api && claude
```

---

## Prompt 1 — Initialize the project

```
Set up a Node.js REST API project:
- Create package.json with "type": "module" and scripts: start ("node src/index.js")
  and dev ("node --watch src/index.js")
- Install dependencies: express, cors, express-validator
- For the database use Node's built-in node:sqlite (DatabaseSync) — do NOT use
  better-sqlite3 (it needs native compilation and fails on this machine)
- Create the folder structure: src/routes/ and src/middleware/
```

---

## Prompt 2 — Build the API

```
Build a Bookstore REST API with the following specification:

Database layer (src/database.js) using node:sqlite (DatabaseSync), file bookstore.db at
project root, PRAGMAs journal_mode=WAL and foreign_keys=ON:
- books table:
    id INTEGER PRIMARY KEY AUTOINCREMENT
    title TEXT NOT NULL
    author TEXT NOT NULL
    isbn TEXT UNIQUE (nullable)
    price REAL NOT NULL CHECK (price > 0)
    category TEXT NOT NULL CHECK (category IN ('fiction','non-fiction','science','technology','history'))
    stock INTEGER DEFAULT 0
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
- On startup, only if the table is empty, seed these 5 books (single transaction):
    The Pragmatic Programmer / David Thomas & Andrew Hunt / 9780135957059 / 49.99 / technology / 25
    Dune / Frank Herbert / 9780441013593 / 15.99 / fiction / 40
    A Brief History of Time / Stephen Hawking / 9780553380163 / 18.99 / science / 30
    Clean Code / Robert C. Martin / 9780132350884 / 39.99 / technology / 20
    Sapiens / Yuval Noah Harari / 9780062316097 / 22.99 / history / 35
- Export: getBooks({category, search, page, limit}), getBookById(id), createBook(data),
  updateBook(id, data), deleteBook(id), getStats(), isbnExists(isbn, excludeId)

Validation middleware (src/middleware/validate.js) using express-validator:
- createBookValidation: title required (≤200 chars), author required, price required and > 0,
  category required and in the allow-list, isbn optional but exactly 13 chars when present,
  stock optional non-negative integer
- updateBookValidation: same rules but every field .optional()
- validate: on failure return HTTP 400 with { error: "Validation failed",
  details: [{ field, message }] }

Routes (src/routes/books.js) — register /stats BEFORE /books/:id:
- GET    /api/books        ?category= ?search= ?page= ?limit= (default 10).
                           search is case-insensitive across title AND author.
                           Order by createdAt DESC. Returns { books: [...],
                           pagination: { page, limit, total, totalPages } }
- GET    /api/stats        { totalBooks, totalValue (sum price*stock, 2dp),
                           booksByCategory: { category: count }, averagePrice (2dp) }
- GET    /api/books/:id    full book; 404 { error: "Book not found" } if missing
- POST   /api/books        validate; 201 created book; 409
                           { error: "A book with this ISBN already exists" } on duplicate isbn
- PUT    /api/books/:id    partial update; bump updatedAt; 404 if missing; 409 on dup isbn;
                           empty body {} returns the unchanged book
- DELETE /api/books/:id    { message: "Book deleted successfully" }; 404 if missing
- Each route's 500 path returns a specific message, e.g. { error: "Failed to fetch books" }

Server (src/index.js):
- cors() + express.json()
- GET /health -> { status: "OK", timestamp, uptime }
- Mount routes at /api
- 404 handler -> { error: "Route not found" }
- Global error handler -> { error: message } with err.status || 500
- Listen on process.env.PORT || 3000
```

---

## Prompt 3 — Test it

```
Start the server with `node src/index.js`, then test every endpoint with curl/Invoke-RestMethod.
Verify: list returns { books, pagination }; ?category=technology and ?search=time filter
correctly; POST a valid book returns 201; POST with a missing title returns 400 with a
details array; a duplicate ISBN returns 409; GET an unknown id returns 404; PUT bumps
updatedAt; stats math is correct. Fix any errors before continuing.
```

---

## Verification checklist

- [ ] GET /health returns 200 with status "OK", ISO timestamp, numeric uptime
- [ ] GET /api/books returns `{ books, pagination }`, newest first (createdAt DESC)
- [ ] `?category=technology` returns only technology books; total reflects the filtered set
- [ ] `?search=` matches case-insensitively across BOTH title and author
- [ ] Pagination: totalPages = ceil(total/limit); out-of-range page → empty books, real totals
- [ ] GET /api/books/:id → full book; 404 for missing or non-numeric id (not 500)
- [ ] POST valid → 201 with server-set id, createdAt, updatedAt
- [ ] POST/PUT invalid → 400 `{ error: "Validation failed", details: [...] }`; never writes DB
- [ ] Duplicate ISBN → 409 "A book with this ISBN already exists"
- [ ] PUT partial update changes only supplied fields and bumps updatedAt; empty body unchanged
- [ ] DELETE → 200 "Book deleted successfully"; 404 if missing
- [ ] GET /api/stats → correct totalBooks, totalValue, booksByCategory, averagePrice
- [ ] Data persists across restarts; seed runs only on an empty table
- [ ] Unknown route → 404 "Route not found"
