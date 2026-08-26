import { createFileRoute } from '@tanstack/react-router'
import { SignInStation } from '@/stations/SignIn'

export const Route = createFileRoute('/sign-up')({ component: SignUp })

/**
 * Public route. The Allowlist check lands with ticket 05; until then sign-up
 * creates the account and session directly.
 */
function SignUp() {
  return <SignInStation mode="sign-up" />
}
