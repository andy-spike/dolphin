import { createFileRoute } from '@tanstack/react-router'
import { SignInStation } from '@/stations/SignIn'

export const Route = createFileRoute('/sign-in')({ component: SignIn })

/** Public route: the session starts (or fails) here, then the Student lands in the library. */
function SignIn() {
  return <SignInStation mode="sign-in" />
}
