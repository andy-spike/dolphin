import type { CourseState } from '@/mock/types'

/**
 * Course State is the one thing in Dolphin that carries its own hue, and it
 * runs cool → warm → green across the lifecycle: not started, in your hands,
 * done. Blue stays reserved for actions, focus and controls everywhere else.
 *
 * `wash` is the solid tone at 10%, not a Flexoki 50 tint: the published tints
 * differ a lot in strength (orange-50 shouts, purple-50 is almost neutral), and
 * a hover has to feel the same weight on every row.
 */
export type Tone = { dot: string; text: string; wash: string; fill: string; live: boolean }

export const stateTone: Record<CourseState, Tone> = {
  Drafting: {
    dot: 'bg-state-drafting',
    text: 'text-state-drafting',
    wash: 'bg-state-drafting/10',
    fill: 'bg-state-drafting',
    live: true,
  },
  Generating: {
    dot: 'bg-state-generating',
    text: 'text-state-generating',
    wash: 'bg-state-generating/10',
    fill: 'bg-state-generating',
    live: true,
  },
  Ready: {
    dot: 'bg-state-ready',
    text: 'text-state-ready',
    wash: 'bg-state-ready/10',
    fill: 'bg-state-ready',
    live: false,
  },
  'In Progress': {
    dot: 'bg-state-progress',
    text: 'text-state-progress',
    wash: 'bg-state-progress/10',
    fill: 'bg-state-progress',
    live: false,
  },
  Complete: {
    dot: 'bg-state-complete',
    text: 'text-state-complete',
    wash: 'bg-state-complete/10',
    fill: 'bg-state-complete',
    live: false,
  },
}
