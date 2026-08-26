import type { betterAuth } from 'better-auth'

import { createAuth } from './auth'

type Auth = ReturnType<typeof betterAuth>
export type StudentSession = NonNullable<Awaited<ReturnType<Auth['api']['getSession']>>>

/**
 * Server-side Student access. These helpers run only inside request scope
 * (mounted auth handlers, server functions) — never in a client bundle.
 *
 * Route guards are UX; every protected server function also calls
 * `requireStudent`, because `beforeLoad` alone is not an authorization
 * boundary.
 */

/** Resolves the signed-in Student's session from the given request headers, or null. */
export async function resolveStudentSession(headers: Headers): Promise<StudentSession | null> {
  const [{ env }] = await Promise.all([import('cloudflare:workers')])
  // Session validation only reads the cookie against D1; the origin is used for
  // URL building, so a same-origin fallback is safe here. Browsers omit
  // `origin` on plain GET navigations.
  const origin = headers.get('origin') ?? 'http://localhost:5173'
  const auth = createAuth(env, origin)
  return auth.api.getSession({ headers })
}

/** Resolves the current session or rejects anonymous callers. Protected server fns start here. */
export async function requireStudent(headers: Headers): Promise<StudentSession> {
  const session = await resolveStudentSession(headers)
  if (!session) {
    throw new Error('unauthorized: this data needs a signed-in Student')
  }
  return session
}
