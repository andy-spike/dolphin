# Technology stack

Dolphin is a TypeScript monorepo with two apps: a Vite + React frontend and a Hono (Node) backend, managed with pnpm workspaces. The backend is the long-lived process that drives the agent SDKs, orchestrates Docker, and streams to the browser.

The supporting choices:

- **UI styling**: Tailwind CSS v4 with shadcn/ui components.
- **Local store**: SQLite via Drizzle ORM on better-sqlite3, for progress and settings only.
- **Sandbox**: shell out to the Docker CLI (`docker run`) for Code Exercise test runs, rather than the dockerode library.
- **Live updates**: Server-Sent Events (SSE) for the server-to-browser link. The agent SDKs stream partial output to the server natively; SSE relays it to the browser. WebSocket was rejected as more than the one-way stream requires.
- **Testing**: Vitest for unit and integration tests now; Playwright for end-to-end tests later.
- **Agent driver**: one `AgentDriver` interface with the first implementation on `@openai/codex-sdk`; a Claude implementation on `@anthropic-ai/claude-agent-sdk` follows.

These are deliberately boring, proven tools. The unusual part of the system is the agent core (ADR-0001), not the web stack, so the web stack stays conventional.
