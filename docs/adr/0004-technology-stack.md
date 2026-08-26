# Hosted technology stack

Dolphin is a TypeScript monorepo managed with pnpm workspaces. TanStack Start and TanStack Query run the hosted web application on Cloudflare Workers. TanStack AI provides the Generator, Tutor, and Tailor modes, chat primitives, Server-Sent Events, and Harness adapters. Daytona runs every Harness and Code Exercise in an isolated Sandbox.

Cloudflare D1 stores relational data. R2 stores Course Folders, Sources, and exports. Cloudflare Queues dispatch durable Agent Jobs. Better Auth provides email/password and Google OAuth.

The private beta uses an Allowlist checked at sign-up only; accounts that already exist keep access. Dolphin meters no per-Student allowance. Course Lock is the only limit Dolphin imposes. Email verification, magic links, and password recovery are not part of v1. Addresses not on the Allowlist go to the Waiting list.

Dolphin deploys with the Cloudflare Vite plugin: workerd runs SSR inside `vite dev`, so bindings work during development without a separate wrangler process, and `wrangler deploy` ships the built output. The whole backend lives in one app (`apps/web`, server code under `src/server/`); Queues consumers and Durable Objects export from that same Worker rather than a split API package. Day-to-day development targets local emulated bindings; production is the only deployed environment until a second one earns its place. Dolphin runs on the Workers free tier: SQLite-backed Durable Objects (which are the kind ADR 0006 requires), and free-tier Queues whose limits fit beta traffic.

Drizzle stays pinned to the 0.x line for now because version 1's migration output needs a flatten step before `wrangler d1 migrations apply` works; upgrading is a routine follow-up. Better Auth connects through its Drizzle adapter on `drizzle-orm/d1`, constructs its instance per request from the request's bindings, and keeps the Google OAuth client secret in a Workers Secret.

Code Exercises use a fresh, network-disabled Daytona Sandbox for each run. The first release supports TypeScript and Python. Agent Sandboxes can access only the selected Harness, approved Sources, and web search when the Brief enables it. Server-Sent Events stream Agent Job activity to the browser.

Vitest tests units and integrations. Playwright follows for end-to-end tests.
