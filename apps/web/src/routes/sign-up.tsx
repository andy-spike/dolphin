import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@/components/SignIn'

export const Route = createFileRoute('/sign-up')({ component: SignUp })

function SignUp() {
  return <SignIn mode="sign-up" />
}
