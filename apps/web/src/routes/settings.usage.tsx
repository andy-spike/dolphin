import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SettingsStation, UsageSection } from '@/stations/Settings'

export const Route = createFileRoute('/settings/usage')({ component: Usage })

function Usage() {
  const navigate = useNavigate()
  return (
    <SettingsStation
      title="usage"
      lead="what dolphin has spent on your behalf, so nothing about your own subscription is a surprise. dolphin sets no allowance of its own."
      active="/settings/usage"
      onLibrary={() => navigate({ to: '/' })}
    >
      <UsageSection />
    </SettingsStation>
  )
}
