# Before Our Session — Setup Checklist (5 minutes)
### Bookstore REST API · Day 1 · Vizuara Bootcamp

Hi all 👋 — please complete this **before** we meet so we can spend our time building, not installing.

## Install
1. **Node.js 20 or newer** (22.5+ recommended) — https://nodejs.org
   Verify: open a terminal and run `node --version`
2. **Claude Code** — installed and signed in
3. **Anthropic API key** — configured in Claude Code

## Verify you're ready
Run these — both should print a version, not an error:
```
node --version
claude --version
```

## A REST client (pick one)
- PowerShell `Invoke-RestMethod` (built into Windows — nothing to install)
- `curl` (built into Windows 10+ as `curl.exe`)
- Postman or Bruno (optional GUI)

## What we'll build
A Bookstore REST API: a small web service that stores books in a database and lets you
list, search, add, update, and delete them — built entirely by prompting Claude Code.

## Heads-up (so nothing surprises you)
If you see a message like *"SQLite is an experimental feature"* — that's **normal and fine**.
We're using Node's built-in SQLite. I'll explain why in the session.

See you there! Bring questions.
