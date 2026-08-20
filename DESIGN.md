---
name: Dolphin
description: A soft study workspace — Flexoki paper, Figtree sans, hairline rules, blue for action and a hue per Course State.
colors:
  paper: "#FFFCF0"
  paper-raised: "#FFFFFF"
  paper-sunk: "#F2F0E5"
  ink: "#100F0F"
  ink-soft: "#575653"
  ink-faint: "#6F6E69"
  ink-ghost: "#A5A29B"
  rule: "#E6E4D9"
  rule-soft: "#F0EEE6"
  rule-strong: "#CECDC3"
  accent: "#205EA6"
  accent-strong: "#1A4A84"
  accent-wash: "#E1ECEB"
  accent-soft: "#C4D9ED"
  state-drafting: "#5E409D"
  state-generating: "#205EA6"
  state-ready: "#1C6C66"
  state-progress: "#BC5215"
  state-complete: "#536907"
  fail: "#AF3029"
  fail-wash: "#FFE1D5"
  pass: "#536907"
  pass-wash: "#EDEECF"
typography:
  display:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4.5vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.014em"
  reading:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.003em"
  supporting:
    fontFamily: "Figtree Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.003em"
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.6875rem"
    fontWeight: 550
    lineHeight: 1
    letterSpacing: "0.085em"
  numeral:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "normal"
  code:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  notch: "2px"
  chip: "4px"
  square: "9px"
  field: "10px"
  block: "12px"
  full: "9999px"
spacing:
  hair: "1px"
  tight: "6px"
  field: "12px"
  gutter: "24px"
  margin: "6.5rem"
  measure: "39rem"
  page: "40px"
  section: "56px"
  station: "80px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
  button-quiet:
    backgroundColor: "{colors.paper-raised}"
    borderColor: "{colors.rule}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
  button-disabled:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.ink-faint}"
  state-chip:
    backgroundColor: "transparent"
    textColor: "{colors.state-progress}"
    typography: "{typography.label}"
  kbd:
    backgroundColor: "{colors.paper}"
    borderColor: "{colors.rule}"
    textColor: "{colors.ink-faint}"
    typography: "{typography.numeral}"
    rounded: "{rounded.chip}"
  mark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    fontWeight: 600
    rounded: "{rounded.square}"
    size: "30px"
  spine:
    backgroundColor: "{colors.rule}"
    fillColor: "{colors.accent}"
    height: "7px"
    rounded: "{rounded.notch}"
  index-row:
    backgroundColor: "transparent"
    borderColor: "{colors.rule}"
    textColor: "{colors.ink}"
    padding: "24px 0"
  index-row-hover:
    backgroundColor: "state tone at 10%"
    textColor: "{colors.ink}"
  brief-field:
    borderColor: "{colors.rule-soft}"
    typography: "{typography.title}"
    padding: "28px 0"
  input-underline:
    borderColor: "{colors.rule}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  composer:
    backgroundColor: "{colors.paper-raised}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.block}"
    padding: "10px 14px"
  rail:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink-faint}"
    width: "56px"
  tutor-panel:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink-soft}"
    width: "368px"
  tutor-turn-student:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.block}"
---

# Design System: Dolphin

## Overview

**Creative North Star: "The Inky Learning Workspace"**

Dolphin is a study surface built the way Flexoki itself is presented: warm paper, true ink, a soft sans at modest sizes, and colour used sparingly but meaningfully. A slim neutral rail is the only permanent furniture — the mark, the Course Library, the open Course, the agent lamp. Everything right of it is one work area that swaps with Course State.

Hierarchy is typographic before it is chromatic. One face, Figtree, carries every word the Student reads; weight and tracking do the work a display cut would, so a 3.25rem masthead and a 15px caption belong to the same voice. JetBrains Mono carries only what a machine would say: counts, states, paths, filenames, code, button faces. There is no third face.

Colour is not decoration and it is not everywhere. Blue owns action, focus and control. The five Course States own the rest of the palette, and nothing else does.

