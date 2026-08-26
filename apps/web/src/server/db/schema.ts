import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

// Trivial proof table for ticket 02: proves the D1 + Drizzle migration loop
// end to end. Plumbing only — later tickets add the real product tables.
export const migrationCheck = sqliteTable('migration_check', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  note: text('note').notNull(),
})
