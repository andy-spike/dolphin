
export const PUBLIC_PATHS = new Set(['/sign-in', '/sign-up'])

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname)
}
