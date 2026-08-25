import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { DemoBar } from '@/DemoBar'
import { Lamp } from '@/components/Lamp'
import { Fault } from '@/components/Fault'
import { DemoProvider, useDemoStore } from '@/lib/demo-store'
import '@/index.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Dolphin' },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="flex h-dvh items-center justify-center bg-paper text-ink">
      page not found.
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
  const { empty, setEmpty, fault, setFault, busy } = useDemoStore()
  const health = fault === 'agent' ? 'down' : busy ? 'working' : 'ready'

  return (
    <div className="flex h-dvh overflow-hidden bg-paper">
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="fixed bottom-3 left-3 z-50 flex items-center gap-2">
          <DemoBar empty={empty} onEmpty={setEmpty} fault={fault} onFault={setFault} />
          <Lamp health={health} />
        </div>
        <Fault kind={fault} />
        <Outlet />
      </main>
    </div>
  )
}
