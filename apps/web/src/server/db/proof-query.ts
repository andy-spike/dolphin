import { createServerFn } from '@tanstack/react-start'

export const getMigrationCheckNote = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [{ getRequest }, { requireStudent }, { readProofRow }] = await Promise.all([
      import('@tanstack/react-start/server'),
      import('../students'),
      import('./read-proof'),
    ])

    await requireStudent(getRequest())

    const [{ env }] = await Promise.all([import('cloudflare:workers')])
    return (await readProofRow(env.DB))?.note ?? null
  },
)
