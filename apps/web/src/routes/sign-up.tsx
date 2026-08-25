import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignInStation } from '@/stations/SignIn'

export const Route = createFileRoute('/sign-up')({ component: SignUp })

/** The beta allowlist is mocked: only the seeded Student's address gets through. */
function SignUp() {
  const navigate = useNavigate()
  return (
    <SignInStation
      mode="sign-up"
      onEnter={() => navigate({ to: '/' })}
      onSwitch={() => navigate({ to: '/sign-in' })}
    />
  )
}
