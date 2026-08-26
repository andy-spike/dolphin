/**
 * Addresses an anonymous visitor may open; everything else needs a Student.
 *
 * Lives in `lib/`, not `server/student-gate.ts`: the root route reads it inside
 * `beforeLoad`, which runs in the client bundle too, and importing the server
 * middleware module from the router would drag Better Auth and Drizzle into
 * every page. Both halves of the guard share this one source of truth.
 */
export const PUBLIC_PATHS = new Set(['/sign-in', '/sign-up'])

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname)
}
