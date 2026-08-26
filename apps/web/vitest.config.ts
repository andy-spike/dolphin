import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Runs tests inside the Workers runtime (workerd) via Miniflare and loads the
// Worker entry from wrangler.jsonc (`main: ./src/server/index.ts`).
// The framework plugin and path alias are repeated here because the Workers
// Vitest integration builds `main` with its own Vite pipeline, which does not
// read the app-level vite.config.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
    }),
    tanstackStart(),
  ],
  // Node-side: read the checked-in drizzle migrations once and ship them to
  // test workers as a serializable value (`test/setup/apply-migrations.ts`
  // applies them against `env.DB`). readD1Migrations reads the filesystem, so
  // it must run here, not inside workerd.
  define: {
    __D1_MIGRATIONS__: JSON.stringify(
      await readD1Migrations(fileURLToPath(new URL('./drizzle', import.meta.url))),
    ),
  },
  test: {
    include: ['test/**/*.test.ts'],
    setupFiles: ['test/setup/apply-migrations.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
})
