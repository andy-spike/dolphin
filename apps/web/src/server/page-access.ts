import { createServerFn } from '@tanstack/react-start'

/**
 * Central page guard, called once from the root route's `beforeLoad` so every
 * SSR request and client navigation checks the real session server-side.
 * Returns the signed-in Student's session, or null for anonymous callers;
 * the caller decides how to redirect. Public pages (/sign-in, /sign-up) skip
 * this via the path check in __root.tsx.
 */
export const getStudentPage = createServerFn({ method: 'GET' }).handler(async () => {
  const [{ getRequestHeaders }, { resolveStudentSession }] = await Promise.all([
    import('@tanstack/react-start/server'),
    import('./students'),
  ])

  return resolveStudentSession(getRequestHeaders())
})
