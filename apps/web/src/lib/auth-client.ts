import { createAuthClient } from 'better-auth/react'

/**
 * Browser-side Better Auth client for Dolphin's Student calls. Targets the
 * same-origin `/api/auth/*` mount; sessions arrive as cookies on those
 * responses, so browser authentication never routes through server actions.
 * Kept separate from `src/server/*` so better-auth's client code stays out of
 * server bundles and vice versa.
 */
export const authClient = createAuthClient()

/**
 * Signs the Student out and resolves only once the server has confirmed the
 * session is invalidated. Better Auth's client reports failures through its
 * returned `error` rather than rejecting, so both that error and a rejected
 * request reject here. Confirmations become throw-away noise otherwise.
 * Thrown errors carry no server detail; call sites show their own copy.
 */
export async function signOutStudent(): Promise<void> {
  let confirmed = false
  try {
    const result = await authClient.signOut()
    confirmed = !result.error && Boolean(result.data?.success)
  } catch {
    // A rejection means the outcome is unknown, which counts as unconfirmed.
    confirmed = false
  }
  if (!confirmed) {
    throw new Error('sign out was not confirmed')
  }
}
