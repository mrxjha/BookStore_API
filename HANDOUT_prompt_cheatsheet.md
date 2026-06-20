# Live Prompt Cheat Sheet — Bookstore REST API
### Run these in order. Read the verification line after each.

---

## Step 0 — Fresh start
```
mkdir bookstore-api && cd bookstore-api && claude
```

## Prompt 1 — Initialize
```
Set up a Node.js REST API project:
- Create package.json with "type": "module"
- Install dependencies: express, cors
- Use Node's built-in node:sqlite (DatabaseSync) for the database — no native install needed
- Create folder structure: src/routes/ and src/middleware/
```
> 🗣️ Say: "Notice I told it to use the *built-in* SQLite so nobody gets stuck on a compile error."

## Prompt 2 — Build the API
*(Paste the full Prompt 2 spec from `PROMPTS.md` — database layer, validation middleware, routes, server.)*
> 🗣️ Say: "I'm describing the *contract* — endpoints, status codes, validation rules — and letting Claude write the code. Then I verify."

## Prompt 3 — Test it
```
Start the server with `node src/index.js`, then test every endpoint with curl and show output:
health, list, filter by category, search, create, get-by-id, update, stats, delete,
a missing-title create (expect 422), and a duplicate ISBN (expect 409).
Fix any errors before continuing.
```

---

## Manual test commands (PowerShell — copy/paste live)
```powershell
$b = "http://localhost:3000"
Invoke-RestMethod "$b/health"
(Invoke-RestMethod "$b/api/books").books
(Invoke-RestMethod "$b/api/books?category=technology").books
Invoke-RestMethod "$b/api/stats"

# Create (category must be in the allow-list; isbn 13 chars if present)
$body = @{title="Refactoring";author="Martin Fowler";price=44.99;category="technology";isbn="9780134757599";stock=8} | ConvertTo-Json
Invoke-RestMethod -Method Post "$b/api/books" -ContentType "application/json" -Body $body

# Validation error (expect 400 + details) — leave out the title.
# Use curl.exe to SEE the JSON body (Invoke-RestMethod only shows the status code).
curl.exe -s -X POST -H "Content-Type: application/json" -d '{\"author\":\"X\",\"price\":10,\"category\":\"fiction\"}' "$b/api/books"
```

## The money moments (pause and point these out)
- **201 Created** when a book is added
- **400** with a `details` array when you skip the title → validation working
- **409** on a duplicate ISBN → uniqueness working
- **404** on `/api/books/9999` → not-found handling
- Restart the server → data is still there → **the database persists**

## If something breaks
| Symptom | Fix |
|---------|-----|
| `Cannot find module better-sqlite3` | Reseed Prompt 1 telling Claude to use `node:sqlite` |
| `SQLite is an experimental feature` warning | Normal — ignore |
| `node:sqlite` not found | Node too old — need ≥ 22.5 |
| Port 3000 in use | `node src/index.js` after setting `$env:PORT=3001` |
