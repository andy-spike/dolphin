import { cn } from '@/lib/utils'

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

export function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-rule-soft py-3">
      <dt className="label w-24 shrink-0 pt-1 text-ink-faint">{term}</dt>
      <dd className="min-w-0 flex-1 text-ink-soft">{children}</dd>
    </div>
  )
}

export const underline =
  'h-auto w-full rounded-none border-0 bg-transparent px-0 py-0 title text-[1.3125rem] md:text-[1.3125rem] outline-none placeholder:font-normal placeholder:text-ink-faint focus-visible:ring-0'

export const opening = 'border-t border-ink/85'
