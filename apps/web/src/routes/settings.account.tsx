import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AccountSection, SettingsStation } from '@/stations/Settings'

export const Route = createFileRoute('/settings/account')({ component: Account })

function Account() {
  const navigate = useNavigate()
  return (
    <SettingsStation
      title="account"
      lead="who the tutor is writing for, and how you sign in. dolphin holds nothing else about you."
      active="/settings/account"
      onLibrary={() => navigate({ to: '/' })}
    >
      <AccountSection onSignOut={() => navigate({ to: '/sign-in' })} />
    </SettingsStation>
  )
}
