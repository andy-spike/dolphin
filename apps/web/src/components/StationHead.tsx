import { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Kbd } from './Kbd'
import { StateChip } from './StateChip'
import type { Course, Lesson } from '@/mock/types'

type Stepper = {
  n: number
  of: number
  lessons: Lesson[]
  onJump: (i: number) => void
  onPrev?: () => void
  onNext?: () => void
}

/** Compact strip: what is open, what state it is in, and where you are inside it. */
export function StationHead({
  course,
  station,
  stepper,
}: {
  course: Course
  station: string
  stepper?: Stepper
}) {
  return (
    <header className="relative z-20 flex shrink-0 items-center gap-x-3 border-b border-rule bg-paper-raised px-4 py-2.5 md:gap-x-4 md:px-7">
      <h1 className="title min-w-0 flex-1 truncate text-[0.9375rem] text-ink-soft sm:flex-none">{course.topic}</h1>
      <StateChip state={course.state} className="hidden sm:inline-flex" />
      <span className="sr-only">{station}</span>

      <p className="numeral hidden min-w-0 shrink truncate text-[0.75rem] text-ink-faint xl:block">{course.folder}</p>

      {stepper && <Stepper {...stepper} />}
    </header>
  )
}

function Stepper({ n, of, lessons, onJump, onPrev, onNext }: Stepper) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [onPrev, onNext])

  return (
    <div className="ml-auto flex shrink-0 items-center rounded-full border border-rule">
      <Step dir="prev" onClick={onPrev} />
      <Contents n={n} of={of} lessons={lessons} onJump={onJump} />
      <Step dir="next" onClick={onNext} />
    </div>
  )
}

function Step({ dir, onClick }: { dir: 'prev' | 'next'; onClick?: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      aria-label={dir === 'prev' ? 'Previous lesson' : 'Next lesson'}
      className={cn(
        'group/step relative grid size-8 place-items-center transition-colors',
        dir === 'prev' ? 'rounded-l-full' : 'rounded-r-full',
        onClick ? 'text-ink-soft hover:bg-paper-sunk hover:text-ink active:bg-rule' : 'cursor-not-allowed text-ink-ghost/45',
      )}
    >
      <Icon size={15} strokeWidth={2} />
      {onClick && (
        <span className="pointer-events-none absolute top-full left-1/2 z-40 mt-2 -translate-x-1/2 scale-95 opacity-0 transition-[opacity,transform] duration-150 group-hover/step:scale-100 group-hover/step:opacity-100">
          <Kbd>{dir === 'prev' ? '\u2190' : '\u2192'}</Kbd>
        </span>
      )}
    </button>
  )
}

function Contents({ n, of, lessons, onJump }: Omit<Stepper, 'onPrev' | 'onNext'>) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const done = lessons.filter((l) => l.complete).length

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="label flex h-8 items-center gap-1.5 border-x border-rule px-3 text-ink-soft transition-colors hover:bg-paper-sunk hover:text-ink"
      >
        Lesson {n} of {of}
        <ChevronDown size={12} strokeWidth={2.2} className={cn('text-ink-faint transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-40 mt-2 max-h-[70dvh] w-[min(26rem,calc(100vw-3rem))] overflow-y-auto rounded-[12px] border border-rule bg-paper-raised shadow-[0_12px_32px_-12px_rgba(16,15,15,0.22)]"
          style={{ animation: 'land 200ms var(--ease-workspace) both' }}
        >
          <p className="label sticky top-0 flex items-center justify-between border-b border-rule bg-paper-raised px-4 py-3 text-ink-faint">
            Syllabus
            <span className="text-ink">
              {done} of {of} complete
            </span>
          </p>
          <ol>
            {lessons.map((l, i) => (
              <li key={l.id}>
                <button
                  onClick={() => {
                    onJump(i)
                    setOpen(false)
                  }}
                  aria-current={l.n === n ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-baseline gap-3 border-b border-rule-soft px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-paper-sunk',
                    l.n === n && 'bg-accent-wash hover:bg-accent-wash',
                  )}
                >
                  <span className="numeral grid w-5 shrink-0 justify-items-center text-[0.6875rem] text-ink-faint">
                    {l.complete ? <Check size={13} strokeWidth={2.4} className="text-pass" /> : String(l.n).padStart(2, '0')}
                  </span>
                  <span className={cn('title min-w-0 flex-1 text-[0.9375rem]/snug', l.n === n ? 'text-accent' : 'font-normal text-ink-soft')}>
                    {l.title}
                  </span>
                  <span className="label shrink-0 text-ink-faint">{l.minutes}m</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
