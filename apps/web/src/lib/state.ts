import type { CourseState } from '@/mock/types'

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
