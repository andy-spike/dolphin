import { useState } from 'react'
import { FlaskConical, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { FaultKind } from '@/components/Fault'

/** Not part of the product. A reviewer's switch for states with no live backend. */
export function DemoBar({
  empty,
  onEmpty,
  fault,
  onFault,
}: {
  empty: boolean
  onEmpty: (v: boolean) => void
  fault: FaultKind
  onFault: (f: FaultKind) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Mock state controls"
        aria-expanded={open}
        className={cn(
          'grid size-9 place-items-center transition-colors duration-150',
          open ? 'bg-ink text-paper' : 'text-ink-faint hover:bg-paper-sunk hover:text-ink-soft',
        )}
      >
        <FlaskConical size={15} strokeWidth={1.8} />
      </button>

      {open && (
        <div
          className="fixed bottom-[3.5rem] left-3 z-50 flex w-48 flex-col gap-0.5 border border-rule bg-paper-raised p-1.5 shadow-[0_12px_32px_-12px_rgba(16,15,15,0.28)]"
          style={{ animation: 'land 200ms var(--ease-workspace) both' }}
        >
          <span className="label flex items-center justify-between px-2 pt-1.5 pb-2 text-ink-faint">
            Mock states
            <button
              onClick={() => setOpen(false)}
              aria-label="Hide mock controls"
              className="grid size-4 place-items-center text-ink-faint hover:text-ink"
            >
              <X size={12} strokeWidth={2.2} />
            </button>
          </span>

          <Chip on={empty} onClick={() => onEmpty(!empty)}>
            Empty library
          </Chip>
          {(['none', 'agent', 'docker', 'source'] as FaultKind[]).map((f) => (
            <Chip key={f} on={fault === f} onClick={() => onFault(f)}>
              {f === 'none' ? 'No fault' : f}
            </Chip>
          ))}
        </div>
      )}
    </>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'label px-2.5 py-2 text-left transition-colors duration-150',
        on ? 'bg-accent-wash text-accent' : 'text-ink-faint hover:bg-paper-sunk hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
