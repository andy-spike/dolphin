import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Brief } from '@/components/Brief'
import { NotFound } from '@/components/NotFound'
import { useDemoStore } from '@/lib/demo-store'

export const Route = createFileRoute('/courses/$courseId_/brief')({ component: EditBrief })

function EditBrief() {
  const { courseId } = Route.useParams()
  const { courses, saveBrief } = useDemoStore()
  const navigate = useNavigate()

  const course = courses.find((c) => c.id === courseId)
  const toLibrary = () => navigate({ to: '/' })
  const back = () => navigate({ to: '/courses/$courseId', params: { courseId } })

  if (!course) return <NotFound what={courseId} onLibrary={toLibrary} onNew={() => navigate({ to: '/new' })} />

  return (
    <Brief
      course={course}
      onSubmit={(values) => {
        saveBrief(course.id, values)
        back()
      }}
      onCancel={back}
      onLibrary={toLibrary}
    />
  )
}
