import { Library } from 'lucide-react'
import { cn } from '@/lib/cn'
import { stateTone } from '@/lib/state'
import { Mark } from './Mark'
import { Lamp, type Health } from './Lamp'
import type { Course } from '@/mock/types'

type Props = {
  health: Health
  atLibrary: boolean
  open: Course | null
  progress: number
  onLibrary: () => void
  onOpen: () => void
  mock?: React.ReactNode
}

/** The only permanent furniture: where the Student is, what is open, whether the agent is alive. */
export function Rail({ health, atLibrary, open, progress, onLibrary, onOpen, mock }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="relative z-30 flex w-14 shrink-0 flex-col items-center gap-1.5 border-r border-rule bg-paper-raised py-4 md:w-16"
    >
      <button onClick={onLibrary} aria-label="Dolphin" className="mb-3 rounded-[9px]">
        <Mark />
      </button>

      <RailButton label="Course Library" active={atLibrary} onClick={onLibrary}>
        <Library size={18} strokeWidth={1.7} />
      </RailButton>

      {open && (
        <RailButton label={open.topic} active={!atLibrary} tone={stateTone[open.state]} onClick={onOpen}>
          <span className="relative grid size-7 place-items-center overflow-hidden rounded-[7px] border border-rule bg-paper numeral text-[0.625rem] font-semibold text-ink">
            {open.topic.slice(0, 2).toUpperCase()}
            <span
              className={cn(
                'absolute inset-x-0 bottom-0 h-[3px] origin-left transition-transform duration-500 ease-[var(--ease-workspace)]',
                stateTone[open.state].fill,
              )}
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
        </RailButton>
      )}

      <span className="mt-auto" />
      {mock}
      <span className="my-1 h-px w-5 bg-rule" />
      <Lamp health={health} />
    </nav>
  )
}

function RailButton({
  label,
  active,
  tone,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  /** The open Course wears its own State hue; Library keeps the action blue. */
  tone?: { wash: string; text: string; fill: string }
  onClick: () => void
  children: React.ReactNode
}) {
  const on = tone ?? { wash: 'bg-accent-wash', text: 'text-accent', fill: 'bg-accent' }
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative grid size-9 place-items-center rounded-[9px] transition-colors duration-150 md:size-10',
        active ? cn(on.wash, on.text) : 'text-ink-faint hover:bg-paper-sunk hover:text-ink',
      )}
    >
      {active && <span className={cn('absolute inset-y-2 -left-2 w-[3px] rounded-r-full', on.fill)} />}
      {children}
      <Tip>{label}</Tip>
    </button>
  )
}

/** Rail buttons are icons; the name arrives on hover rather than living in a wider rail. */
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full z-40 ml-3 max-w-[15rem] origin-left scale-95 truncate rounded-[7px] border border-rule bg-paper-raised px-2.5 py-1.5 label whitespace-nowrap text-ink-soft opacity-0 shadow-[0_8px_24px_-12px_rgba(16,15,15,0.28)] transition-[opacity,transform] duration-150 group-hover:scale-100 group-hover:opacity-100"
    >
      {children}
    </span>
  )
}
