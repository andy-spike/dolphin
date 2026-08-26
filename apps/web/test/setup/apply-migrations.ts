/// <reference types="@cloudflare/vitest-plugin/types" />
import { applyD1Migrations } from 'cloudflare:test'
import { env } from 'cloudflare:workers'

// __D1_MIGRATIONS__ is injected Node-side by vitest.config.ts (see `define`
// there). Runs once per test file in workerd before any test executes, so
// every file sees a migrated emulated D1 database.
await applyD1Migrations(env.DB, __D1_MIGRATIONS__)
