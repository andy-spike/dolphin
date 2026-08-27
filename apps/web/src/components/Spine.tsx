import { cn } from '@/lib/utils'

export function Spine({
  total,
  filled,
  fill = 'bg-accent',
  track = 'bg-rule',
  notch = 'bg-paper',
  className,
}: {
  total: number
  filled: number

  fill?: string
  track?: string

  notch?: string
  className?: string
}) {
  const pct = total ? (filled / total) * 100 : 0

  const notches = total > 1 && total <= 24 ? Array.from({ length: total - 1 }, (_, i) => i + 1) : []

  return (
    <span className={cn('relative block h-[7px] overflow-hidden ', track, className)} aria-hidden>
      <span
        className={cn('absolute inset-y-0 left-0 transition-[width] duration-500 ease-[var(--ease-workspace)]', fill)}
        style={{ width: `${pct}%` }}
      />
      {notches.map((i) => (
        <span
          key={i}
          className={cn('absolute inset-y-0 w-[2px]', notch)}
          style={{ left: `${(i / total) * 100}%`, transform: 'translateX(-1px)' }}
        />
      ))}
    </span>
  )
}
