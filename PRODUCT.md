# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript monorepo managed with pnpm workspaces. TanStack Start and TanStack Query run the hosted web application on Cloudflare Workers. TanStack AI provides the Generator, Tutor, Tailor Mode, chat primitives, Server-Sent Events, and Harness adapters. Cloudflare D1 stores relational data, R2 stores Course Folders and Sources, and Queues dispatch durable Agent Jobs. Daytona provides isolated Sandboxes. Better Auth provides email/password and Google OAuth. Tests use Vitest, with Playwright planned for end-to-end coverage. Full detail is in `docs/adr/0004-technology-stack.md`.

## Users

A technical self-directed learner who wants to learn a specific Topic — coding, system design, and similar. The Student signs in to the hosted application, creates a Course, and studies it with the Tutor.

## Product Purpose

Dolphin turns a learner's goal into a personalized course. The student writes a Brief (topic, goal, difficulty, time budget, sources, web-search), iterates on a Syllabus with a generator agent, then studies a course of lessons and exercises with a tutor agent that explains, grades, and adapts the course. Success is that the student actually learns: they finish courses and can apply the material.

## Positioning

Dolphin connects the Student's chosen Harness through a revocable Harness Connection, so they use their existing Harness subscription instead of a separate model API. Each Course is generated from that Student's Brief and kept in a Course Folder. A neighboring tool cannot truthfully copy the "use your own Harness subscription" mechanism.

## Operating Context

The Student signs in through a browser. They read Lessons as markdown, answer Written Exercises in text, and complete Code Exercises in an isolated Sandbox. Agent Job activity — Syllabus chat, generation, and Tutor replies — streams live. Courses live in the Course Library with Progress.

## Capabilities and Constraints

- Brief fields: Topic, Goal, Difficulty, Time Budget, Sources (public HTTPS URLs or uploaded PDF, markdown, and text files), and a web-search toggle that governs the Generator and Tutor.
- Syllabus iteration is a free chat ending in agreement. The Syllabus is kept with the Course and read by both agents.
- Course generation is whole-course-first and resumable. Each Lesson has Concept, Examples, and Exercises.
- Two Exercise kinds: Written Exercises (free-form answer, Tutor checks) and Code Exercises (hidden tests in a fresh, network-disabled Sandbox). The first release supports TypeScript and Python.
- Tailor Mode may edit any Lesson, including completed Lessons. An edited completed Lesson returns to not complete.
- Course States are Drafting, Generating, Ready, In Progress, and Complete. A Course Lock prevents another Agent Job from changing the Course while Tailor Mode works.
- The private beta uses an allowlist and fixed Student Quotas. Email verification, magic links, and password recovery are out of scope for v1.
- Domain terms are canonical in `CONTEXT.md`.
- Open: no version history for lessons in v1.

## Brand Commitments

The product name is "Dolphin" — final, not a working title. Visual world: "The Inky Learning Workspace" — a Flexoki-derived workspace, warm paper (#FFFCF0) and true ink (#100F0F) with fine neutral rules and one semantic blue (#205EA6). It replaces The Workshop Desk. See `DESIGN.md`. No logo, voice, or assets are established yet.

## Evidence on Hand

None. There are no testimonials, case studies, benchmarks, or screenshots. Future work must not fabricate any of these.

## Product Principles

1. Learning outcome beats generation speed.
2. A Student controls each Harness Connection and the Course it generates.
3. Reuse the Student's existing Harness subscription.
4. The Generator and Tutor are partners, not black boxes — iterate to agreement, then teach and adapt.
5. Stay honest and simple: hidden tests, explicit Course States, and clear Quota boundaries.
