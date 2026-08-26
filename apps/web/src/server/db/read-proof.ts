import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

import { migrationCheck } from './schema'

// Ticket 02 seam: reads the known proof row through Drizzle on top of a D1
// binding. Takes the binding as an argument so callers own where it comes
// from (`env.DB` in requests, the emulated binding in tests).
export async function readProofRow(db: D1Database) {
  const d1 = drizzle(db)
  const rows = await d1
    .select()
    .from(migrationCheck)
    .where(eq(migrationCheck.id, 1))
    .limit(1)

  return rows.at(0) ?? null
}
