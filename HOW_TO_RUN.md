# How to Run & Test the Bookstore API (Windows / PowerShell)

A step-by-step guide to run the API and test it yourself.

---

## Part A — Run the API

### Step 1 — Open a terminal in the project folder
Open PowerShell and navigate into the folder:
```powershell
cd "c:\Users\nikh953adp2\OneDrive - Ramco Systems Limited\Desktop\Vizuara-bootcamp\bookstore-api"
```

### Step 2 — (First time only) install dependencies
This reads `package.json` and downloads `express` + `cors` into `node_modules`:
```powershell
npm install
```
> You can skip this if `node_modules` already exists — running it again is harmless.

### Step 3 — Start the server
```powershell
node src/index.js
```
You should see:
```
(node:xxxxx) ExperimentalWarning: SQLite is an experimental feature...   <- normal, ignore
Bookstore API listening at http://localhost:3000
```
The API is now running. **Leave this window open** — closing it or pressing `Ctrl+C` stops the server.

---

## Part B — Test it

Two easy ways. Pick whichever you like.

### Option 1 — Browser (quickest, for GET requests only)
Open these URLs in your browser:
- http://localhost:3000/health
- http://localhost:3000/api/books
- http://localhost:3000/api/stats
- http://localhost:3000/api/books?category=technology

> Note: `category` must be **lowercase**, one of: `fiction`, `non-fiction`, `science`, `technology`, `history`.

### Option 2 — PowerShell (tests everything, including POST/PUT/DELETE)
Open a **SECOND** PowerShell window (keep the server running in the first), then run these one at a time:

```powershell
$b = "http://localhost:3000"

# 1. Health check
Invoke-RestMethod "$b/health"

# 2. List all books
Invoke-RestMethod "$b/api/books"

# 3. Filter by category (lowercase from the allow-list)
(Invoke-RestMethod "$b/api/books?category=technology").books

# 4. Search (case-insensitive, matches title OR author)
(Invoke-RestMethod "$b/api/books?search=time").books

# 5. Create a book (POST) — category must be in the allow-list; isbn (if given) must be 13 chars
$body = @{title="Refactoring"; author="Martin Fowler"; price=44.99; category="technology"; isbn="9780134757599"; stock=8} | ConvertTo-Json
$new = Invoke-RestMethod -Method Post "$b/api/books" -ContentType "application/json" -Body $body
$new        # shows the created book with its new id

# 6. Get that book by its id
Invoke-RestMethod "$b/api/books/$($new.id)"

# 7. Update its price (PUT)
$update = @{price=34.99} | ConvertTo-Json
Invoke-RestMethod -Method Put "$b/api/books/$($new.id)" -ContentType "application/json" -Body $update

# 8. Stats
Invoke-RestMethod "$b/api/stats"

# 9. Delete it
Invoke-RestMethod -Method Delete "$b/api/books/$($new.id)"
```

**Error cases** (these are *supposed* to fail — that proves validation works):
```powershell
# Missing title -> should return 400 with a "details" array
$bad = @{author="No Title"; price=10; category="fiction"} | ConvertTo-Json
Invoke-RestMethod -Method Post "$b/api/books" -ContentType "application/json" -Body $bad

# A book id that doesn't exist -> should return 404
Invoke-RestMethod "$b/api/books/9999"

# Duplicate ISBN -> should return 409
$dup = @{title="Dup"; author="X"; price=5; category="fiction"; isbn="9780441013593"} | ConvertTo-Json
Invoke-RestMethod -Method Post "$b/api/books" -ContentType "application/json" -Body $dup
```
When these fail, PowerShell prints a red error containing `(400)`, `(404)`, or `(409)` — **that is the correct, expected result.** To see the JSON error body, use `curl.exe -s` instead of `Invoke-RestMethod`.

---

## Part C — Stop the server
Go back to the **first** window (where the server is running) and press:
```
Ctrl + C
```

---

## Quick troubleshooting

| What you see | What it means / fix |
|---|---|
| `SQLite is an experimental feature` | Normal. Ignore it. |
| `category=Technology` returns empty `books: []` | Categories are lowercase: `fiction`, `non-fiction`, `science`, `technology`, `history`. |
| `Error: listen EADDRINUSE :::3000` | Port busy. Use another port: `$env:PORT=3001; node src/index.js` |
| `Cannot find module 'express'` | You skipped Step 2 — run `npm install` |
| Red `(422)` / `(404)` / `(409)` errors during testing | Expected for the error-case tests above |
| `node` is not recognized | Node isn't installed / not on PATH — reinstall from nodejs.org |

---

## Demo tip
Before the session, delete the database file so the audience watches it freshly create and seed 5 books on startup:
```powershell
Remove-Item bookstore.db*
```
Then start the server. Afterwards, stop and restart **without** deleting — the data is still there. That live moment is the best way to teach "the database persists."
