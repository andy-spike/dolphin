import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LibraryStation } from '@/stations/Library'
import { useDemoStore } from '@/lib/demo-store'

export const Route = createFileRoute('/')({ component: Index })

function Index() {
  const { courses, empty } = useDemoStore()
  const navigate = useNavigate()

  return (
    <LibraryStation
      courses={empty ? [] : courses}
      onOpen={(c) => navigate({ to: '/courses/$courseId', params: { courseId: c.id } })}
      onNew={() => navigate({ to: '/new' })}
    />
  )
}
