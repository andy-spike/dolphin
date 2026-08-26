# 02: D1 + Drizzle migration loop

**What to build:** A D1 database bound to the Worker with Drizzle (0.x) on top, and the generate-then-apply migration workflow proven both locally and remotely. Verified by a server function that reads a trivial table and shows the result in the running app. Later tickets add real tables; this one proves the plumbing they will use.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] D1 binding declared; a server function reads through `drizzle-orm/d1` inside a request
- [ ] drizzle-kit generates SQL migrations into the directory wrangler applies from
- [ ] A first migration applies locally (`--local`) and remotely (`--remote`) with wrangler tracking applied state
- [ ] The read is demonstrated against real local data during `vite dev`
- [ ] A unit/integration test covers the server function with an emulated D1 binding
