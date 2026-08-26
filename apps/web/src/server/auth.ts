import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from './db/schema'

export interface AuthBindings {
  DB: D1Database
  /** High-entropy signing secret for sessions. Workers Secret in production, `.dev.vars` locally. */
  BETTER_AUTH_SECRET: string
}

/**
 * Request-scoped Better Auth instance. Workers hold no request-bound global
 * state, so callers construct one per request from that request's bindings
 * (the mounted `/api/auth/*` handlers and the server-side session resolvers).
 * Never hoist the returned instance above request scope.
 *
 * Only email/password for now: no email verification, password recovery,
 * cookie cache, OAuth providers, or extra plugins. Sign-up/sign-in/sign-out go
 * through the browser client hitting `/api/auth/*`, whose Response headers
 * carry cookies back to the Student, so no framework cookie plugin applies.
 */
export function createAuth(bindings: Pick<AuthBindings, 'DB' | 'BETTER_AUTH_SECRET'>, origin: string) {
  assertSecretConfigured(bindings.BETTER_AUTH_SECRET)

  return betterAuth({
    // Same origin as the incoming request, so the client SDK and the trusted
    // origin list stay aligned across dev (`localhost:5173`) and production.
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

/** Fails closed when the secret is absent or too weak rather than degrading to a default. */
function assertSecretConfigured(secret: string | undefined): asserts secret is string {
  if (!secret || secret.length < 32) {
    throw new Error('BETTER_AUTH_SECRET is missing or shorter than 32 characters')
  }
}
