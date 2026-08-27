import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDemoStore } from '@/lib/demo-store'
import { SyllabusStation } from '@/stations/Syllabus'
import { GeneratingStation } from '@/stations/Generating'
import { CourseOverviewStation } from '@/stations/CourseOverview'
import { LessonStation } from '@/stations/Lesson'
import { CourseCloseStation } from '@/stations/CourseClose'
import { NotFound } from '@/components/NotFound'

export const Route = createFileRoute('/courses/$courseId')({
  validateSearch: (search: Record<string, unknown>): { lesson?: number } => {
    const lesson = Number(search.lesson)
    return Number.isFinite(lesson) ? { lesson } : {}
  },
  component: CoursePage,
})

function CoursePage() {
  const { courseId } = Route.useParams()
  const { lesson } = Route.useSearch()
  const { courses, toggleComplete, deleteCourse, setBusy, fault, locked } = useDemoStore()
  const navigate = useNavigate()

  const course = courses.find((c) => c.id === courseId)
  const toLibrary = () => navigate({ to: '/' })
  const toBrief = () => navigate({ to: '/courses/$courseId/brief', params: { courseId } })

  const goToLesson = (id: string, index: number) =>
    navigate({ to: '/courses/$courseId', params: { courseId: id }, search: { lesson: index } })

  if (!course)
    return <NotFound what={courseId} onLibrary={toLibrary} onNew={() => navigate({ to: '/new' })} />

  switch (course.state) {
    case 'Drafting':
      return (
        <SyllabusStation
          course={course}
          onLibrary={toLibrary}
          onEditBrief={toBrief}
          onGenerate={() => {
            const generating = courses.find((c) => c.state === 'Generating')
            if (generating) navigate({ to: '/courses/$courseId', params: { courseId: generating.id } })
          }}
        />
      )
    case 'Generating':
      return (
        <GeneratingStation
          course={course}
          onBusy={setBusy}
          onLibrary={toLibrary}
          onOpen={() => navigate({ to: '/courses/$courseId', params: { courseId: courses[0].id } })}
        />
      )
    case 'Complete':
      return (
        <CourseCloseStation course={course} onLibrary={toLibrary} onReread={() => goToLesson(course.id, 0)} />
      )
    default: {
      if (lesson === undefined)
        return (
          <CourseOverviewStation
            course={course}
            locked={locked}
            onLesson={(i) => goToLesson(course.id, i)}
            onEditBrief={toBrief}
            onTailor={() => goToLesson(course.id, course.lessons.findIndex((l) => !l.complete))}
            onDelete={() => {
              deleteCourse(course.id)
              toLibrary()
            }}
            onLibrary={toLibrary}
          />
        )

      const index = Math.min(Math.max(lesson, 0), course.lessons.length - 1)
      return (
        <LessonStation
          course={course}
          index={index}
          locked={locked}
          onStep={(i) => goToLesson(course.id, i)}
          onToggleComplete={() => toggleComplete(course, index)}
          onOverview={() => navigate({ to: '/courses/$courseId', params: { courseId: course.id } })}
          onLibrary={toLibrary}
          sandboxDown={fault === 'sandbox'}
        />
      )
    }
  }
}
