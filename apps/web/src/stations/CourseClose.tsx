import { RotateCcw, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/Button'
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
      <StationHead course={course} station="Course complete" />

      <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
        <div className="station-in mx-auto w-full max-w-[44rem] px-6 pt-20 pb-20 md:px-10 md:pt-28">
          <h1 className="display text-[clamp(2rem,4.5vw,2.875rem)]">{course.topic}</h1>

          <p className="supporting mt-7 max-w-[54ch] text-ink-soft">
            Complete. You set out to {course.goal.charAt(0).toLowerCase() + course.goal.slice(1)}, and every Lesson is
            marked done.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ink/85 pt-8 sm:grid-cols-3">
            <Stat term="Lessons" value={String(course.lessons.length)} />
            <Stat term="Study time" value={`${Math.round(minutes / 60)}h`} />
            <Stat term="Difficulty" value={course.difficulty} word />
          </dl>

          <p className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-rule bg-paper-raised px-4 py-2.5 numeral text-[0.8125rem] text-ink-soft">
            <FolderOpen size={14} strokeWidth={1.8} className="text-ink-faint" />
            {course.folder}
          </p>
          <p className="supporting mt-4 max-w-[52ch] text-[0.875rem] text-ink-faint">
            The Course Folder is yours. The markdown stays on this machine whether or not you open Dolphin again.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button onClick={onReread}>
              <RotateCcw size={13} strokeWidth={2.2} />
              Read it again
            </Button>
            <Button variant="quiet" onClick={onLibrary}>
              Back to the Course Library
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
