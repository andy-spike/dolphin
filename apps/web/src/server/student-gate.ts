import { createMiddleware } from '@tanstack/react-start'

import { isPublicPath } from '@/lib/public-paths'
import { resolveStudentSession } from './students'

function isPageNavigation(request: Request): boolean {
  if (request.method !== 'GET') return false
  const accept = request.headers.get('accept') ?? '*/*'
  return accept.includes('text/html') || accept === '*/*'
}

export const studentGate = createMiddleware().server(async ({ request, next }) => {
  const url = new URL(request.url)
  if (!isPageNavigation(request)) return next()
  if (!url.pathname.startsWith('/') || url.pathname.startsWith('/api/')) return next()
  if (isPublicPath(url.pathname)) return next()

  const session = await resolveStudentSession(request)
  if (session) return next()

  return new Response(null, {
    status: 307,
    headers: { location: new URL('/sign-in', url).toString() },
  })
})
