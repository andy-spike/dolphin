---
version: 1
slug: "apps-web-src-app-tsx"
primary_target: "apps/web/src/App.tsx"
related_targets: ["apps/web/src/stations","apps/web/src/components"]
---

# Study spine

Scope: the whole app shell and its six stations. Visitor mode: Operate.

## Audience and job

One Student, alone on their own machine, in a browser tab beside their editor. Two sittings dominate: the ten minutes that create a Course, and the many hours that study one. Success is finishing Courses, not generating them.

## Chosen direction

**Inky Learning Workspace**, polished against stephango.com/flexoki — the reference implementation the Student named. Flexoki palette kept; the type system and the use of colour reworked to match how that page actually behaves.

The app is a study surface. A 56px neutral rail (64px at md) is the only permanent furniture — the mark, Library, the open Course, the agent lamp. Everything right swaps with Course State.

One face, Figtree Variable, carries every word read; scale comes from weight (400/500/600) and tracking, not from a display cut. JetBrains Mono carries only the machine voice: counts, states, paths, filenames, code, key names. Display is capped at 3.25rem — the reference sets its own h1 at 33px, and the previous 3.75rem serif masthead read as a poster rather than a workspace.

Colour does two jobs and no others. Blue is action, focus and control. Each of the five Course States owns a Flexoki hue, running cool → warm → green across the lifecycle.

| Course State | Station |
|---|---|
| Drafting | Syllabus outline + Generator chat |
| Generating | Generating (linear list, big count) |
| Ready / In Progress | Lesson (39rem + hanging margin) + Tutor margin |
| Complete | Course close |

## Memorable moment

The Lesson page: a 2.5rem Figtree title with its ordinal hanging in the margin, one 39rem column of prose, and the section name — Concept, Examples, Exercises — set in the left margin and sticky, so it stays beside the Student as they read. The Tutor speaks unboxed from the right, the way a margin note is set.

## Structural decisions that cost something

- **Serif out, Figtree in.** The high-contrast serif read as a costume on a tool used for hours. Figtree is the soft end of humanist-geometric — open apertures, rounded joins — and it keeps the two-face system intact. Losing Literata's `opsz` axis means weight and tracking carry the whole hierarchy instead.
- **The measure is 39rem** (~72ch) — retuned for Figtree at 17px.
- **Course State is hue-coded.** The previous build banned this; the reference page's whole personality is its palette, and a Library of five neutral rows was the flattest thing in the app. Two published Flexoki 600 tones (green, cyan) miss 4.5:1 on paper at label size, so both are darkened one step.
- **Hover washes are the solid tone at 10%, not Flexoki 50 tints.** The published tints differ enormously in strength — orange-50 shouts where purple-50 is nearly neutral — so a per-hue tint made identical interactions feel unequal.
- **Keys are visible.** `←` / `→` walk the Course, and the stepper reveals a key cap on hover.
- **The Library is an index, not a table.** No header row, no container box: a two-line masthead, a heavy `ink/85` opening rule, and numbered rows. Hover warms and tints; nothing moves.
- **One progress idiom, the Spine** — a bar notched once per unit, used for Lessons and for hidden tests. Notches are cut at exact percentages so segments stay even at any width.
- **State is a mark, not a chip.** A dot plus its name in the State's own hue, no border and no fill. Drafting and Generating pulse, because an agent is working right now.
- **`ink-ghost` was retired from text.** At 2.5:1 it could not carry an ordinal or a placeholder; everything readable is `ink-faint` (5.0:1) or darker. Quiet comes from size and weight instead.
- **The mark is a letter** — a 600-weight `D` in paper on an ink square — rather than a drawn logo the product has not earned yet.
- **The Brief is a ruled sheet, not a card.** Label and hint hang in an 11rem column; inputs are 1.3125rem underlines, so the Student's answer is the largest thing in the row.

## Constraints

- Offline: two self-hosted variable faces (Figtree, JetBrains Mono), no CDN, no remote assets.
- Desktop is the design target — Code Exercise needs the Student's editor. Narrow stays correct: below `sm` the Library row folds its progress inline; below `lg` the Lesson margin folds away; below `xl` the Tutor becomes a sheet.
- Copy uses `CONTEXT.md` terms exactly. No evidence to fabricate.
- Light-only, fully flat; shadows only for popovers and the sheet.

## Unresolved

- No backend. Every station runs on synthetic data in `src/mock/data.ts`; only Lesson 3 is fully authored.
- Tailor Mode's file rewrite preview is still a canned reply.
- Regenerating from Syllabus resets Progress — confirmation not built.
- No reading-progress indicator on a long Lesson; the contents popover and the footer pager carry navigation instead.
