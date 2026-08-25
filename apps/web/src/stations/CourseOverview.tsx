import { useState } from 'react'
import { ArrowRight, Check, FileText, Link2, Pencil, Play, Trash2, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { stateTone } from '@/lib/state'
import { groupByModule } from '@/lib/modules'
import { Button } from '@/components/ui/button'
import { Spine } from '@/components/Spine'
import { StateChip } from '@/components/StateChip'
import { StationHead } from '@/components/StationHead'
import { CourseLock } from '@/components/CourseLock'
import { Fact, opening } from '@/components/Ruled'
import type { Course } from '@/mock/types'

/**
 * What a Course looks like when it is not open. The Course Library is an index
 * of Courses; this is the index of one Course — where it stands, what is inside
 * it, the Brief that produced it, and the folder it lives in.
 *
 * It is the only station that holds a Course's whole shape at once, so it is
 * also where the Brief is edited and where a Course is deleted.
 */
export function CourseOverviewStation({
  course,
  onLesson,
  onEditBrief,
  onTailor,
  onDelete,
  onLibrary,
  locked,
}: {
  course: Course
  locked: boolean
  onLesson: (i: number) => void
  onEditBrief: () => void
  onTailor: () => void
  onDelete: () => void
  onLibrary: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const tone = stateTone[course.state]
  const done = course.lessons.filter((l) => l.complete).length
  const total = course.lessons.length
  const pct = total ? Math.round((done / total) * 100) : 0
  const nextIndex = Math.max(0, course.lessons.findIndex((l) => !l.complete))
  const next = course.lessons[nextIndex]
  const minutesLeft = course.lessons.filter((l) => !l.complete).reduce((t, l) => t + l.minutes, 0)

  return (
    <>
      <StationHead course={course} station="course" onLibrary={onLibrary} />

      {locked && <CourseLock files={['lesson-05.md', 'syllabus.md']} />}

      <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
        <div className="mx-auto w-full max-w-[54rem] px-6 pt-14 pb-24 md:px-10 md:pt-20">
          <header className="station-in">
            <StateChip state={course.state} />
            <h1 className="display mt-4 text-[clamp(2rem,4.5vw,2.875rem)]">{course.topic}</h1>
            <p className="supporting mt-5 max-w-[54ch] text-ink-soft">{course.goal}</p>
          </header>

          {/* where the Course stands, in its own hue — the Library row's right column, given room */}
          <div className={cn('mt-11 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pb-7', opening, 'pt-7')}>
            <div className="flex items-end gap-6">
              <p className={cn('numeral text-[3rem] leading-none tabular-nums', pct ? tone.text : 'text-ink-faint')}>
                {pct}
                <span className="text-[1.25rem] opacity-55">%</span>
              </p>
              <div className="pb-1.5">
                <Spine total={total} filled={done} fill={tone.fill} className="w-40 sm:w-56" />
                <p className="label mt-3 flex flex-wrap items-center gap-2.5 text-ink-faint">
                  {done} of {total} lessons
                  {minutesLeft > 0 && (
                    <>
                      <span className="size-[3px] bg-rule-strong" />
                      {Math.floor(minutesLeft / 60)}h {minutesLeft % 60}m left
                    </>
                  )}
                </p>
              </div>
            </div>

            <Button onClick={() => onLesson(nextIndex)}>
              <Play size={12} strokeWidth={2.4} className="fill-current" />
              {done === 0 ? 'start lesson 1' : `continue — lesson ${next?.n ?? 1}`}
            </Button>
          </div>

          <section className="mt-12">
            <h2 className="label text-ink-faint">contents</h2>
            <div className={cn('mt-5 pt-6', opening)}>
              {groupByModule(course.lessons, course.modules).map(({ module, items }) => (
                <div key={module.n} className="mt-9 first:mt-0">
                  <p className="label mb-3 text-ink-faint">{module.title}</p>
                  <ol>
                    {items.map((l) => (
                      <li key={l.id} className="border-b border-rule">
                        <button
                          onClick={() => onLesson(course.lessons.indexOf(l))}
                          className="group relative flex w-full items-center gap-4 py-4 text-left"
                        >
                          <span className="pointer-events-none absolute -inset-x-4 -inset-y-px -z-10 bg-accent-wash opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          <span className="grid w-6 shrink-0 place-items-center">
                            {l.complete ? (
                              <Check size={14} strokeWidth={2.6} className="text-pass" />
                            ) : (
                              <span className="numeral text-[0.75rem] text-ink-faint">
                                {String(l.n).padStart(2, '0')}
                              </span>
                            )}
                          </span>
                          <span
                            className={cn(
                              'title min-w-0 flex-1 text-[1.0625rem]/snug transition-colors group-hover:text-accent',
                              !l.complete && 'font-normal text-ink-soft',
                            )}
                          >
                            {l.title}
                          </span>
                          <span className="label shrink-0 text-ink-faint">{l.minutes}m</span>
                          <ArrowRight
                            size={15}
                            strokeWidth={2}
                            className="shrink-0 text-ink-ghost/50 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
                          />
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-14 grid gap-x-12 gap-y-14 lg:grid-cols-2">
            <section>
              <div className="flex items-center justify-between border-b border-rule pb-2.5">
                <h2 className="label text-ink-faint">brief</h2>
                <button
                  onClick={onEditBrief}
                  className="label inline-flex items-center gap-1.5 text-ink-faint transition-colors hover:text-accent"
                >
                  <Pencil size={11} strokeWidth={2} />
                  edit
                </button>
              </div>
              <dl className="supporting text-[0.875rem]">
                <Fact term="topic">{course.topic}</Fact>
                <Fact term="goal">{course.goal}</Fact>
                <Fact term="difficulty">{course.difficulty}</Fact>
                <Fact term="time budget">{course.timeBudget}</Fact>
                <Fact term="sources">
                  {course.sources.length ? (
                    <ul className="space-y-1.5">
                      {course.sources.map((s) => (
                        <li key={s.label} className="flex items-start gap-2">
                          {s.kind === 'url' ? (
                            <Link2 size={12} strokeWidth={1.8} className="mt-1 shrink-0 text-ink-faint" />
                          ) : (
                            <FileText size={12} strokeWidth={1.8} className="mt-1 shrink-0 text-ink-faint" />
                          )}
                          <span className="numeral text-[0.75rem] break-words">{s.label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-ink-faint">none</span>
                  )}
                </Fact>
                <Fact term="web search">{course.webSearch ? 'on' : 'off'}</Fact>
              </dl>
            </section>

            <section>
              <h2 className="label border-b border-rule pb-2.5 text-ink-faint">the course folder</h2>
              <p className="numeral mt-4 break-words text-[0.8125rem] text-ink-soft">{course.folder}</p>
              <p className="supporting mt-3 text-[0.8125rem] text-ink-faint">
                {total} markdown files, one per lesson. yours to keep.
              </p>

              <div className="mt-8 space-y-3">
                <button
                  onClick={onTailor}
                  className="group flex w-full items-center gap-4 border border-rule bg-paper-raised px-5 py-4 text-left transition-colors duration-150 hover:border-accent-soft hover:bg-accent-wash"
                >
                  <Wand2 size={15} strokeWidth={1.8} className="shrink-0 text-ink-faint transition-colors group-hover:text-accent" />
                  <span className="min-w-0 flex-1">
                    <span className="label block text-ink transition-colors group-hover:text-accent">tailor this course</span>
                    <span className="supporting mt-1.5 block text-[0.8125rem] text-ink-faint">
                      ask the tutor to rewrite any lesson, finished or not.
                    </span>
                  </span>
                </button>

                {confirming ? (
                  <div className="border border-fail/25 bg-fail-wash px-5 py-4">
                    <p className="supporting text-[0.875rem] text-ink-soft">
                      <span className="font-semibold text-fail">delete this course?</span> the {total} markdown files in{' '}
                      <code className="numeral bg-fail/8 px-1.5 py-0.5 text-[0.8125rem] text-fail">{course.folder}</code>{' '}
                      go with it. progress cannot be recovered.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button variant="quiet" onClick={() => setConfirming(false)}>
                        keep it
                      </Button>
                      <Button variant="danger" onClick={onDelete}>
                        <Trash2 size={13} strokeWidth={1.9} />
                        delete the course
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(true)}
                    className="label flex w-full items-center gap-4 border border-rule bg-paper-raised px-5 py-4 text-left text-ink-faint transition-colors duration-150 hover:border-fail/40 hover:bg-fail-wash hover:text-fail"
                  >
                    <Trash2 size={15} strokeWidth={1.8} className="shrink-0" />
                    delete this course
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
