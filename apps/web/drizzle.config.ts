import { defineConfig } from 'drizzle-kit'

// Output goes to the same directory wrangler applies D1 migrations from
// (apps/web/wrangler.jsonc -> d1_databases[].migrations_dir).
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/server/db/schema.ts',
  out: './drizzle',
})
