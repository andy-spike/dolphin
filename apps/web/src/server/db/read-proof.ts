import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

import { migrationCheck } from './schema'

export async function readProofRow(db: D1Database) {
  const d1 = drizzle(db)
  const rows = await d1
    .select()
    .from(migrationCheck)
    .where(eq(migrationCheck.id, 1))
    .limit(1)

  return rows.at(0) ?? null
}
