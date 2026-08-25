import { useLayoutEffect, useRef } from 'react'
import { Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Prose } from '@/components/Prose'
import { ExerciseList } from '@/components/Exercises'
import { TutorMargin } from '@/components/Tutor'
import { StationHead } from '@/components/StationHead'
import { CourseLock } from '@/components/CourseLock'
import type { Course, Lesson } from '@/mock/types'

export function LessonStation({
  course,
  index,
  onStep,
  onToggleComplete,
  onOverview,
  onLibrary,
  locked,
  dockerDown,
}: {
  course: Course
  index: number
  onStep: (i: number) => void
  onToggleComplete: () => void
  onOverview: () => void
  onLibrary: () => void
  locked: boolean
  dockerDown: boolean
}) {
  const lesson = course.lessons[index]
  const prev = course.lessons[index - 1]
  const next = course.lessons[index + 1]

  return (
    <>
      <StationHead
        course={course}
        station="lesson"
        onLibrary={onLibrary}
        onCourse={onOverview}
        stepper={{
          n: lesson.n,
          of: course.lessons.length,
          lessons: course.lessons,
          modules: course.modules,
          onJump: onStep,
          onPrev: index > 0 ? () => onStep(index - 1) : undefined,
          onNext: next ? () => onStep(index + 1) : undefined,
        }}
      />

      {locked && <CourseLock files={[`lesson-${String(lesson.n).padStart(2, '0')}.md`, 'syllabus.md']} />}

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto xl:flex-row xl:overflow-hidden">
        <article key={lesson.id} className="min-h-0 flex-1 bg-paper xl:overflow-y-auto">
          <div className="mx-auto w-full max-w-[47.5rem] px-6 pt-12 pb-16 md:px-8 md:pt-16">
            <Frame
              className="station-in"
              margin={<span className="numeral text-[0.9375rem] text-ink-faint">{String(lesson.n).padStart(2, '0')}</span>}
            >
              <p className="label text-accent">{course.modules.find((m) => m.n === lesson.module)?.title}</p>
              <h1 className="display mt-2 text-[clamp(1.875rem,3.8vw,2.5rem)]">{lesson.title}</h1>
              <p className="label mt-5 flex flex-wrap items-center gap-2.5 text-ink-faint">
                lesson {lesson.n} of {course.lessons.length}
                <span className="size-[3px] bg-rule-strong" />
                {lesson.minutes} minutes
                {lesson.complete && (
                  <>
                    <span className="size-[3px] bg-rule-strong" />
                    <span className="inline-flex items-center gap-1 text-pass">
                      <Check size={12} strokeWidth={2.6} />
                      complete
                    </span>
                  </>
                )}
              </p>
            </Frame>

            <Section title="concept">
              <Prose blocks={lesson.concept} />
            </Section>
            <Section title="examples">
              <Prose blocks={lesson.examples} />
            </Section>
            <Section title="exercises">
              <ExerciseList exercises={lesson.exercises} dockerDown={dockerDown} />
            </Section>

            <footer className="mt-16 lg:pl-[8.5rem]">
              <div className="pt-6">
                <button
                  onClick={onToggleComplete}
                  className={cn(
                    'label flex w-full items-center justify-center gap-2.5 border px-5 py-3 text-[0.75rem] transition-colors duration-150 normal-case',
                    lesson.complete
                      ? 'border-pass/25 bg-pass-wash text-pass hover:bg-pass/12'
                      : 'border-transparent bg-accent text-white hover:bg-accent-strong',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-4 place-items-center border',
                      lesson.complete ? 'border-pass bg-pass text-white' : 'border-white/45',
                    )}
                  >
                    {lesson.complete && <Check size={10} strokeWidth={3} />}
                  </span>
                  {lesson.complete ? 'marked complete' : 'mark this lesson complete'}
                </button>

                {(prev || next) && (
                  <div className={cn('mt-8 grid gap-4', prev && next ? 'grid-cols-2' : 'grid-cols-1')}>
                    {prev && <AdjacentLessonButton lesson={prev} direction="prev" onClick={() => onStep(index - 1)} />}
                    {next && <AdjacentLessonButton lesson={next} direction="next" onClick={() => onStep(index + 1)} />}
                  </div>
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

function AdjacentLessonButton({
  lesson,
  direction,
  onClick,
}: {
  lesson: Lesson
  direction: 'prev' | 'next'
  onClick: () => void
}) {
  const isPrev = direction === 'prev'
  const Icon = isPrev ? ArrowLeft : ArrowRight
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-5 border border-rule bg-paper-raised px-5 py-5 transition-colors duration-150 hover:border-accent-soft hover:bg-accent-wash',
        isPrev ? 'flex-row-reverse text-right' : 'text-left',
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="label block text-ink-faint transition-colors group-hover:text-accent">
          {isPrev ? 'previous lesson' : 'next lesson'}
        </span>
        <span className="title mt-2 block text-[1.125rem]/snug transition-colors group-hover:text-accent">
          {lesson.title}
        </span>
      </span>
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center border border-rule text-ink-faint transition-all duration-200 group-hover:border-accent-soft group-hover:bg-paper-raised group-hover:text-accent',
          isPrev ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
        )}
      >
        <Icon size={16} strokeWidth={1.9} />
      </span>
    </button>
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
  const rowRef = useRef<HTMLDivElement>(null)
  const marginColRef = useRef<HTMLDivElement>(null)

  // The margin column stretches to the section's full height by default (needed so a sticky
  // label inside it has room to travel as the Student scrolls) — but align-items: baseline,
  // the one thing that lines it up with the content's first line regardless of that content's
  // font size, can't apply to a stretched item; a grid item is sized by stretch OR positioned
  // by baseline, never both. So: borrow the grid's own baseline math for one frame to find the
  // right offset, then bake it in as padding on the still-stretched column.
  useLayoutEffect(() => {
    const row = rowRef.current
    const marginCol = marginColRef.current
    if (!row || !marginCol) return

    const align = () => {
      if (!marginCol.offsetParent) return // hidden below `lg`
      marginCol.style.paddingTop = '0px'
      row.style.alignItems = 'baseline'
      const baselineTop = marginCol.getBoundingClientRect().top
      row.style.alignItems = ''
      const stretchTop = marginCol.getBoundingClientRect().top
      marginCol.style.paddingTop = `${baselineTop - stretchTop}px`
    }

    align()
    window.addEventListener('resize', align)
    return () => window.removeEventListener('resize', align)
  }, [])

  return (
    <div ref={rowRef} className={cn('lg:grid lg:grid-cols-[6.5rem_minmax(0,var(--measure))] lg:gap-x-8', className)}>
      <div ref={marginColRef} className="hidden lg:flex lg:items-start lg:justify-end">
        {margin}
      </div>
      {/* The mobile-only heading before `children` stays in the DOM at lg+ (just hidden),
          so it breaks `first:` on the block after it — force that block's margin here instead. */}
      <div className="min-w-0 max-w-[var(--measure)] lg:max-w-none lg:[&>h3+*]:mt-0">{children}</div>
    </div>
  )
}

/** The section name hangs in the margin and stays with the Student as they read. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 lg:mt-20">
      <Frame margin={<span className="label sticky top-4 text-ink-faint">{title}</span>}>
        <h3 className="label mb-5 flex items-center gap-3 text-ink-faint lg:hidden">
          {title}
          <span className="h-px flex-1 bg-rule" />
        </h3>
        {children}
      </Frame>
    </section>
  )
}
