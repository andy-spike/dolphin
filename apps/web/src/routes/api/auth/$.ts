import { createFileRoute } from '@tanstack/react-router'

async function handleAuthRequest({ request }: { request: Request }): Promise<Response> {
  const [{ env }, { createAuth }] = await Promise.all([
    import('cloudflare:workers'),
    import('@/server/auth'),
  ])

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
