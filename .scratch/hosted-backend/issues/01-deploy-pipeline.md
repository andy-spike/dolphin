# 01: Deploy pipeline — the Worker serves the app

**What to build:** The existing (still mocked) app runs inside workerd during development and deploys to a production Worker, so the hosted model of ADR 0003 stops being a plan and becomes where every later slice lands. Nothing user-visible changes; this is the prefactor everything else stands on.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] The Cloudflare Vite plugin is first in the Vite config; `vite dev` serves SSR through workerd with no separate wrangler process
- [x] Wrangler config points at the framework server entry with `nodejs_compat` and a current compatibility date
- [x] `wrangler types` generates the Env type from bindings; TypeScript compiles against it
- [x] Secrets for local dev load from a `.dev.vars` file next to the wrangler config, gitignored
- [x] A deploy command builds and ships to production Workers; the deployed URL serves the mocked app
- [x] Vitest runs unit tests in CI-able shape with at least one smoke test per the stack ADR

## Comments

Verified everything that doesn't need Cloudflare credentials. Local dev through workerd returned HTTP 200, and the SSR HTML contains "course library". `pnpm cf-typegen`, `pnpm typecheck`, `pnpm build`, and `pnpm test` all pass. `wrangler deploy --dry-run` packaged the Worker and assets without errors. Production: `pnpm deploy` shipped the Worker and assets to https://dolphin-web.ansanabria.workers.dev (version 17a4ce8f-de24-436d-ace9-fa7520178be0), and curl against that URL returned HTTP 200 with content-type text/html and the mocked Course Library SSR HTML containing "course library".
