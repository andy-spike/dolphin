# 02: D1 + Drizzle migration loop

**What to build:** A D1 database bound to the Worker with Drizzle (0.x) on top, and the generate-then-apply migration workflow proven both locally and remotely. Verified by a server function that reads a trivial table and shows the result in the running app. Later tickets add real tables; this one proves the plumbing they will use.

**Blocked by:** 01.

**Status:** ready-for-agent

- [x] D1 binding declared; a server function reads through `drizzle-orm/d1` inside a request
- [x] drizzle-kit generates SQL migrations into the directory wrangler applies from
- [x] A first migration applies locally (`--local`) and remotely (`--remote`) with wrangler tracking applied state
- [x] The read is demonstrated against real local data during `vite dev`
- [x] A unit/integration test covers the server function with an emulated D1 binding

## Comments

Verified with database `dolphin-web` (id `b157feb4-4a4d-4b1e-938d-74748f4ff4ae`), bound as `DB` in `apps/web/wrangler.jsonc` with `migrations_dir: "drizzle"`. Drizzle 0.45.2 / drizzle-kit 0.31.10 generate into that same directory (`pnpm db:generate` → `drizzle/0000_freezing_jamie_braddock.sql`, which creates `migration_check` and seeds row `(1, 'd1-drizzle-plumbing')`). The read lives in `src/server/db/read-proof.ts` (takes the `D1Database` as an argument, builds Drizzle from it), wrapped by the `createServerFn` handler in `src/server/db/proof-query.ts` and called from the `/` route loader, which renders `d1 check: d1-drizzle-plumbing` under the mocked library screen and fails soft if the table is missing.

Migration loop: `pnpm db:migrate:local` applied the first migration to local D1, `pnpm db:migrate:remote` applied it to remote D1, and both `db:list:*` scripts then report no pending migrations (wrangler tracks applied state in `d1_migrations`). Row evidence from both databases via `wrangler d1 execute DB --command "SELECT id, note FROM migration_check"`: local returns `{id: 1, note: "d1-drizzle-plumbing"}`, remote (served from colo MIA) returns the same row. Live proof: `vite dev` + `curl /` returned HTTP 200 with SSR HTML containing `d1-drizzle-plumbing` (rendered text plus dehydrated loader data) alongside the intact "course library" screen.

Tests use Cloudflare's documented architecture: Node-side `readD1Migrations()` in `vitest.config.ts` injects the serialized migrations through Vite `define`, and `test/setup/apply-migrations.ts` applies them once per file with `applyD1Migrations(env.DB, ...)` from inside workerd, so no Node-only code is imported by tests. `test/d1-migration.test.ts` asserts `readProofRow(env.DB)` finds the seed row (red-to-green shown twice: harness crash before removing the broken bundler workaround, then `Cannot find package '@/server/db/read-proof'` before the module existed). Focused test passes across three consecutive runs. Final checks all exit 0: `pnpm cf-typegen`, `pnpm typecheck`, `pnpm build` (drizzle stays out of `dist/client` — the handler imports it dynamically server-side only), full `pnpm test` (2 files, 2 tests), and `git diff --check`.
