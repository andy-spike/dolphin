import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BriefStation } from '@/stations/Brief'
import { useDemoStore } from '@/lib/demo-store'

export const Route = createFileRoute('/new')({ component: New })

/** No live Generator yet — a new Brief opens the mock Course that is still Drafting. */
function New() {
  const { courses } = useDemoStore()
  const navigate = useNavigate()
  const drafting = courses.find((c) => c.state === 'Drafting') ?? courses[0]

  return (
    <BriefStation
      onSubmit={() => navigate({ to: '/courses/$courseId', params: { courseId: drafting.id } })}
      onLibrary={() => navigate({ to: '/' })}
    />
  )
}
