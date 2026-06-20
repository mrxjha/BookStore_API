# Facilitation Guide — Bookstore REST API
### Day 1: Git, APIs & the Developer Mindset · Vizuara Bootcamp

> Your complete playbook to facilitate this session and shine. Covers all 4 parts:
> **(1) Preparation · (2) Session Structure · (3) What & How to Present · (4) Documents.**

---

## PART 1 — Preparation (Do This Before the Session)

### 1.1 Build it yourself first ✅ (DONE)
You have already generated the full API from `PROMPTS.md`. We tested all 13 endpoint cases live and **everything passes**:

| # | Test | Result |
|---|------|--------|
| 1 | GET /health | ✅ OK + uptime |
| 2 | GET /api/books | ✅ 5 seeded books + pagination block |
| 3 | ?category=Fiction | ✅ 2 books |
| 4 | ?search=history | ✅ filtered correctly |
| 5 | POST new book | ✅ 201 Created |
| 6 | GET /books/:id | ✅ returns it |
| 7 | PUT price update | ✅ partial update works |
| 8 | GET /api/stats | ✅ aggregates correct |
| 9 | DELETE | ✅ "Book deleted successfully" |
| 10 | POST missing title | ✅ 400 + details |
| 11 | Pagination limit=2 | ✅ totalPages=3 |
| 12 | Duplicate ISBN | ✅ 409 |
| 13 | Unknown route | ✅ 404 |

### 1.2 ⚠️ The ONE thing you MUST know before presenting
The prompt says **`better-sqlite3`**, but your generated code uses **`node:sqlite`** (Node's *built-in* SQLite, `DatabaseSync`). This is a **real-world lesson, not a bug**:

- `better-sqlite3` is a *native* module that must be **compiled** during install. On Windows it often fails unless Visual Studio C++ Build Tools are installed.
- Claude adapted by using `node:sqlite`, which ships inside Node 22.5+ and needs **no install/compilation**.
- Trade-off: it prints `ExperimentalWarning: SQLite is an experimental feature`. Harmless. Requires Node ≥ 22.5 (you have v25 ✅).

**Why this matters for your session:** participants on different Node versions or without build tools may hit different outcomes. Knowing *why* lets you confidently unblock them — this is exactly the "developer mindset" the day is about.

### 1.3 Demo machine checklist
- [ ] Node 20+ (ideally 22.5+ so `node:sqlite` works) — verify with `node --version`
- [ ] Claude Code installed and logged in
- [ ] Anthropic API key configured
- [ ] Terminal font ≥ 16pt, editor + terminal side-by-side
- [ ] A REST client ready: PowerShell `Invoke-RestMethod`, `curl.exe`, or Postman/Bruno
- [ ] This folder open, plus a **blank** folder ready to build live from scratch
- [ ] Delete `bookstore.db` before demo so the live audience sees fresh seeding

---

## PART 2 — Session Structure (90–120 mins)

| Time | Segment | What happens |
|------|---------|--------------|
| 0–10 | **Opening** | Intro yourself, state goal, quick poll: "Who's built a REST API?" |
| 10–25 | **Concepts** | Git mindset · What's a REST API (endpoints, GET/POST, JSON, status codes) · Claude Code as pair programmer |
| 25–55 | **Live build** | Run Prompts 1→2 from `PROMPTS.md` in a fresh folder, narrating your thinking |
| 55–75 | **Live testing** | Run Prompt 3 — hit every endpoint, show 201/400/404/409 in action |
| 75–95 | **Participant turn** | Everyone builds it; you circulate and unblock |
| 95–110 | **Reference + recap** | Compare to reference, walk the verification checklist |
| 110–120 | **Q&A** | Open floor |

**Goal statement to open with:**
> "By the end of today, each of you will have built a real, working REST API with a database — driven entirely by describing what you want to Claude Code, then verifying it. That describe → build → verify → iterate loop is the whole game."

---

## PART 3 — What to Present & How

### 3.1 Slide deck (keep to ~8 slides)
1. **Title** — "Day 1: Git, APIs & the Developer Mindset" + your name
2. **What we'll build** — screenshot of `GET /api/books` JSON response
3. **The Claude Code loop** — *Describe → Build → Verify → Iterate* (one diagram)
4. **What is a REST API?** — restaurant analogy: endpoint = counter, GET = ask for menu, POST = place order, status codes = waiter's reply (200 OK, 404 not found, 400 you ordered wrong)
5. **Our API's endpoints** — the 7-endpoint table (below)
6. **Validation & status codes** — why 400 vs 409 vs 404 matters
7. **Live demo** — switch to terminal here
8. **Takeaways + resources**

**Endpoint table for slide 5:**
| Method | Path | Purpose |
|--------|------|---------|
| GET | /health | service alive check |
| GET | /api/books | list + filter + paginate |
| GET | /api/stats | aggregate numbers |
| GET | /api/books/:id | one book (404 if missing) |
| POST | /api/books | create (400 invalid, 409 dup ISBN) |
| PUT | /api/books/:id | partial update |
| DELETE | /api/books/:id | remove |

### 3.2 How to present (delivery tips)
- **Show, don't tell.** Your live terminal IS the presentation. Slides are just framing.
- **Narrate intent:** "I'm asking Claude to add validation *because* clients send bad data and we don't want a crash."
- **Make the status codes visible** — POST a book with no title and let them see the 400 + details array. That "aha" lands harder than any slide.
- **Embrace a wrong answer.** If Claude slips, debug it live. That's the real skill you're modeling.
- **Tell the `better-sqlite3` → `node:sqlite` story** (Part 1.2) when someone's install behaves differently. It makes you look deeply competent.
- **Ask back:** "What endpoint would you add next?" keeps energy up.

---

## PART 4 — Documents to Hand Out

### 4.1 Prerequisites (send 48h before) — see `HANDOUT_prerequisites.md`
### 4.2 Prompt cheat sheet (the live script) — see `HANDOUT_prompt_cheatsheet.md`
### 4.3 Verification checklist — already in `PROMPTS.md` (bottom)
### 4.4 Follow-up email (send after) — see `HANDOUT_followup.md`

---

## Suggested PROMPTS.md edits
See the chat for two small, optional rephrasings (the `better-sqlite3` note and a results-shape hint). The prompts work as-is — these only reduce confusion for participants.
