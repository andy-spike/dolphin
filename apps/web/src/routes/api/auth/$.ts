import { createFileRoute } from '@tanstack/react-router'

/**
 * Mounted Better Auth HTTP handler (`/api/auth/*`, public). Each request
 * builds its own auth instance from that request's bindings and origin, per
 * ADR 0004 — the auth object never outlives the request. The dynamic imports
 * keep `cloudflare:workers` and better-auth out of any client bundle.
 */
async function handleAuthRequest({ request }: { request: Request }): Promise<Response> {
  const [{ env }, { createAuth }] = await Promise.all([
    import('cloudflare:workers'),
    import('@/server/auth'),
  ])

  // The auth route must reflect where the Student's browser actually is:
  // baseURL/trusted-origin checks key off the request itself.
  const auth = createAuth(env, new URL(request.url).origin)
  return auth.handler(request)
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: handleAuthRequest,
      POST: handleAuthRequest,
    },
  },
})
