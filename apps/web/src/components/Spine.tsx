import { cn } from '@/lib/cn'

/**
 * One bar, notched once per unit — Lessons in a Course, hidden tests in a Code
 * Exercise. Countable at a glance, and it claims no precision the data lacks.
 * Notches are cut at exact percentages, so segments stay even at any width.
 */
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
  /** A `bg-*` class. Course progress takes the Course State's hue. */
  fill?: string
  track?: string
  /** Must match the surface behind the bar, so the notches read as gaps. */
  notch?: string
  className?: string
}) {
  const pct = total ? (filled / total) * 100 : 0
  // ponytail: past ~24 units the notches stop being countable; a plain bar reads better.
  const notches = total > 1 && total <= 24 ? Array.from({ length: total - 1 }, (_, i) => i + 1) : []

  return (
    <span className={cn('relative block h-[7px] overflow-hidden rounded-[3px]', track, className)} aria-hidden>
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
