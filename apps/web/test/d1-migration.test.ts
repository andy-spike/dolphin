import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

import { readProofRow } from '@/server/db/read-proof'

// Ticket 02 seam: the checked-in drizzle migrations are already applied to the
// emulated D1 binding by test/setup/apply-migrations.ts (via
// applyD1Migrations from cloudflare:test). This asserts the public read
// function finds the known seed row through Drizzle on `env.DB`.
describe('d1 migration check', () => {
  it('reads the seed row through readProofRow', async () => {
    const row = await readProofRow(env.DB)

    expect(row).toEqual({ id: 1, note: 'd1-drizzle-plumbing' })
  })
})
