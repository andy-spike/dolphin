# Hosted technology stack

Dolphin is a TypeScript monorepo managed with pnpm workspaces. TanStack Start and TanStack Query run the hosted web application on Cloudflare Workers. TanStack AI provides the Generator, Tutor, Tailor Mode, chat primitives, Server-Sent Events, and Harness adapters. Daytona runs every Harness and Code Exercise in an isolated Sandbox.

Cloudflare D1 stores relational data. R2 stores Course Folders, Sources, and exports. Cloudflare Queues dispatch durable Agent Jobs. Better Auth provides email/password and Google OAuth. The private beta uses an allowlist and meters no per-Student allowance; Course Lock is the only limit Dolphin imposes. Email verification, magic links, and password recovery are not part of v1.

Code Exercises use a fresh, network-disabled Daytona Sandbox for each run. The first release supports TypeScript and Python. Agent Sandboxes can access only the selected Harness, approved Sources, and web search when the Brief enables it. Server-Sent Events stream Agent Job activity to the browser. Vitest tests units and integrations; Playwright follows for end-to-end tests.
