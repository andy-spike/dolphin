import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient()

export async function signOutStudent(): Promise<void> {
  let confirmed = false
  try {
    const result = await authClient.signOut()
    confirmed = !result.error && Boolean(result.data?.success)
  } catch {

    confirmed = false
  }
  if (!confirmed) {
    throw new Error('sign out was not confirmed')
  }
}
