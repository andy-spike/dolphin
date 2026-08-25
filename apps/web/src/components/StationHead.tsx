import { useEffect } from 'react'
import { Check, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { groupByModule } from '@/lib/modules'
import { StateChip } from './StateChip'
import { AccountMenu } from './AccountMenu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Course, Lesson, Module } from '@/mock/types'

type Stepper = {
  n: number
  of: number
  lessons: Lesson[]
  modules: Module[]
  onJump: (i: number) => void
  onPrev?: () => void
  onNext?: () => void
}

/**
 * Compact strip, used on every screen. A toolbar of full-height cells divided by
 * hairlines: the mark, then what is open and what state it is in, then where you
 * are inside it. Without a Course (the Course Library itself) it is the mark alone.
 */
export function StationHead({
  course,
  station,
  stepper,
  onLibrary,
  onCourse,
  account = true,
}: {
  course?: Course
  station: string
  stepper?: Stepper
  onLibrary?: () => void
  /** Makes the Course name a way back to its Overview. */
  onCourse?: () => void
  /** Off only where the Student is not signed in yet. */
  account?: boolean
}) {
  return (
    <header className="relative z-20 flex h-[3.25rem] shrink-0 items-stretch border-b border-rule bg-paper-sunk">
      <Identity onLibrary={onLibrary} divided={Boolean(course) || account} />
      <span className="sr-only">{station}</span>

      {course && (
        <div className="flex min-w-0 flex-1 items-center gap-x-3 px-4 md:px-5">
          {onCourse ? (
            <button
              onClick={onCourse}
              className="title min-w-0 flex-1 truncate text-left text-[0.9375rem] text-ink underline decoration-transparent underline-offset-[0.3em] transition-colors hover:decoration-rule-strong"
            >
              {course.topic}
            </button>
          ) : (
            <p className="title min-w-0 flex-1 truncate text-[0.9375rem] text-ink">{course.topic}</p>
          )}
          <StateChip state={course.state} className="hidden sm:inline-flex" />
        </div>
      )}

      {stepper && <Stepper {...stepper} />}
      {account && <div className={cn('flex items-stretch', !course && !stepper && 'ml-auto')}><AccountMenu /></div>}
    </header>
  )
}

/**
 * The one place the brand is drawn, and the way back to the Course Library from
 * every station. Off the Library itself, a chevron hints the mark is a way back.
 */
function Identity({ onLibrary, divided }: { onLibrary?: () => void; divided: boolean }) {
  const mark = (
    <span className="grid size-[1.5rem] shrink-0 place-items-center text-[1.1875rem] leading-none transition-transform duration-150 group-active/mark:scale-[0.94]">
      🐬
    </span>
  )

  const cell = cn(
    'group/mark relative flex shrink-0 items-center gap-2 px-4 md:px-5',
    divided && 'border-r border-rule-strong',
  )

  if (!onLibrary)
    return (
      <span className={cell}>
        {mark}
        <span className="label hidden pt-px text-ink-soft sm:inline">Dolphin</span>
      </span>
    )

  return (
    <button onClick={onLibrary} aria-label="course library" className={cell}>
      <ChevronLeft
        size={16}
        strokeWidth={2}
        className="shrink-0 text-ink-faint transition-colors duration-150 group-hover/mark:text-ink"
      />
      {mark}
      <span className="label hidden pt-px text-ink-soft transition-colors duration-150 group-hover/mark:text-ink sm:inline">
        Dolphin
      </span>
      <span className="label pointer-events-none absolute top-full left-4 z-40 mt-2 scale-95 border border-rule bg-paper-raised px-2 py-1.5 whitespace-nowrap text-ink-faint opacity-0 shadow-[0_12px_32px_-12px_rgba(16,15,15,0.22)] transition-[opacity,transform] duration-150 group-hover/mark:scale-100 group-hover/mark:opacity-100">
        course library
      </span>
    </button>
  )
}

function Stepper({ n, of, lessons, modules, onJump, onPrev, onNext }: Stepper) {
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
    <div className="ml-auto flex shrink-0 items-stretch">
      <Step dir="prev" onClick={onPrev} />
      <Contents n={n} of={of} lessons={lessons} modules={modules} onJump={onJump} />
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
        'group/step relative grid w-11 shrink-0 place-items-center border-l border-rule-strong transition-colors',
        onClick
          ? 'text-ink-soft hover:bg-paper hover:text-ink active:bg-rule'
          : 'cursor-not-allowed text-ink-ghost/45',
      )}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  )
}

function Contents({ n, of, lessons, modules, onJump }: Omit<Stepper, 'onPrev' | 'onNext'>) {
  const done = lessons.filter((l) => l.complete).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group label flex shrink-0 items-center gap-1.5 border-l border-rule-strong px-3 text-ink-soft transition-colors hover:bg-paper hover:text-ink data-popup-open:bg-paper-raised data-popup-open:text-ink md:px-4 normal-case">
        <span className="hidden sm:inline">
          lesson {n} of {of}
        </span>
        <span className="sm:hidden">
          {n}/{of}
        </span>
        <ChevronDown size={12} strokeWidth={2.2} className="text-ink-faint transition-transform duration-200 group-data-popup-open:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="max-h-[70dvh] w-[min(26rem,calc(100vw-3rem))] overflow-y-auto border-rule bg-paper-raised p-0 shadow-[0_12px_32px_-12px_rgba(16,15,15,0.22)]"
      >
        <p className="label sticky top-0 flex items-center justify-between border-b border-rule bg-paper-raised px-4 py-3 text-ink-faint normal-case">
          syllabus
          <span className="text-ink">
            {done} of {of} complete
          </span>
        </p>
        {groupByModule(lessons, modules).map(({ module, items }) => (
          <DropdownMenuGroup key={module.n}>
            <DropdownMenuLabel className="border-b border-rule-soft bg-paper-sunk px-4 py-2 text-ink-faint label normal-case">
              {module.title}
            </DropdownMenuLabel>
            {items.map((l) => {
              const i = lessons.indexOf(l)
              return (
                <DropdownMenuItem
                  key={l.id}
                  onClick={() => onJump(i)}
                  aria-current={l.n === n ? 'true' : undefined}
                  className={cn(
                    'items-baseline gap-3 border-b border-rule-soft px-4 py-3 last:border-b-0',
                    l.n === n && 'bg-accent-wash',
                  )}
                >
                  <span className="numeral grid w-5 shrink-0 justify-items-center text-[0.6875rem] text-ink-faint">
                    {l.complete ? <Check size={13} strokeWidth={2.4} className="text-pass" /> : String(l.n).padStart(2, '0')}
                  </span>
                  <span className={cn('title min-w-0 flex-1 text-[0.9375rem]/snug', l.n === n ? 'text-accent' : 'font-normal text-ink-soft')}>
                    {l.title}
                  </span>
                  <span className="label shrink-0 text-ink-faint normal-case">{l.minutes}m</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
