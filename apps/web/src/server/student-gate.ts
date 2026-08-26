import { createMiddleware } from '@tanstack/react-start'

import { isPublicPath } from '@/lib/public-paths'
import { resolveStudentSession } from './students'

function isPageNavigation(request: Request): boolean {
  if (request.method !== 'GET') return false
  const accept = request.headers.get('accept') ?? '*/*'
  return accept.includes('text/html') || accept === '*/*'
}

/**
 * The HTTP half of the centralized route guard, attached to the root route so
 * every SSR page request passes through it. Server functions and the mounted
 * `/api/*` routes are skipped: protected server functions call `requireStudent`
 * themselves (a route guard is UX, not the authorization boundary), and
 * `getStudentPage` must stay callable so client navigations can check.
 *
 * Returning a plain Response keeps redirect semantics at the HTTP layer in dev,
 * tests, and production alike — no dependency on router-internal handling of
 * thrown redirects during SSR.
 */
export const studentGate = createMiddleware().server(async ({ request, next }) => {
  const url = new URL(request.url)
  if (!isPageNavigation(request)) return next()
  if (!url.pathname.startsWith('/') || url.pathname.startsWith('/api/')) return next()
  if (isPublicPath(url.pathname)) return next()

  const session = await resolveStudentSession(new Headers(request.headers))
  if (session) return next()

  return new Response(null, {
    status: 307,
    headers: { location: new URL('/sign-in', url).toString() },
  })
})
