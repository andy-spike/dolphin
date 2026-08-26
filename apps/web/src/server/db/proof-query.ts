import { createServerFn } from '@tanstack/react-start'

// Request-time D1 + Drizzle read for ticket 02, now behind the Student
// session: anonymous callers are rejected here rather than trusted to have
// passed a route guard (`beforeLoad` is UX, not an authorization boundary).
// The handler imports `cloudflare:workers` and server modules dynamically so
// neither the runtime module nor drizzle/better-auth is reachable from a
// client bundle; TanStack Start runs this handler server-side only.
export const getMigrationCheckNote = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [{ getRequestHeaders }, { requireStudent }, { readProofRow }] = await Promise.all([
      import('@tanstack/react-start/server'),
      import('../students'),
      import('./read-proof'),
    ])

    await requireStudent(getRequestHeaders())

    const [{ env }] = await Promise.all([import('cloudflare:workers')])
    return (await readProofRow(env.DB))?.note ?? null
  },
)
