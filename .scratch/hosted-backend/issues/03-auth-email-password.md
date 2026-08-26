# 03: Sign-up and sign-in with email and password

**What to build:** A Student can create an account with email/password and sign in, replacing the navigation-only mock. Better Auth runs through its Drizzle adapter on D1, constructed per request. Signed-out visitors are redirected to sign-in; signed-in Students see their (still mocked) Course Library.

**Blocked by:** 02.

**Status:** ready-for-agent

- [x] Better Auth configured with the Drizzle adapter; its tables ship in a new migration
- [x] Sign-up creates a real account and session; sign-in establishes a session; sign-out ends it
- [x] The mock sign-up/sign-in screens submit to the real flow, including error feedback for wrong credentials
- [x] Requests requiring a Student reject anonymous callers
- [x] Better Auth's instance is created per request from that request's bindings, not at module scope
- [x] Integration tests cover sign-up, sign-in failure, and authenticated access

## Comments

Packages: `better-auth@1.7.2` and `@better-auth/drizzle-adapter@1.7.2` sit on the existing Drizzle 0.45.2 (`minimumReleaseAgeExclude` entries went into `pnpm-workspace.yaml` because those releases were younger than the lockfile's freshness floor). `createAuth(bindings, origin)` lives in `src/server/auth.ts`: built per request from `env.DB`, `env.BETTER_AUTH_SECRET`, and the incoming request origin, with the Drizzle adapter in sqlite mode mapped onto the four core tables and a fail-closed check that refuses a missing or short secret. The mount is `src/routes/api/auth/$.ts`: each GET/POST builds the instance from that request and hands off to `auth.handler`, and every server module imports dynamically so nothing auth-related reaches a client bundle.

Migration `drizzle/0001_violet_logan.sql` creates `user`, `session`, `account`, and `verification`. The Drizzle schema matches Better Auth 1.7.2's generated core output field for field; the CLI's relation constants are left out because the adapter consumes plain table mappings. Local and remote D1 both list migrations 0000 and 0001 applied with nothing pending.

UI: the sign-up/sign-in sheet posts through the browser client (`src/lib/auth-client.ts`) with pending state and one generic error line per mode; responses never reveal whether an address exists. Google stays visibly disabled until ticket 04, and the mock Allowlist screen is removed until ticket 05 lands the real check. Header menu and settings/account both call real sign-out, navigate away only once the server confirms invalidation, and stay put with a retryable message on failure.

Protection has two halves plus an inner wall. `studentGate` middleware on the root route answers anonymous SSR page navigations with a literal 307 to `/sign-in`; `beforeLoad` repeats the same path-based check for client navigations; and protected server functions call `requireStudent(request)` themselves, because a route guard is UX rather than authorization. The ticket 02 proof read now calls `requireStudent`.

Tests in `test/auth.test.ts` drive the real Worker boundary on emulated D1 migrated by the existing setup: sign-up returning a session cookie, session reaching the mocked Course Library, valid sign-in alongside a wrong-password rejection with no cookie, duplicate-address rejection, anonymous redirect targets, `requireStudent` rejecting an anonymous Request and resolving a real session, and sign-out invalidation stranding the old cookie. Focused run passes 12/12; final full suite is 3 files, 14 tests, all green.

The HTTPS regression behind this change has its own focused test: sign-up over an https baseURL issues a `__Secure-` cookie name, and a plain page GET that sends no Origin header still resolves the session because resolution derives origin from `request.url`, matching the mounted auth handler.

A live local pass through `vite dev`: anonymous `/` sent 307 to `/sign-in`; posting the real sign-up form returned 200 and set a session cookie; `/` with that cookie returned 200 showing the course library; a wrong-password sign-in answered 401 with no cookie; sign-out returned 200 and the now-stale cookie redirected again.

Secrets never touched the repo. The local file is `.dev.vars`, which `.gitignore` keeps out of version control; production holds its own value as a Workers Secret; neither was ever committed or echoed. `pnpm cf-typegen` regenerated the Env types with `BETTER_AUTH_SECRET: string`, and the typing still demands a string at runtime before auth can construct. Final checks all exit 0: `pnpm typecheck`, `pnpm build`, full `pnpm test`, `git diff --check`. The client bundle carries only the browser auth client (no server factory, adapter, D1 schema, or secret), and a wrangler dry-run package contains no `.dev.vars` files or secret values.
