import { createServerFn } from '@tanstack/react-start'

// Request-time D1 + Drizzle read for ticket 02. The handler imports
// `cloudflare:workers` and `read-proof` dynamically so neither the runtime
// module nor drizzle is reachable from a client bundle; TanStack Start runs
// this handler server-side only.
export const getMigrationCheckNote = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [{ env }, { readProofRow }] = await Promise.all([
      import('cloudflare:workers'),
      import('./read-proof'),
    ])

    return (await readProofRow(env.DB))?.note ?? null
  },
)
