import { useRef, useState } from 'react'
import { ArrowUp, Pencil, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStream } from '@/lib/useStream'
import { groupByModule } from '@/lib/modules'
import { StationHead } from '@/components/StationHead'
import type { ChatTurn, Course } from '@/mock/types'

export function SyllabusStation({
  course,
  onGenerate,
  onLibrary,
}: {
  course: Course
  onGenerate: () => void
  onLibrary: () => void
}) {
  const [turns, setTurns] = useState<ChatTurn[]>(course.chat)
  const [draft, setDraft] = useState('')
  const [streamIndex, setStreamIndex] = useState(-1)
  const scroller = useRef<HTMLDivElement>(null)

  const minutes = course.syllabus.reduce((t, s) => t + s.minutes, 0)
  const budget = (parseInt(course.timeBudget, 10) || 8) * 60

  const send = () => {
    if (!draft.trim()) return
    const next: ChatTurn[] = [
      ...turns,
      { from: 'student', text: draft.trim() },
      {
        from: 'generator',
        text: 'Done — I have rewritten that entry and left the rest of the Syllabus alone. The total is unchanged at 7h 10m, still inside your 8 hour Time Budget.',
      },
    ]
    setTurns(next)
    setStreamIndex(next.length - 1)
    setDraft('')
    requestAnimationFrame(() => scroller.current?.scrollTo({ top: 9e6, behavior: 'smooth' }))
  }

  return (
    <>
      <StationHead course={course} station="syllabus" onLibrary={onLibrary} />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* The agreed outline. This is the artefact; the chat is how it changes. */}
        <section className="min-h-0 shrink-0 bg-paper lg:w-[27rem] lg:overflow-y-auto lg:border-r lg:border-rule xl:w-[31rem]">
          <div className="station-in px-6 pt-10 pb-8 md:px-8">
            <h1 className="display text-[clamp(1.75rem,3.5vw,2.125rem)]">syllabus</h1>
            <p className="label mt-4 flex items-center gap-2.5 text-ink-faint">
              {course.syllabus.length} lessons
              <span className="size-[3px] bg-rule-strong" />
              <span className={cn(minutes > budget && 'text-fail')}>
                {Math.floor(minutes / 60)}h {minutes % 60}m of {budget / 60}h
              </span>
            </p>

            <div className="mt-8 border-t border-ink/85">
              {groupByModule(course.syllabus, course.modules).map(({ module, items }) => (
                <div key={module.n}>
                  <p className="label mt-5 mb-1 text-ink-faint first:mt-0">{module.title}</p>
                  <ol>
                    {items.map((s) => (
                      <li key={s.n} className="flex gap-4 border-b border-rule py-4">
                        <span className="numeral w-6 shrink-0 pt-1 text-[0.75rem] text-ink-faint">
                          {String(s.n).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="title text-[1.0625rem]/snug">{s.title}</h3>
                          {s.note && <p className="supporting mt-1.5 text-[0.875rem] text-ink-soft">{s.note}</p>}
                        </div>
                        <span className="label shrink-0 pt-1.5 text-ink-faint">{s.minutes}m</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            <Brief course={course} />

            <div className="mt-10">
              <button
                onClick={onGenerate}
                className="label flex w-full items-center justify-center gap-2 bg-accent px-5 py-3.5 text-white transition-colors hover:bg-accent-strong"
              >
                <Sparkles size={14} strokeWidth={2} />
                generate the course
              </button>
              <p className="supporting mt-3.5 text-[0.8125rem] text-ink-faint">
                writes {course.syllabus.length} markdown files. you can stop it, and it resumes from the first missing
                lesson.
              </p>
            </div>
          </div>
        </section>

        {/* Free chat until the Student and the Generator agree. */}
        <section className="flex min-h-0 flex-1 flex-col border-t border-rule bg-paper-sunk lg:border-t-0">
          <h2 className="label shrink-0 border-b border-rule bg-transparent px-6 py-4 text-ink-faint">generator</h2>

          <div ref={scroller} className="min-h-0 flex-1 px-6 py-8 lg:overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-[36rem] flex-col justify-end gap-7">
              {turns.map((t, i) => (
                <Turn key={i} turn={t} streaming={i === streamIndex} />
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="sticky bottom-0 shrink-0 border-t border-rule bg-paper-sunk p-4"
          >
            <div className="mx-auto flex max-w-[36rem] items-end gap-2 border border-rule bg-paper-raised px-3.5 py-3 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-wash">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                rows={2}
                placeholder="Change something before you agree…"
                className="max-h-32 flex-1 resize-none bg-transparent supporting outline-none placeholder:text-ink-faint"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send"
                className={cn(
                  'grid size-9 shrink-0 place-items-center transition-colors',
                  draft.trim() ? 'bg-accent text-white hover:bg-accent-strong' : 'bg-rule text-ink-faint/60',
                )}
              >
                <ArrowUp size={16} strokeWidth={2.2} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}

function Brief({ course }: { course: Course }) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between border-b border-rule pb-2.5">
        <h3 className="label text-ink-faint">brief</h3>
        <button className="label inline-flex items-center gap-1.5 text-ink-faint transition-colors hover:text-accent">
          <Pencil size={11} strokeWidth={2} />
          edit
        </button>
      </div>
      <dl className="supporting text-[0.875rem]">
        <Row term="topic">{course.topic}</Row>
        <Row term="goal">{course.goal}</Row>
        <Row term="difficulty">{course.difficulty}</Row>
        <Row term="time budget">{course.timeBudget}</Row>
        <Row term="sources">
          {course.sources.length ? (
            <ul className="space-y-1">
              {course.sources.map((s) => (
                <li key={s.label} className="numeral text-[0.75rem] break-words">
                  {s.label}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-ink-faint">none</span>
          )}
        </Row>
        <Row term="web search">{course.webSearch ? 'on' : 'off'}</Row>
      </dl>
    </div>
  )
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-rule-soft py-3">
      <dt className="label w-24 shrink-0 pt-1 text-ink-faint">{term}</dt>
      <dd className="min-w-0 flex-1 text-ink-soft">{children}</dd>
    </div>
  )
}

function Turn({ turn, streaming }: { turn: ChatTurn; streaming: boolean }) {
  const { shown, done } = useStream(turn.text, streaming && turn.from === 'generator')

  if (turn.from === 'student') {
    return (
      <div className="self-end max-w-[90%] bg-accent px-4 py-3">
        <p className="label mb-1.5 text-white/70">you</p>
        <p className="supporting text-[0.9375rem] text-white">{turn.text}</p>
      </div>
    )
  }
  return (
    <div>
      <p className="label mb-2 text-ink-faint">generator</p>
      <p className="supporting text-ink-soft">
        {shown}
        {!done && <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-0.5 bg-accent" />}
      </p>
    </div>
  )
}
