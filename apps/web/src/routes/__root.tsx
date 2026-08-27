import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { NotFound as NotFoundScreen } from '@/components/NotFound'
import { DemoBar } from '@/DemoBar'
import { Lamp } from '@/components/Lamp'
import { Fault } from '@/components/Fault'
import { DemoProvider, useDemoStore } from '@/lib/demo-store'
import { isPublicPath } from '@/lib/public-paths'
import { getStudentPage } from '@/server/page-access'
import { studentGate } from '@/server/student-gate'
import '@/index.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Dolphin' },
    ],
  }),

  server: {
    middleware: [studentGate],
  },
  beforeLoad: async ({ location }) => {
    if (import.meta.env.SSR) return
    if (location.pathname.startsWith('/api/')) return
    if (isPublicPath(location.pathname)) return

    const student = await getStudentPage()
    if (!student) throw redirect({ to: '/sign-in' })
  },
  component: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper">
      <NotFoundScreen onLibrary={() => navigate({ to: '/' })} onNew={() => navigate({ to: '/new' })} />
    </div>
  )
}

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <DemoProvider>
          <Shell />
        </DemoProvider>
        <Scripts />
      </body>
    </html>
  )
}

function Shell() {
  const { empty, setEmpty, fault, setFault, busy, locked, setLocked } = useDemoStore()
  const health = fault === 'agent' ? 'down' : busy ? 'working' : 'ready'

  return (
    <div className="flex h-dvh overflow-hidden bg-paper">
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="fixed bottom-3 left-3 z-50 flex items-center gap-2 border border-rule bg-paper-raised px-1 shadow-[0_8px_24px_-12px_rgba(16,15,15,0.28)]">
          <DemoBar empty={empty} onEmpty={setEmpty} fault={fault} onFault={setFault} locked={locked} onLocked={setLocked} />
          <Lamp health={health} />
        </div>
        <Fault kind={fault} />
        <Outlet />
      </main>
    </div>
  )
}
