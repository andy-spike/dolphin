import { Plus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { stateTone } from '@/lib/state'
import { StateChip } from '@/components/StateChip'
import { Spine } from '@/components/Spine'
import { Button } from '@/components/Button'
import type { Course } from '@/mock/types'

const counted = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
const count = (n: number, one: string, many: string) => `${counted[n] ?? n} ${n === 1 ? one : many}`

export function LibraryStation({
  courses,
  onOpen,
  onNew,
}: {
  courses: Course[]
  onOpen: (c: Course) => void
  onNew: () => void
}) {
  const studying = courses.filter((c) => c.state === 'In Progress').length

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-rule bg-paper/85 px-6 py-2.5 backdrop-blur-sm md:px-10">
        <span className="label text-ink">Dolphin</span>
        <span className="ml-auto numeral text-[0.75rem] text-ink-faint">~/dolphin</span>
      </div>

      <div className="mx-auto w-full max-w-[62rem] px-6 pb-24 md:px-10">
        <header className="station-in flex flex-wrap items-end justify-between gap-6 pt-14 pb-8 md:pt-20">
          <div>
            <h1 className="display text-[clamp(2.25rem,5vw,3.25rem)]">
              Course
              <br />
              Library
            </h1>
            <p className="supporting mt-4 text-ink-soft">
              {courses.length === 0
                ? 'Nothing here yet.'
                : `${count(courses.length, 'course', 'courses')}. ${count(studying, 'in progress', 'in progress')}.`}
            </p>
          </div>
          <Button onClick={onNew}>
            <Plus size={14} strokeWidth={2.2} />
            New course
          </Button>
        </header>

        {courses.length === 0 ? (
          <EmptyLibrary onNew={onNew} />
        ) : (
          <>
            <ol className="border-t border-ink/85">
              {courses.map((c, i) => (
                <Row key={c.id} course={c} n={i + 1} onOpen={() => onOpen(c)} />
              ))}
            </ol>
            <p className="supporting mt-10 max-w-[48ch] text-[0.875rem] text-ink-faint">
              Every Course is markdown in <span className="numeral text-[0.8125rem] text-ink-soft">~/dolphin</span>. It
              stays readable without this app, and nothing leaves this machine.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ course, n, onOpen }: { course: Course; n: number; onOpen: () => void }) {
  const total = course.lessons.length || course.syllabus.length
  const done = course.lessons.filter((l) => l.complete).length
  const pct = total ? Math.round((done / total) * 100) : 0
  const tone = stateTone[course.state]
  const meta = [course.difficulty, course.timeBudget, course.webSearch ? 'web search' : null].filter(Boolean)

  return (
    <li className="border-b border-rule">
      <button
        onClick={onOpen}
        className="group relative flex w-full items-center gap-4 py-6 text-left sm:gap-5 md:gap-8"
      >
        {/* the row warms in its own State's hue, and bleeds past the measure */}
        <span
          className={cn(
            'pointer-events-none absolute -inset-x-4 -inset-y-px -z-10 rounded-[10px] opacity-0 transition-opacity duration-200 group-hover:opacity-100',
            tone.wash,
          )}
        />

        <span className="numeral w-7 shrink-0 self-start pt-1 text-[0.8125rem] text-ink-faint md:w-9 md:text-[0.9375rem]">
          {String(n).padStart(2, '0')}
        </span>

        <span className="min-w-0 flex-1">
          <StateChip state={course.state} className="mb-2.5" />
          <span className="title block max-w-[30ch] text-[1.1875rem]/[1.3] sm:text-[1.3125rem]/[1.28] md:text-[1.4375rem]/[1.25]">
            {course.topic}
          </span>
          <span className="supporting mt-2 block max-w-[54ch] text-[0.9375rem] text-ink-soft">{course.goal}</span>
          <span className="label mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-ink-faint">
            {meta.map((m, i) => (
              <span key={m as string} className="flex items-center gap-2.5">
                {i > 0 && <span className="size-[3px] rounded-full bg-rule-strong" />}
                {m}
              </span>
            ))}
          </span>

          {/* Below `sm` the right column folds into the row itself. */}
          <span className="mt-4 flex max-w-[16rem] items-center gap-3 sm:hidden">
            <Spine total={total} filled={done} fill={tone.fill} className="flex-1" />
            <span className="label shrink-0 text-ink-faint">
              {done}/{total}
            </span>
          </span>
        </span>

        <span className="hidden w-32 shrink-0 flex-col items-end gap-2.5 sm:flex">
          <span className={cn('numeral text-[1.375rem] leading-none tabular-nums', pct ? tone.text : 'text-ink-faint')}>
            {pct}
            <span className="text-[0.75rem] opacity-55">%</span>
          </span>
          <Spine total={total} filled={done} fill={tone.fill} className="w-full" />
          <span className="label text-ink-faint">
            {done} of {total} lessons
          </span>
        </span>

        <span className="hidden size-8 shrink-0 translate-x-0 place-items-center rounded-full border border-rule text-ink-faint transition-all duration-200 group-hover:translate-x-1 group-hover:border-transparent group-hover:bg-ink group-hover:text-paper sm:grid">
          <ArrowRight size={15} strokeWidth={2} />
        </span>
      </button>
    </li>
  )
}

function EmptyLibrary({ onNew }: { onNew: () => void }) {
  return (
    <div className="station-in border-t border-ink/85 pt-10">
      <p className="display max-w-[22ch] text-[clamp(1.5rem,3.2vw,1.9rem)] text-ink-soft">
        Describe what you want to learn, and argue with the outline until it is right.
      </p>
      <p className="supporting mt-6 max-w-[56ch] text-ink-soft">
        The Generator drafts a Syllabus from your Brief. Nothing is written to disk until you agree to it — and when it
        is, it is markdown you own.
      </p>
      <Button onClick={onNew} className="mt-8">
        <Plus size={14} strokeWidth={2.2} />
        Write your first Brief
      </Button>
    </div>
  )
}
