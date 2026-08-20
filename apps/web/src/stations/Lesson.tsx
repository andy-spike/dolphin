import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Prose } from '@/components/Prose'
import { ExerciseList } from '@/components/Exercises'
import { TutorMargin } from '@/components/Tutor'
import { StationHead } from '@/components/StationHead'
import type { Course } from '@/mock/types'

export function LessonStation({
  course,
  index,
  onStep,
  onToggleComplete,
  dockerDown,
}: {
  course: Course
  index: number
  onStep: (i: number) => void
  onToggleComplete: () => void
  dockerDown: boolean
}) {
  const lesson = course.lessons[index]
  const next = course.lessons[index + 1]

  return (
    <>
      <StationHead
        course={course}
        station="Lesson"
        stepper={{
          n: lesson.n,
          of: course.lessons.length,
          lessons: course.lessons,
          onJump: onStep,
          onPrev: index > 0 ? () => onStep(index - 1) : undefined,
          onNext: next ? () => onStep(index + 1) : undefined,
        }}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto xl:flex-row xl:overflow-hidden">
        <article key={lesson.id} className="min-h-0 flex-1 bg-paper xl:overflow-y-auto">
          <div className="mx-auto w-full max-w-[47.5rem] px-6 pt-12 pb-16 md:px-8 md:pt-16">
            <Frame
              className="station-in"
              margin={<span className="numeral text-[0.9375rem] text-ink-faint">{String(lesson.n).padStart(2, '0')}</span>}
            >
              <h2 className="display text-[clamp(1.875rem,3.8vw,2.5rem)]">{lesson.title}</h2>
              <p className="label mt-5 flex flex-wrap items-center gap-2.5 text-ink-faint">
                Lesson {lesson.n} of {course.lessons.length}
                <span className="size-[3px] rounded-full bg-rule-strong" />
                {lesson.minutes} minutes
                {lesson.complete && (
                  <>
                    <span className="size-[3px] rounded-full bg-rule-strong" />
                    <span className="inline-flex items-center gap-1 text-pass">
                      <Check size={12} strokeWidth={2.6} />
                      Complete
                    </span>
                  </>
                )}
              </p>
            </Frame>

            <Section title="Concept">
              <Prose blocks={lesson.concept} />
            </Section>
            <Section title="Examples">
              <Prose blocks={lesson.examples} />
            </Section>
            <Section title="Exercises">
              <ExerciseList exercises={lesson.exercises} dockerDown={dockerDown} />
            </Section>

            <footer className="mt-16 lg:pl-[8.5rem]">
              <div className="border-t border-ink/85 pt-6">
                <button
                  onClick={onToggleComplete}
                  className={cn(
                    'label inline-flex items-center gap-2.5 rounded-full px-5 py-3 transition-colors duration-150',
                    lesson.complete
                      ? 'border border-pass/25 bg-pass-wash text-pass hover:bg-pass/12'
                      : 'bg-accent text-white hover:bg-accent-strong',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-4 place-items-center rounded-full border',
                      lesson.complete ? 'border-pass bg-pass text-white' : 'border-white/45',
                    )}
                  >
                    {lesson.complete && <Check size={10} strokeWidth={3} />}
                  </span>
                  {lesson.complete ? 'Marked complete' : 'Mark this Lesson complete'}
                </button>

                {next && (
                  <button
                    onClick={() => onStep(index + 1)}
                    className="group mt-8 flex w-full items-center gap-5 rounded-[12px] border border-rule bg-paper-raised px-5 py-5 text-left transition-colors duration-150 hover:border-accent-soft hover:bg-accent-wash"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="label block text-ink-faint transition-colors group-hover:text-accent">Next lesson</span>
                      <span className="title mt-2 block text-[1.125rem]/snug transition-colors group-hover:text-accent">
                        {next.title}
                      </span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-rule text-ink-faint transition-all duration-200 group-hover:translate-x-1 group-hover:border-accent-soft group-hover:bg-paper-raised group-hover:text-accent">
                      <ArrowRight size={16} strokeWidth={1.9} />
                    </span>
                  </button>
                )}
              </div>
            </footer>
          </div>
        </article>

        <TutorMargin lessonTitle={lesson.title} lessonComplete={lesson.complete} />
      </div>
    </>
  )
}

/**
 * The lesson sets on a two-column frame: a narrow left margin, and one 38rem
 * reading column. Below `lg` the margin folds away and its contents move above.
 */
function Frame({
  margin,
  children,
  className,
}: {
  margin?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('lg:grid lg:grid-cols-[6.5rem_minmax(0,var(--measure))] lg:gap-x-8', className)}>
      <div className="hidden lg:flex lg:items-start lg:justify-end lg:pt-3">{margin}</div>
      <div className="min-w-0 max-w-[var(--measure)] lg:max-w-none">{children}</div>
    </div>
  )
}

/** The section name hangs in the margin and stays with the Student as they read. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 lg:mt-20">
      <Frame
        margin={<span className="label sticky top-4 text-ink-faint">{title}</span>}
      >
        <h3 className="label mb-5 flex items-center gap-3 text-ink-faint lg:hidden">
          {title}
          <span className="h-px flex-1 bg-rule" />
        </h3>
        {children}
      </Frame>
    </section>
  )
}
