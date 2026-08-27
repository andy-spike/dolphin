
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="numeral inline-grid h-[1.125rem] min-w-[1.125rem] place-items-center border border-rule bg-paper px-1 text-[0.6875rem] leading-none text-ink-faint">
      {children}
    </kbd>
  )
}
