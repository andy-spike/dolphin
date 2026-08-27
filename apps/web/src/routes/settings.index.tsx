import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { HarnessSection, Settings } from '@/components/Settings'

export const Route = createFileRoute('/settings/')({ component: Harnesses })

function Harnesses() {
  const navigate = useNavigate()
  return (
    <Settings
      title="harness connections"
      lead="dolphin runs every agent job on a harness you already pay for. a connection is a permission you grant, and it is yours to take back."
      active="/settings"
      onLibrary={() => navigate({ to: '/' })}
    >
      <HarnessSection />
    </Settings>
  )
}
