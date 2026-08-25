import { cn } from '@/lib/utils'

/**
 * The ruled sheet. Every station in Dolphin is set the same way: a masthead in
 * display type, one heavy `ink/85` rule under it, then rows divided by
 * hairlines. Labels hang in a left column; the answer keeps the rest of the
 * width and is the largest thing in its row. No station uses a card.
 */

export function Masthead({
  title,
  lead,
  action,
  children,
  className,
}: {
  title: React.ReactNode
  lead?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn('station-in flex flex-wrap items-end justify-between gap-x-10 gap-y-6', className)}>
      <div className="min-w-0">
        <h1 className="display text-[clamp(2rem,4.5vw,2.75rem)]">{title}</h1>
        {lead && <p className="supporting mt-5 max-w-[54ch] text-ink-soft">{lead}</p>}
        {children}
      </div>
      {action}
    </header>
  )
}

/** Label and hint hang in the left column; the control keeps the rest. */
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-x-8 gap-y-3 border-b border-rule pt-7 pb-4 transition-colors focus-within:border-accent md:grid-cols-[11rem_minmax(0,1fr)]',
        className,
      )}
    >
      <div>
        <p className="label text-ink">{label}</p>
        {hint && <p className="supporting mt-2 text-[0.8125rem] text-ink-faint">{hint}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/** A term and its value, for reading back what the Student already decided. */
export function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-rule-soft py-3">
      <dt className="label w-24 shrink-0 pt-1 text-ink-faint">{term}</dt>
      <dd className="min-w-0 flex-1 text-ink-soft">{children}</dd>
    </div>
  )
}

/**
 * A text input set on the row's own rule, not in a box, so the Student's answer
 * is the largest thing in its row. The row rule is the underline — it goes
 * `accent` while the field has focus — so a sheet never draws two hairlines
 * where it means one.
 */
export const underline =
  'h-auto w-full rounded-none border-0 bg-transparent px-0 py-0 title text-[1.3125rem] md:text-[1.3125rem] outline-none placeholder:font-normal placeholder:text-ink-faint focus-visible:ring-0'

/** The one heavy rule in the system: what opens a sheet. */
export const opening = 'border-t border-ink/85'
