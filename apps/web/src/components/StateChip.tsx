import { cn } from '@/lib/utils'
import { stateTone } from '@/lib/state'
import type { CourseState } from '@/mock/types'

export function StateChip({ state, className }: { state: CourseState; className?: string }) {
  const tone = stateTone[state]
  return (
    <span className={cn('label inline-flex w-fit shrink-0 items-center gap-1.5 normal-case', tone.text, className)}>
      <span
        className={cn(
          'size-1.5 shrink-0 ',
          tone.dot,
          tone.live && 'animate-[lamp_1.4s_var(--ease-workspace)_infinite]',
        )}
      />
      {state.toLowerCase()}
    </span>
  )
}
