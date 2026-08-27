import { createServerFn } from '@tanstack/react-start'

export const getStudentPage = createServerFn({ method: 'GET' }).handler(async () => {
  const [{ getRequest }, { resolveStudentSession }] = await Promise.all([
    import('@tanstack/react-start/server'),
    import('./students'),
  ])

  return resolveStudentSession(getRequest())
})
