import { Lock } from 'lucide-react'

/**
 * A Course Lock is not a Fault: nothing is broken, one Agent Job simply holds
 * the Course while Tailor Mode rewrites it. So it reads in the workspace's own
 * neutrals with a live blue lamp, not in `fail` — and it says what is waiting.
 */
export function CourseLock({ files }: { files: string[] }) {
  return (
    <div role="status" className="flex shrink-0 items-start gap-3 border-b border-rule bg-paper-sunk px-5 py-3.5 md:px-7">
      <span className="relative mt-0.5 grid size-4 shrink-0 place-items-center">
        <Lock size={14} strokeWidth={1.9} className="text-accent" />
        <span className="absolute -top-1 -right-1 size-1.5 animate-[lamp_1.4s_var(--ease-workspace)_infinite] bg-accent" />
      </span>
      <p className="supporting text-[0.875rem] text-ink-soft">
        <span className="font-semibold text-ink">tailor mode is editing this course.</span> every other agent job waits
        until it finishes. it is rewriting{' '}
        {files.map((f, i) => (
          <span key={f}>
            {i > 0 && (i === files.length - 1 ? ' and ' : ', ')}
            <code className="numeral bg-accent-wash px-1 py-0.5 text-[0.8125rem] text-accent">{f}</code>
          </span>
        ))}
        .
      </p>
    </div>
  )
}
