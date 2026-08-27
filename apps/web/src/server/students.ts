import type { betterAuth } from 'better-auth'

import { createAuth } from './auth'

type Auth = ReturnType<typeof betterAuth>
export type StudentSession = NonNullable<Awaited<ReturnType<Auth['api']['getSession']>>>

export async function resolveStudentSession(request: Request): Promise<StudentSession | null> {
  const [{ env }] = await Promise.all([import('cloudflare:workers')])

  const auth = createAuth(env, new URL(request.url).origin)
  return auth.api.getSession({ headers: new Headers(request.headers) })
}

export async function requireStudent(request: Request): Promise<StudentSession> {
  const session = await resolveStudentSession(request)
  if (!session) {
    throw new Error('unauthorized: this data needs a signed-in Student')
  }
  return session
}
