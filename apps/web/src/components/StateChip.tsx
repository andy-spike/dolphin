import { cn } from '@/lib/cn'
import { stateTone } from '@/lib/state'
import type { CourseState } from '@/mock/types'

/**
 * Course State reads as a mark plus its name, in the State's own Flexoki hue.
 * A live State (an agent is working right now) pulses; the rest hold steady.
 */
export function StateChip({ state, className }: { state: CourseState; className?: string }) {
  const tone = stateTone[state]
  return (
    <span className={cn('label inline-flex w-fit shrink-0 items-center gap-1.5', tone.text, className)}>
      <span
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          tone.dot,
          tone.live && 'animate-[lamp_1.4s_var(--ease-workspace)_infinite]',
        )}
      />
      {state}
    </span>
  )
}