**Key Characteristics:**
- One workspace; Course State selects the station.
- Two self-hosted faces, fully offline: Figtree Variable and JetBrains Mono Variable.
- Flexoki paper ground (#FFFCF0) with 1px rules (#E6E4D9). No grain, no texture, no gradients.
- Course State carries a Flexoki hue, running cool → warm → green across the lifecycle.
- The Course Library is a set index — masthead, numbered rows, a notched progress spine in the State's hue.
- The Lesson sets on a two-column frame: a 6.5rem left margin carrying the section name, and one 39rem reading column.

## Colors

### Action

- **Accent Blue** (`accent` #205EA6): every committing button, focus ring, link, composer focus, streaming cursor and Student turn. `accent-strong` #1A4A84 on hover, `accent-wash` #E1ECEB for quiet fills, `accent-soft` #C4D9ED for borders and text selection.

### Course State

Five Flexoki tones, one per State, warming as the Student gets further in:

| State | Tone | Reads as |
|---|---|---|
| Drafting | purple `#5E409D` | still being argued |
| Generating | blue `#205EA6` | the agent is writing |
| Ready | cyan `#1C6C66` | written, not started |
| In Progress | orange `#BC5215` | in your hands |
| Complete | green `#536907` | done |

Each tone drives its State's dot, its name, its progress spine, its rail tab, and a 10% wash on hover. Two of the published Flexoki 600 tones (green, cyan) land under 4.5:1 on paper at label size, so Dolphin uses one step darker for both. The hover wash is the solid tone at 10% rather than a Flexoki 50 tint, because the published tints differ enormously in strength — orange-50 shouts where purple-50 is almost neutral — and a hover must feel identical on every row.

### Neutral

- **Paper** (`paper` #FFFCF0): the page. `paper-raised` #FFFFFF for the rail, header strips, exercise cards and composers. `paper-sunk` #F2F0E5 for the Tutor panel, code figures, notes and result blocks.
- **Ink** (`ink` #100F0F): headings and body. `ink-soft` #575653 for secondary prose and agent replies (7.0:1 on paper). `ink-faint` #6F6E69 for labels, metadata, ordinals and placeholders (5.0:1 — the lightest grey that still carries words). `ink-ghost` #A5A29B is 2.5:1 and is reserved for disabled glyphs; it never sets text.
- **Rule** (`rule` #E6E4D9) for every hairline; `rule-soft` #F0EEE6 between repeated rows inside one group; `rule-strong` #CECDC3 for scrollbar thumb and separator dots. A section opens on `ink/85`, the one heavy rule in the system.

### Semantic

- **Fail** (`fail` #AF3029) / `fail-wash` #FFE1D5: Fault strip, failing tests, destructive hover.
- **Pass** (`pass` #536907) / `pass-wash` #EDEECF: passing tests, a completed Lesson. Same green as Complete, because it means the same thing.

### Named Rules

**The Two Jobs Rule.** Blue means *do something*. A State hue means *this is where the Course stands*. No hue does both, and nothing else in the interface gets a hue at all.

**The Equal Weight Rule.** A hover, a selection, or an active tab must feel the same strength whichever State it belongs to. Alpha of the solid tone, never a per-hue tint.

**The Ghost Floor Rule.** `ink-faint` is the lightest ink that may carry a word — including an ordinal, a unit, or a placeholder. Quiet an element with size and weight, not with a grey that fails.

## Typography

**One reading face:** Figtree Variable. **One machine face:** JetBrains Mono Variable.

Figtree is the soft end of the humanist-geometric range: open apertures, rounded joins, a tall x-height that holds up at 15px. It is deliberately not a display face — scale comes from weight (400 / 500 / 600) and tracking, in the same restrained way stephango.com/flexoki sets its own pages.

### Hierarchy

- **Display** (500, -0.028em, 1.08): the Library masthead, the Brief question, the Lesson title, the Syllabus and Generating headlines, the closed Course topic. Capped at 3.25rem — big enough to lead a page, never a poster.
- **Title** (600, -0.014em, 1.0625–1.4375rem): index-row topics, syllabus entries, prose subheadings, the course name in a station header.
- **Reading** (400, 1.0625rem/1.65): Lesson prose in a 39rem measure, ~72 characters.
- **Supporting** (400, 0.9375rem/1.6): agent replies, hints, station introductions.
- **Label** (mono 550, 0.6875rem, 0.085em, uppercase): counts, states, section names, button faces, metadata.
- **Numeral** (mono, tabular, `zero` on): percentages, ordinals, minutes, word counts, folder paths, filenames, key names.
- **Code** (mono 400, 0.8125rem/1.75): code figures and inline code.

### Named Rules

**The Machine Voice Rule.** Mono is for what a machine would say — counts, states, paths, code, key names, button faces. A sentence is always Figtree. A word that is neither a measurement nor a control (a Difficulty, a Topic) is Figtree even when it sits in a stat block.

**The One Measure Rule.** Reading is capped at 39rem (~72ch). The Brief runs 48rem because its column is a form, the Syllabus thread 36rem, the Tutor panel its own width.

**The Heading Air Rule.** More space above a heading than below it: 48px above a prose subheading, 16px below; 80px between Lesson sections.

**The No Display Cut Rule.** There is one weight ramp and one face. Do not reach for a second family, a condensed cut, or an italic to make something stand out — use weight, size, or the State's hue.

## Layout

**Shell:** full-height flex row — rail 56px (64px at md), then `<main>` that swaps with Course State. The shell owns `h-dvh overflow-hidden`; each station scrolls inside itself.

**The Lesson frame:** from `lg`, a grid of `6.5rem` margin + `39rem` column with a 2rem gap. The margin carries the Lesson ordinal beside the title and the section name beside each section; the section name is sticky, so it stays with the Student as they read. Below `lg` the margin folds away and the section name moves above its section with a hairline.

**Course Library:** a masthead (`Course / Library` on two lines, the count beneath, the one primary action opposite), a heavy `ink/85` opening rule, then `n` rows. Each row is ordinal, State mark, topic, goal, metadata, and a right column of percentage, spine and lesson count — the percentage and spine in the State's hue. Below `sm` the right column folds into the row body as spine plus count.

**Breakpoints:** `sm` 640px (the row's right column appears), `md` 768px (rail widens, padding steps up), `lg` 1024px (Lesson margin appears; Syllabus splits outline and chat), `xl` 1280px (Tutor docks as a 23rem panel, 27rem at 2xl).

**Density:** reading is generous, chrome is tight. Station headers are 10px vertical; a Lesson breathes at 80px section rhythm.

## Elevation & Depth

Flat. Regions separate with 1px rules, never shadows.

### Shadow Vocabulary

- **Popover** (`0 12px 32px -12px rgba(16,15,15,0.22)`): the Syllabus contents popover, the mock-state panel, rail tooltips (at `-12px 24px`).
- **Sheet** (`0 -12px 32px rgba(16,15,15,0.16)`): the Tutor sheet below `xl`.

No other shadows. Cards are bordered flat surfaces.

## Shapes

- **Pill** (`9999px`): buttons, toggles, the stepper, the folder path, suggestion chips.
- **Field** (`10px`): source rows, answer textareas, prose notes.
- **Block** (`12px`): code figures, exercise cards, composers, popovers, turns.
- **Square** (`9px`): the mark and rail buttons.
- **Chip** (`4px`): key caps, inline code, focus ring.
- **Notch** (`3px`): the progress spine.

Borders are 1px `rule`; `rule-soft` between repeated rows inside one group; dashed `rule-strong` only for add affordances.

## Components

### The Mark

A letter, not a logo: a 600-weight `D` in paper on a 30px ink square. It is the only place the brand is drawn. The wordmark appears as a mono label in the Library's top strip, where there is room to set it.

### Buttons

- **Primary:** `accent` pill, white text, label type, 12px/20px. One per station, on the committing action.
- **Ink:** `ink` pill going `accent` on hover — for a second action that commits something smaller (resume, check an answer, run tests).
- **Quiet:** `paper-raised` pill with a `rule` border, warming to `accent-wash`.
- **Danger:** quiet, warming to `fail-wash` — stop generating, remove a Source.
- **Disabled:** `rule` fill, `ink-faint` text, always beside a label saying what would enable it.

Every variant presses: `active:scale-[0.98]`. A control that cannot be pushed does not feel like a control.

### The Spine

One bar notched once per unit, filled to progress, in the Course State's hue. Notches are cut at exact percentages so segments stay even at any width; past 24 units they stop and the bar runs plain. It is the single progress idiom in the system — Lessons in a Course, hidden tests in a Code Exercise — and it never becomes a ring, a badge, or a donut.

### State Chip

A dot plus its name in label type, in the State's hue, no border and no fill. A live State (Drafting, Generating — an agent is working right now) pulses; the rest hold steady.

### Index Row

Ordinal, State mark, topic in title type, goal in supporting, metadata in labels, then percentage, spine and count. Hover washes the row in its own State's hue at 10%, bleeding past the measure, and fills the trailing arrow with ink while sliding it 4px. Nothing moves.

### Keys

Reachable actions say so. The lesson stepper walks on `←` / `→`, and each step button reveals a `Kbd` cap on hover — a mono key name on paper with a `rule` border. Keyboard handlers ignore events from inputs, textareas and modified chords.

### Brief Field

Label and hint hang in an 11rem left column; the control keeps the rest. Text inputs are underlines in title type at 1.3125rem, not boxes — the answer is the largest thing in the row. The underline goes `accent` on focus.

### Tutor Margin

Docked from `xl` on `paper-sunk` with a left rule. Tabs are underlined labels, not pills; the active one carries a 2px `accent` underline. The Tutor speaks unboxed — a mono name over supporting prose, the way a margin note is set. The Student's turn is a solid `accent` block, the one saturated moment in the panel. The thread opens on its newest turn and, when scrolled up, fades into the composer with a mask. Below `xl` a sticky ink bar summons an 85dvh sheet.

### Fault

A full-width strip at the top of main: `fail-wash` fill, a warning glyph, the problem in `fail` semibold, then the recovery in `ink-soft`. Paths inside it are mono on a `fail/8` tint. Never a modal.

### Motion

One ease, `--ease-workspace` (0.16, 1, 0.3, 1). Durations: 150ms colour and press, 200ms transform, 280ms sheet, 320ms land, 380ms station.

- `station-in` — the one authored entrance. A station's heading rises 10px and settles; nothing else animates on arrival.
- `land` — a generated Lesson arriving in the list, and popovers opening.
- `lamp` — the only loop, on live State dots and the agent lamp.
- `active:scale-[0.98]` — every button answers a press.
- `useStream` reveals agent text at 260 chars/sec behind a solid blue cursor. All agent text goes through it.
- `prefers-reduced-motion` collapses everything to 0.01ms.

## Do's and Don'ts

### Do:
- Set every sentence in Figtree and every count, state, path and key name in mono.
- Build scale from weight and tracking, not from a second face.
- Give Course State its hue everywhere it appears: dot, name, spine, percentage, rail tab, row hover.
- Keep blue for actions, focus and controls only.
- Derive a hover wash from the solid tone at 10%, so every State hovers with equal weight.
- Cap reading at 39rem and hang the section name in the margin.
- Put more space above a heading than below it.
- Let a row hover wash and tint; never let it move.
- Answer every press with `active:scale-[0.98]`.
- Show the key when an action has one.
- Theme selection, caret, focus ring and scrollbar from the palette.
- Pair every disabled control with a label saying what would enable it.
- Name the problem then the recovery in every Fault.
- Use lucide-react at 11–18px, stroke 1.7–2.4.

### Don't:
- Don't add a serif, a third face, or an italic; Figtree and the mono are the whole system.
- Don't set a sentence in mono or a Difficulty in mono — it is a word, not a measurement.
- Don't give a hue to anything that is not a Course State or a pass/fail result.
- Don't use a published Flexoki 50 tint as a hover wash; their strengths do not match each other.
- Don't ship a State tone that misses 4.5:1 on paper at label size — darken it a step.
- Don't render Progress as a ring, a donut or a badge.
- Don't put a kicker or eyebrow above a heading.
- Don't show a full spine where the value is always 100% — it says nothing.
- Don't box a Tutor turn; only the Student's turn has a surface.
- Don't use a spinner for progress; the only spinner sits inside a button that names what it is doing.
- Don't load fonts or icons from a CDN; the app is fully offline.
- Don't build a dark theme; `color-scheme: light`.
- Don't reintroduce a card grid, a shelf, or a table header for the Course Library.

<!--
Scaffolding, not design system: `apps/web/src/DemoBar.tsx` and `apps/web/src/mock/data.ts` are synthetic. Do not extend as patterns.
-->
