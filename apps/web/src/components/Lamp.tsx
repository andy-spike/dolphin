import { cn } from '@/lib/utils'

export type Health = 'ready' | 'working' | 'down'

const copy: Record<Health, string> = {
  ready: 'agent ready',
  working: 'agent working',
  down: 'no agent found',
}

/** Whether the Student's own coding agent is alive. Blue means live; nothing else does. */
export function Lamp({ health }: { health: Health }) {
  return (
    <div className="group relative flex items-center justify-center py-1" title={copy[health]}>
      <span className="grid size-7 place-items-center border border-rule bg-paper">
        <span
          className={cn(
            'size-2 ',
            health === 'down' ? 'bg-rule-strong' : 'bg-accent',
            health === 'working' && 'animate-[lamp_1.4s_var(--ease-workspace)_infinite]',
          )}
        />
      </span>
      <span className="sr-only">{copy[health]}</span>
    </div>
  )
}
