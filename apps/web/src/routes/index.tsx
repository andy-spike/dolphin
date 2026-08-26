import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LibraryStation } from '@/stations/Library'
import { useDemoStore } from '@/lib/demo-store'
import { getMigrationCheckNote } from '@/server/db/proof-query'

export const Route = createFileRoute('/')({
  // Ticket 02 plumbing proof: read the known seed row through D1 + Drizzle at
  // request time. Fail soft so the mocked library screen always renders, but
  // log why so misses show up in observability output.
  loader: async () => ({
    note: await getMigrationCheckNote().catch((error) => {
      console.warn('d1 migration check read failed:', error)
      return null
    }),
  }),
  component: Index,
})

function Index() {
  const { courses, empty } = useDemoStore()
  const navigate = useNavigate()
  const { note } = Route.useLoaderData()

  return (
    <>
      <LibraryStation
        courses={empty ? [] : courses}
        onOpen={(c) => navigate({ to: '/courses/$courseId', params: { courseId: c.id } })}
        onNew={() => navigate({ to: '/new' })}
      />
      {note ? (
        <p className="bg-paper px-6 pb-6 text-center text-xs text-muted-foreground md:px-10">
          d1 check: {note}
        </p>
      ) : null}
    </>
  )
}
