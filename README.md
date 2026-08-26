# Dolphin

A hosted web application that generates personalized courses.

The student describes what they want to learn in a **Brief**, iterates on a **Syllabus** with the **Generator**, then studies the generated **Course** with help from the **Tutor**. Courses are markdown files in a Course Folder, kept in cloud storage.

Dolphin drives a Harness — Codex, Claude Code, or OpenCode — through a revocable Harness Connection, so the student reuses their existing subscription instead of paying for a separate model API. Each Harness runs in an isolated Sandbox, never on the student's own machine.

## Status

**Frontend only.** There is no backend yet. Every screen runs on synthetic data in `apps/web/src/mock/data.ts`, and only Lesson 3 of the first course is fully authored. Nothing generates a real course today, and signing in is a navigation rather than a check.

Every screen the product needs is built:

| Where the student is | Station |
|---|---|
| signed out | Sign in, sign up, the beta allowlist gate and its waiting list |
| — | Course Library, Brief, Settings, Not found |
| Drafting | Syllabus outline + Generator chat |
| Generating | Generating (resumable, lesson by lesson) |
| Ready / In Progress | Course Overview, then Lesson + Tutor margin |
| Complete | Course close |

Settings is three addresses, reached from the account cell in the station strip: **harness connections** (connect and revoke, which is what the whole product rests on), **usage** (what dolphin has spent on your harness subscription, and recent agent jobs), and **account**.

A flask icon at the bottom left opens a panel for switching mock states — empty library, a course lock, and the three fault states.

## Running it

Requires Node and pnpm.

```bash
pnpm install
pnpm dev
```

Then open the URL Vite prints.

```bash
pnpm build      # typecheck + production build
```

## Design

The visual world is **The Inky Learning Workspace** — a [Flexoki](https://stephango.com/flexoki)-derived palette on warm paper (`#FFFCF0`) and true ink (`#100F0F`), with Figtree for everything read and JetBrains Mono for everything measured. Blue carries action, focus and control; each of the five Course States carries its own Flexoki hue.

- [`DESIGN.md`](DESIGN.md) — the design system: tokens, type scale, components, and the rules behind them.
- [`CONTEXT.md`](CONTEXT.md) — the domain language. These terms are canonical; use them exactly.
- [`PRODUCT.md`](PRODUCT.md) — product purpose, users, constraints.
- [`docs/adr/`](docs/adr) — architecture decisions, including superseded ones.

## Stack

TypeScript monorepo (pnpm workspaces). TanStack Start and TanStack Query run the app as a single Cloudflare Worker; Tailwind CSS v4 styles it. The planned backend is TanStack AI driving every Harness and Code Exercise run in a Daytona Sandbox, Cloudflare D1 (via Drizzle) for relational data, R2 for Course Folders and Sources, Cloudflare Queues for durable Agent Jobs, and Better Auth for sign-in. A Durable Object per Course holds the Course Lock and streams Agent Job progress over SSE — see [`docs/adr/0004-technology-stack.md`](docs/adr/0004-technology-stack.md), [`0006`](docs/adr/0006-course-durable-object.md), and [`0007`](docs/adr/0007-harness-connection-credential-storage.md).

Fonts are self-hosted; the app makes no network requests to third parties.
