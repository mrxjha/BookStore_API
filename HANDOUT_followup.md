# Thanks for Joining! — Recap & Next Steps
### Bookstore REST API · Day 1 · Vizuara Bootcamp

Great work today 🎉 You each built a working REST API backed by a real database.

## What you built
A Bookstore API with 7 endpoints — list/search/paginate, create, read, update, delete,
plus a stats endpoint — all with input validation and proper HTTP status codes.

## The takeaway
The loop you practiced is the whole craft:
> **Describe** what you want → **Build** with Claude Code → **Verify** against the spec → **Iterate.**

## Verify your own work (checklist)
- [ ] All 7 endpoints respond
- [ ] `?category=` and `?search=` filter correctly
- [ ] List is paginated (page/total metadata)
- [ ] Duplicate ISBN → 409
- [ ] Missing required field → 422 with an errors array
- [ ] Data survives a server restart (the .db file)
- [ ] `/api/stats` numbers are correct

## Stretch goals (try with Claude Code)
1. Add a `PATCH /api/books/:id/stock` endpoint to adjust stock by a delta.
2. Add sorting: `?sort=price&order=desc`.
3. Write a few automated tests (we'll go deeper on this on Day 4).

## Resources
- Workbook: https://modern-software-bootcamp.vercel.app/
- Your reference solution + prompts: in the `bookstore-api` folder

Questions? Reach out anytime. On to Day 2! 🚀
