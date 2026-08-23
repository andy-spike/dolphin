import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BriefStation } from '@/stations/Brief'
import { useDemoStore } from '@/lib/demo-store'

export const Route = createFileRoute('/new')({ component: New })

/** No live Generator yet — drafting a Brief opens the first mock Course, same as before the routing pass. */
function New() {
  const { courses } = useDemoStore()
  const navigate = useNavigate()

  return (
    <BriefStation
      onDraft={() => navigate({ to: '/courses/$courseId', params: { courseId: courses[0].id } })}
      onLibrary={() => navigate({ to: '/' })}
    />
  )
}
