# Hosted backend: real Dolphin behind the mocked frontend

The frontend is complete and fully mocked. The seven ADRs describe the backend that must exist behind it. This feature tracks the vertical slices that build it.

## Platform constraints (decided, see docs/adr/0004)

- One app on Cloudflare Workers; server code lives inside the existing web app under `src/server/`.
- Cloudflare Vite plugin runs workerd during `vite dev`; deploy via wrangler. Local-first development.
- Workers free tier; SQLite-backed Durable Objects; Drizzle pinned to 0.x; Better Auth via its Drizzle adapter constructed per request.
- Allowlist checks at sign-up only; existing accounts keep access. Waiting list is a separate list (see CONTEXT.md).
- Harness Connection credentials are an encrypted D1 column keyed by a Workers Secret, decrypted only when injected into a Sandbox (ADR 0007).

## Sequencing decisions

- Codex is the first Harness adapter; Claude Code and OpenCode follow once the path is proven.
- Every ticket carries its own Vitest coverage where unit/integration tests make sense; there is no separate test-infrastructure ticket.
- Mocks are replaced screen by screen as each slice lands; untouched screens keep running on synthetic data.
- Infrastructure tickets prove themselves with a trivial verifiable read before real features depend on them.

## Ticket graph

```
01 → 02 → 03 → {04, 05, 06, 07}
07 → 08 → 09 → {10, 11}
06 → 12 → 13 (needs 09) → 14 → 15 → {16, 17, 18, 19, 20}
21 needs 10 and 15
```

Parallel work is expected: after 03, four tracks open (auth providers, library, connections).
