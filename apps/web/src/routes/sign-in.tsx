import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignInStation } from '@/stations/SignIn'

export const Route = createFileRoute('/sign-in')({ component: SignIn })

/** No auth yet — signing in of any kind lands in the Course Library. */
function SignIn() {
  const navigate = useNavigate()
  return (
    <SignInStation
      mode="sign-in"
      onEnter={() => navigate({ to: '/' })}
      onSwitch={() => navigate({ to: '/sign-up' })}
    />
  )
}
