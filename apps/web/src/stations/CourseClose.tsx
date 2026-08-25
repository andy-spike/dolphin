import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { StationHead } from '@/components/StationHead'
import type { Course } from '@/mock/types'

export function CourseCloseStation({
  course,
  onReread,
  onLibrary,
}: {
  course: Course
  onReread: () => void
  onLibrary: () => void
}) {
  const minutes = course.lessons.reduce((t, l) => t + l.minutes, 0)

  return (
    <>
      <StationHead course={course} station="course complete" />

      <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
        <div className="station-in mx-auto w-full max-w-[44rem] px-6 pt-20 pb-20 md:px-10 md:pt-28">
          <h1 className="display text-[clamp(2rem,4.5vw,2.875rem)]">{course.topic}</h1>

          <p className="supporting mt-7 max-w-[54ch] text-ink-soft">
            complete. you set out to {course.goal.charAt(0).toLowerCase() + course.goal.slice(1)}, and every lesson is
            marked done.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ink/85 pt-8 sm:grid-cols-3">
            <Stat term="lessons" value={String(course.lessons.length)} />
            <Stat term="study time" value={`${Math.round(minutes / 60)}h`} />
            <Stat term="difficulty" value={course.difficulty} word />
          </dl>

          <p className="supporting mt-10 max-w-[52ch] text-[0.875rem] text-ink-faint">
            the course folder is yours to keep, whether or not you open dolphin again.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button onClick={onReread}>
              <RotateCcw size={13} strokeWidth={2.2} />
              read it again
            </Button>
            <Button variant="quiet" onClick={onLibrary}>
              back to the course library
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

function Stat({ term, value, word }: { term: string; value: string; word?: boolean }) {
  return (
    <div>
      <dt className="label text-ink-faint">{term}</dt>
      <dd className={cn('mt-2.5 text-[1.625rem] leading-none text-ink', word ? 'title capitalize' : 'numeral')}>{value}</dd>
    </div>
  )
}
