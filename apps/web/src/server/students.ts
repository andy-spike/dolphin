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

/** Resolves the signed-in Student's session from the current Request, or null. */
export async function resolveStudentSession(request: Request): Promise<StudentSession | null> {
  const [{ env }] = await Promise.all([import('cloudflare:workers')])
  // Origin comes from the request URL itself, matching the mounted auth
  // handler: Better Auth prefixes session cookies with `__Secure-` when the
  // baseURL is HTTPS, so any assumed or defaulted origin would look up the
  // wrong cookie name (and plain GET navigations carry no `origin` header).
  const auth = createAuth(env, new URL(request.url).origin)
  return auth.api.getSession({ headers: new Headers(request.headers) })
}

/** Resolves the current session or rejects anonymous callers. Protected server fns start here. */
export async function requireStudent(request: Request): Promise<StudentSession> {
  const session = await resolveStudentSession(request)
  if (!session) {
    throw new Error('unauthorized: this data needs a signed-in Student')
  }
  return session
}
