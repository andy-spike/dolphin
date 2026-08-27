import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Settings, UsageSection } from '@/components/Settings'

export const Route = createFileRoute('/settings/usage')({ component: Usage })

function Usage() {
  const navigate = useNavigate()
  return (
    <Settings
      title="usage"
      lead="what dolphin has spent on your behalf, so nothing about your own subscription is a surprise. dolphin sets no allowance of its own."
      active="/settings/usage"
      onLibrary={() => navigate({ to: '/' })}
    >
      <UsageSection />
    </Settings>
  )
}
