import { useNavigate } from '@tanstack/react-router'
import { Activity, LogOut, Plug, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { student, harnesses, usage } from '@/mock/data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * The last cell in the station strip, and the only permanent way to the
 * Student's own settings. It carries the Student's initials rather than a
 * photograph: Dolphin has no avatars, and a letter on ink is how this system
 * draws identity already.
 */
export function AccountMenu() {
  const navigate = useNavigate()
  const connected = harnesses.filter((h) => h.connection).length
  const jobs = usage[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="your account"
        className="group flex shrink-0 items-center gap-2.5 border-l border-rule-strong px-3 transition-colors hover:bg-paper data-popup-open:bg-paper-raised md:px-4"
      >
        <span className="label grid size-[1.5rem] shrink-0 place-items-center bg-ink pt-px text-[0.625rem] text-paper transition-transform duration-150 group-active:scale-[0.94]">
          {student.initials}
        </span>
        {/* The lamp already reports the agent; this reports the connection behind it. */}
        <span className="label hidden text-ink-faint transition-colors group-hover:text-ink lg:inline">
          {connected} connected
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(19rem,calc(100vw-2rem))] border-rule bg-paper-raised p-0 shadow-[0_12px_32px_-12px_rgba(16,15,15,0.22)]"
      >
        <div className="border-b border-rule px-4 py-3.5">
          <p className="title text-[0.9375rem]">{student.name}</p>
          <p className="numeral mt-1 truncate text-[0.75rem] text-ink-faint">{student.email}</p>
        </div>

        <Item icon={Plug} onClick={() => navigate({ to: '/settings' })} note={`${connected} of ${harnesses.length}`}>
          harness connections
        </Item>
        <Item icon={Activity} onClick={() => navigate({ to: '/settings/usage' })} note={`${jobs.month} this month`}>
          usage
        </Item>
        <Item icon={SlidersHorizontal} onClick={() => navigate({ to: '/settings/account' })}>
          account
        </Item>

        <DropdownMenuSeparator className="my-0 bg-rule" />

        <Item icon={LogOut} onClick={() => navigate({ to: '/sign-in' })} danger>
          sign out
        </Item>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Item({
  icon: Icon,
  onClick,
  note,
  danger,
  children,
}: {
  icon: typeof Plug
  onClick: () => void
  note?: string
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      variant={danger ? 'destructive' : 'default'}
      className={cn(
        'label gap-3 border-b border-rule-soft px-4 py-3 last:border-b-0 normal-case',
        danger ? 'text-ink-faint focus:bg-fail-wash' : 'text-ink-soft',
      )}
    >
      <Icon size={14} strokeWidth={1.8} className="shrink-0 opacity-70" />
      <span className="flex-1">{children}</span>
      {note && <span className="numeral text-[0.6875rem] text-ink-faint">{note}</span>}
    </DropdownMenuItem>
  )
}
