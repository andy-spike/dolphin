import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDemoStore } from '@/lib/demo-store'
import { SyllabusStation } from '@/stations/Syllabus'
import { GeneratingStation } from '@/stations/Generating'
import { LessonStation } from '@/stations/Lesson'
import { CourseCloseStation } from '@/stations/CourseClose'

export const Route = createFileRoute('/courses/$courseId')({
  validateSearch: (search: Record<string, unknown>): { lesson?: number } => {
    const lesson = Number(search.lesson)
    return Number.isFinite(lesson) ? { lesson } : {}
  },
  component: CoursePage,
})

/** The Course State decides the station; the Student never navigates to one directly. */
function CoursePage() {
  const { courseId } = Route.useParams()
  const { lesson } = Route.useSearch()
  const { courses, toggleComplete, setBusy, fault } = useDemoStore()
  const navigate = useNavigate()

  const course = courses.find((c) => c.id === courseId)
  const toLibrary = () => navigate({ to: '/' })

  const goToLesson = (courseId: string, index: number, replace?: boolean) =>
    navigate({ to: '/courses/$courseId', params: { courseId }, search: { lesson: index }, replace })

  // Pin the Student's lesson to the URL as soon as they land without one, so marking it
  // complete can't recompute "first incomplete" out from under them and jump them forward.
  useEffect(() => {
    if (!course || lesson !== undefined) return
    if (course.state === 'Drafting' || course.state === 'Generating' || course.state === 'Complete') return
    const firstIncomplete = course.lessons.findIndex((l) => !l.complete)
    goToLesson(course.id, firstIncomplete === -1 ? 0 : firstIncomplete, true)
  }, [course, lesson])

  if (!course) {
    return (
      <div className="flex flex-1 flex-col items-start gap-4 p-10">
        <p className="supporting text-ink-soft">No Course by that id.</p>
        <button onClick={toLibrary} className="label text-accent underline">
          Back to the Course Library
        </button>
      </div>
    )
  }

  switch (course.state) {
    case 'Drafting':
      return (
        <SyllabusStation
          course={course}
          onLibrary={toLibrary}
          onGenerate={() => navigate({ to: '/courses/$courseId', params: { courseId: courses[2].id } })}
        />
      )
    case 'Generating':
      return (
        <GeneratingStation
          course={course}
          onBusy={setBusy}
          onLibrary={toLibrary}
          onOpen={() => goToLesson(courses[0].id, 2)}
        />
      )
    case 'Complete':
      return (
        <CourseCloseStation course={course} onLibrary={toLibrary} onReread={() => goToLesson(course.id, 0)} />
      )
    default: {
      const firstIncomplete = course.lessons.findIndex((l) => !l.complete)
      const index = lesson ?? (firstIncomplete === -1 ? 0 : firstIncomplete)
      return (
        <LessonStation
          course={course}
          index={index}
          onStep={(i) => goToLesson(course.id, i)}
          onToggleComplete={() => toggleComplete(course, index)}
          onLibrary={toLibrary}
          dockerDown={fault === 'docker'}
        />
      )
    }
  }
}
