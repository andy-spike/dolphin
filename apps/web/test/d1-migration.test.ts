import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

import { readProofRow } from '@/server/db/read-proof'

describe('d1 migration check', () => {
  it('reads the seed row through readProofRow', async () => {
    const row = await readProofRow(env.DB)

    expect(row).toEqual({ id: 1, note: 'd1-drizzle-plumbing' })
  })
})
