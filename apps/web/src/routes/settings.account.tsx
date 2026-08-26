import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AccountSection, SettingsStation } from '@/stations/Settings'
import { signOutStudent } from '@/lib/auth-client'

export const Route = createFileRoute('/settings/account')({ component: Account })

function Account() {
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [signOutFailed, setSignOutFailed] = useState(false)

  // Real session invalidation; every other account field stays mocked. Leave
  // only once the server confirms, and stay put with a message if it fails.
  const signOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    setSignOutFailed(false)
    try {
      await signOutStudent()
    } catch {
      setSigningOut(false)
      setSignOutFailed(true)
      return
    }
    navigate({ to: '/sign-in' })
  }

  return (
    <SettingsStation
      title="account"
      lead="who the tutor is writing for, and how you sign in. dolphin holds nothing else about you."
      active="/settings/account"
      onLibrary={() => navigate({ to: '/' })}
    >
      <AccountSection onSignOut={signOut} signOutFailed={signOutFailed} />
    </SettingsStation>
  )
}
