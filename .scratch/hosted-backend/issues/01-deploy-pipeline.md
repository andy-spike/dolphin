# 01: Deploy pipeline — the Worker serves the app

**What to build:** The existing (still mocked) app runs inside workerd during development and deploys to a production Worker, so the hosted model of ADR 0003 stops being a plan and becomes where every later slice lands. Nothing user-visible changes; this is the prefactor everything else stands on.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The Cloudflare Vite plugin is first in the Vite config; `vite dev` serves SSR through workerd with no separate wrangler process
- [ ] Wrangler config points at the framework server entry with `nodejs_compat` and a current compatibility date
- [ ] `wrangler types` generates the Env type from bindings; TypeScript compiles against it
- [ ] Secrets for local dev load from a `.dev.vars` file next to the wrangler config, gitignored
- [ ] A deploy command builds and ships to production Workers; the deployed URL serves the mocked app
- [ ] Vitest runs unit tests in CI-able shape with at least one smoke test per the stack ADR
