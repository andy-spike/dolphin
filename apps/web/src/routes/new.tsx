import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Brief } from '@/components/Brief'
import { useDemoStore } from '@/lib/demo-store'

export const Route = createFileRoute('/new')({ component: New })

function New() {
  const { courses } = useDemoStore()
  const navigate = useNavigate()
  const drafting = courses.find((c) => c.state === 'Drafting') ?? courses[0]

  return (
    <Brief
      onSubmit={() => navigate({ to: '/courses/$courseId', params: { courseId: drafting.id } })}
      onLibrary={() => navigate({ to: '/' })}
    />
  )
}
