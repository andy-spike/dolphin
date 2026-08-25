import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BriefStation } from '@/stations/Brief'
import { NotFoundStation } from '@/stations/NotFound'
import { useDemoStore } from '@/lib/demo-store'

export const Route = createFileRoute('/courses/$courseId_/brief')({ component: EditBrief })

/** The Brief a Course was generated from. Saving it never touches lessons already on disk. */
function EditBrief() {
  const { courseId } = Route.useParams()
  const { courses, saveBrief } = useDemoStore()
  const navigate = useNavigate()

  const course = courses.find((c) => c.id === courseId)
  const toLibrary = () => navigate({ to: '/' })
  const back = () => navigate({ to: '/courses/$courseId', params: { courseId } })

  if (!course) return <NotFoundStation what={courseId} onLibrary={toLibrary} onNew={() => navigate({ to: '/new' })} />

  return (
    <BriefStation
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
