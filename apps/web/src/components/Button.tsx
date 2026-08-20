import { cn } from '@/lib/cn'

type Variant = 'primary' | 'ink' | 'quiet' | 'danger'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-strong active:scale-[0.98]',
  ink: 'bg-ink text-paper hover:bg-accent active:scale-[0.98]',
  quiet: 'border border-rule bg-paper-raised text-ink-soft hover:border-accent-soft hover:bg-accent-wash hover:text-accent active:scale-[0.98]',
  danger: 'border border-rule bg-paper-raised text-ink-soft hover:border-fail/40 hover:bg-fail-wash hover:text-fail active:scale-[0.98]',
}

/** One committing action per station wears `primary`. Everything else is quiet. */
export function Button({
  variant = 'primary',
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...rest}
      className={cn(
        'label inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 transition-[background-color,color,border-color,transform] duration-150',
        'disabled:pointer-events-none disabled:border-transparent disabled:bg-rule disabled:text-ink-faint',
        variants[variant],
        className,
      )}
    />
  )
}
