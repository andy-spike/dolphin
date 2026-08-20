# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript monorepo (pnpm workspaces): a Vite + React frontend and a Hono (Node) backend. Styling with Tailwind CSS v4 + shadcn/ui. Local store SQLite via Drizzle + better-sqlite3. Code Exercise sandbox via the Docker CLI. Live updates via SSE. Tests with Vitest (Playwright later). Agent core via one `AgentDriver` interface, first implementation on `@openai/codex-sdk`, second on `@anthropic-ai/claude-agent-sdk`. Full detail in `docs/adr/0004-technology-stack.md`.

## Users

A technical self-directed learner who wants to learn a specific topic — coding, system design, and similar. One student, on their own machine, no login. They install the local app, generate a course, and study alone with an agent tutor.

## Product Purpose

Dolphin turns a learner's goal into a personalized course. The student writes a Brief (topic, goal, difficulty, time budget, sources, web-search), iterates on a Syllabus with a generator agent, then studies a course of lessons and exercises with a tutor agent that explains, grades, and adapts the course. Success is that the student actually learns: they finish courses and can apply the material.

## Positioning

Dolphin drives the coding-agent SDKs already installed on the student's machine (Codex, Claude Code), so the student reuses their existing AI subscription instead of paying for a separate model API. Courses are markdown files the student owns, on their own machine. A neighboring tool cannot truthfully copy the "reuse your own subscription" mechanism.

## Operating Context

The student starts a local web server and works in a browser. They read lessons as markdown, answer Written Exercises in text, and write Code Exercises in their own editor while the app runs hidden tests in a Docker sandbox. Agent activity — syllabus chat, generation, tutor replies — streams live. Courses live in a Library with progress.

## Capabilities and Constraints

- Brief fields: topic, goal, difficulty, time budget, sources (URLs and local files), and a web-search toggle that governs both agents.
- Syllabus iteration is a free chat ending in agreement; the syllabus is a file the agents read.
- Course generation is whole-course-first and resumable. Each lesson has fixed sections: Concept, Examples, Exercises.
- Two exercise kinds: Written Exercises (free-form answer, tutor grades) and Code Exercises (hidden tests, any language with a standard Docker image and test runner).
- Tailor Mode may edit any lesson, including completed ones; an edited completed lesson returns to not-complete.
- Course states: Drafting, Generating, Ready, In Progress, Complete. One generation at a time. No review gate; the student can regenerate from the syllabus (progress resets).
- Domain terms are canonical in `CONTEXT.md`.
- Open: no version history for lessons in v1.

## Brand Commitments

The product name is "Dolphin" — final, not a working title. Visual world: "The Inky Learning Workspace" — a Flexoki-derived workspace, warm paper (#FFFCF0) and true ink (#100F0F) with fine neutral rules and one semantic blue (#205EA6). It replaces The Workshop Desk. See `DESIGN.md`. No logo, voice, or assets are established yet.

## Evidence on Hand

None. There are no testimonials, case studies, benchmarks, or screenshots. Future work must not fabricate any of these.

## Product Principles

1. Learning outcome beats generation speed.
2. The student owns their courses and data; everything stays local.
3. Reuse what the student already has: their subscription, their editor, their machine.
4. The agent is a partner, not a black box — iterate to agreement, then tutor and adapt.
5. Stay honest and simple: hidden tests, no ceremony, explicit states.
