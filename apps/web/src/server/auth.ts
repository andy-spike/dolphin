import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from './db/schema'

export interface AuthBindings {
  DB: D1Database

  BETTER_AUTH_SECRET: string
}

export function createAuth(bindings: Pick<AuthBindings, 'DB' | 'BETTER_AUTH_SECRET'>, origin: string) {
  assertSecretConfigured(bindings.BETTER_AUTH_SECRET)

  return betterAuth({

    baseURL: origin,
    secret: bindings.BETTER_AUTH_SECRET,
    database: drizzleAdapter(drizzle(bindings.DB), {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
    },
  })
}

function assertSecretConfigured(secret: string | undefined): asserts secret is string {
  if (!secret || secret.length < 32) {
    throw new Error('BETTER_AUTH_SECRET is missing or shorter than 32 characters')
  }
}
