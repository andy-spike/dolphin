import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Check, Lock, Plug, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StationHead } from '@/components/StationHead'
import { ClaudeMark, OpenAIMark } from '@/components/Marks'
import { Field, Masthead, underline, opening } from '@/components/Ruled'
import { agentJobs, harnesses as seedHarnesses, usage, student } from '@/mock/data'
import type { Harness } from '@/mock/types'

const sections = [
  { to: '/settings', label: 'harness connections' },
  { to: '/settings/usage', label: 'usage' },
  { to: '/settings/account', label: 'account' },
] as const

/**
 * Settings is a ruled sheet like every other station — masthead, one heavy
 * rule, hairline rows. Its three sections are separate addresses, so a link
 * from the account menu lands on the one the Student asked for.
 */
export function SettingsStation({
  title,
  lead,
  active,
  children,
  onLibrary,
}: {
  title: string
  lead: string
  active: (typeof sections)[number]['to']
  children: React.ReactNode
  onLibrary: () => void
}) {
  return (
    <>
      <StationHead station="settings" onLibrary={onLibrary} />

      <div className="min-h-0 flex-1 overflow-y-auto bg-paper">
        <div className="mx-auto w-full max-w-[52rem] px-6 pt-14 pb-24 md:px-10 md:pt-20">
          <Masthead title={title} lead={lead} />

          {/* underlined labels, not pills — the same tab idiom the Tutor uses */}
          <nav className="mt-11 flex gap-7 border-b border-ink/85">
            {sections.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className={cn(
                  'label relative -mb-px border-b-2 pb-3.5 transition-colors',
                  s.to === active
                    ? 'border-accent text-ink'
                    : 'border-transparent text-ink-faint hover:text-ink',
                )}
              >
                {s.label}
              </Link>
            ))}
          </nav>

          {children}
        </div>
      </div>
    </>
  )
}

/* --- Harness Connections -------------------------------------------------- */

/**
 * The screen the whole product rests on. A Harness Connection is a permission
 * the Student grants and can take back, so the row states what it grants, what
 * it has already spent, and how to revoke it — all before the button.
 *
 * Live reads blue, the way the agent lamp does. Course State hues never appear
 * here: a connection is not a Course.
 */
export function HarnessSection() {
  const [harnesses, setHarnesses] = useState(seedHarnesses)

  const toggle = (id: string) =>
    setHarnesses((hs) =>
      hs.map((h) =>
        h.id !== id
          ? h
          : {
              ...h,
              connection: h.connection
                ? null
                : {
                    account: student.email,
                    plan: h.id === 'codex' ? 'ChatGPT Pro' : 'Claude Max',
                    connectedOn: 'just now',
                    lastJob: 'never',
                    jobs: 0,
                  },
            },
      ),
    )

  const connected = harnesses.filter((h) => h.connection).length

  return (
    <>
      <ol className="mt-2">
        {harnesses.map((h) => (
          <HarnessRow key={h.id} harness={h} onToggle={() => toggle(h.id)} />
        ))}
      </ol>

      {connected === 0 && (
        <p className="supporting mt-6 flex items-start gap-2.5 bg-paper-sunk px-5 py-4 text-[0.875rem] text-ink-soft">
          <Plug size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-ink-faint" />
          with no harness connected, dolphin can still open a course folder you already have. the generator, the tutor
          and tailor mode all wait for a connection.
        </p>
      )}

      <section className="mt-14">
        <h2 className="label text-ink-faint">what a connection grants</h2>
        <ul className={cn('mt-5', opening)}>
          {[
            'dolphin starts an agent job on your subscription when you ask for one — drafting a syllabus, writing a course, answering the tutor, running tailor mode. never on its own schedule.',
            'each job runs in a fresh sandbox with your course folder mounted, and nothing else from your machine.',
            'revoking takes effect at once. courses already written stay exactly where they are; only new jobs stop.',
          ].map((line) => (
            <li key={line} className="reading flex gap-4 border-b border-rule py-4 text-[0.9375rem] text-ink-soft">
              <span className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
              {line}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function HarnessRow({ harness, onToggle }: { harness: Harness; onToggle: () => void }) {
  const live = Boolean(harness.connection)
  const Mark = harness.id === 'codex' ? OpenAIMark : ClaudeMark

  return (
    <li className="border-b border-rule py-7">
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
        <div className="flex min-w-0 gap-4">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center border border-rule bg-paper-raised">
            <Mark className={cn('size-4', harness.id === 'codex' ? 'text-ink' : 'text-[#D97757]')} />
          </span>
          <div className="min-w-0">
            <h2 className="title text-[1.1875rem]">{harness.name}</h2>
            <p className="label mt-2 flex flex-wrap items-center gap-2.5 text-ink-faint">
              {harness.vendor}
              <span className="size-[3px] bg-rule-strong" />
              {/* blue is live here for the same reason the agent lamp is blue */}
              <span className={cn('inline-flex items-center gap-1.5', live ? 'text-accent' : 'text-ink-faint')}>
                <span className={cn('size-1.5', live ? 'bg-accent' : 'bg-rule-strong')} />
                {live ? 'connected' : 'not connected'}
              </span>
            </p>
          </div>
        </div>

        <Button variant={live ? 'danger' : 'primary'} onClick={onToggle}>
          {live ? 'revoke' : `connect ${harness.name.toLowerCase()}`}
          {!live && <ArrowRight size={14} strokeWidth={2.2} />}
        </Button>
      </div>

      {harness.connection ? (
        <dl className="mt-6 grid gap-x-8 gap-y-5 border-t border-rule-soft pt-5 min-[26rem]:grid-cols-2 sm:grid-cols-[minmax(0,1.5fr)_1fr_1fr_0.7fr]">
          <Cell term="account" value={harness.connection.account} mono />
          <Cell term="subscription" value={harness.connection.plan} />
          <Cell term="connected" value={harness.connection.connectedOn} />
          <Cell term="agent jobs" value={String(harness.connection.jobs)} mono />
        </dl>
      ) : (
        <p className="supporting mt-5 max-w-[58ch] border-t border-rule-soft pt-5 text-[0.875rem] text-ink-soft">
          connecting lets dolphin run {harness.runs} on your own {harness.vendor} subscription. you can revoke it from
          this row at any time.
        </p>
      )}
    </li>
  )
}

function Cell({ term, value, mono }: { term: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="label text-ink-faint">{term}</dt>
      <dd className={cn('mt-2 text-[0.875rem] text-ink', mono ? 'numeral break-words' : 'supporting')}>{value}</dd>
    </div>
  )
}

/* --- Usage ---------------------------------------------------------------- */

/**
 * What Dolphin has spent, not what is left. Dolphin sets no allowance of its
 * own, so a Usage line is a plain count — a Spine would draw a ceiling that
 * does not exist. The only limit Dolphin imposes is the Course Lock, and it is
 * about consistency rather than volume, so it is stated in words underneath.
 */
export function UsageSection() {
  return (
    <>
      <ol className="mt-2">
        {usage.map((u) => (
          <li key={u.id} className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-rule py-7">
            <div className="min-w-0">
              <h2 className="title text-[1.1875rem]">{u.label}</h2>
              <p className="supporting mt-2 max-w-[46ch] text-[0.875rem] text-ink-soft">{u.hint}</p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="numeral text-[2rem] leading-none tabular-nums">{u.month}</p>
              <p className="label mt-2.5 text-ink-faint">this month</p>
              <p className="label mt-1 text-ink-faint">{u.total} since {student.joined.toLowerCase()}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="supporting mt-6 max-w-[62ch] text-[0.875rem] text-ink-faint">
        dolphin does not meter you. agent jobs run on the harness subscription you connected, so what you spend here is
        spent there — your own subscription limits are the only ones that apply.
      </p>

      <section className="mt-14">
        <h2 className="label text-ink-faint">the one limit dolphin sets</h2>
        <div className={cn('mt-5 flex items-start gap-4 border-b border-rule py-6', opening, 'pt-6')}>
          <Lock size={15} strokeWidth={1.9} className="mt-0.5 shrink-0 text-accent" />
          <p className="supporting max-w-[58ch] text-[0.9375rem] text-ink-soft">
            <span className="font-semibold text-ink">one agent at a time per course.</span> while tailor mode rewrites a
            lesson, every other agent job on that course waits for it — a course cannot stay consistent if two agents
            edit it at once. courses do not wait on each other, so any number of them can run at the same time.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="label text-ink-faint">recent agent jobs</h2>
        <ol className={cn('mt-5', opening)}>
          {agentJobs.map((j) => (
            <li key={j.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 border-b border-rule py-4">
              <span className="label w-24 shrink-0 text-accent">{j.kind.toLowerCase()}</span>
              <span className="min-w-0 flex-1">
                <span className="supporting block text-[0.9375rem] text-ink">{j.detail}</span>
                <span className="supporting mt-1 block truncate text-[0.8125rem] text-ink-faint">{j.course}</span>
              </span>
              <span className="label shrink-0 text-ink-faint">{j.at}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

/* --- Account -------------------------------------------------------------- */

export function AccountSection({
  onSignOut,
  signOutFailed,
}: {
  onSignOut: () => void
  /** Set when the server never confirmed sign-out; the Student stays here. */
  signOutFailed?: boolean
}) {
  const [name, setName] = useState(student.name)
  const [saved, setSaved] = useState(false)
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSaved(true)
        }}
        className="mt-2"
      >
        <Field label="name" hint="what the tutor calls you.">
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setSaved(false)
            }}
            className={underline}
          />
        </Field>

        <Field label="email" hint="your sign-in address, and the one on the beta allowlist.">
          <p className="numeral pb-2 text-[1.125rem] text-ink">{student.email}</p>
          <p className="label mt-2 text-ink-faint">changing it needs a new invite</p>
        </Field>

        <Field label="password" hint="eight characters or more.">
          <Input type="password" placeholder="••••••••" className={cn(underline, 'numeral text-[1.125rem] md:text-[1.125rem] tracking-[0.15em]')} />
        </Field>

        <Field label="student since" hint="how long dolphin has had a library for you.">
          <p className="supporting pt-1 text-ink-soft">{student.joined}</p>
        </Field>

        <div className="mt-9 flex flex-wrap items-center gap-5">
          <Button type="submit">save changes</Button>
          {saved && (
            <p className="label inline-flex items-center gap-2 text-pass">
              <Check size={13} strokeWidth={2.6} />
              saved
            </p>
          )}
        </div>
      </form>

      <section className="mt-16">
        <h2 className="label text-ink-faint">leaving</h2>

        <div className={cn('mt-5', opening)}>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-rule py-6">
            <div className="min-w-0">
              <h3 className="title text-[1.0625rem]">sign out</h3>
              <p className="supporting mt-1.5 text-[0.875rem] text-ink-soft">
                ends this session. every harness connection stays as it is.
              </p>
              {signOutFailed && (
                <p role="alert" className="label mt-3 text-[0.8125rem] text-fail">
                  couldn't sign out. try again.
                </p>
              )}
            </div>
            <Button variant="quiet" onClick={onSignOut}>
              sign out
            </Button>
          </div>

          {/* Confirming washes the row `fail`, the same way the Course Overview frames its delete. */}
          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b py-6 transition-colors',
              confirming ? 'border-fail/25 bg-fail-wash px-5' : 'border-rule',
            )}
          >
            <div className="min-w-0">
              <h3 className={cn('title text-[1.0625rem]', confirming && 'text-fail')}>delete this account</h3>
              <p className="supporting mt-1.5 max-w-[52ch] text-[0.875rem] text-ink-soft">
                {confirming ? (
                  <>
                    this removes your course library, every course folder dolphin holds for you, and both harness
                    connections. it cannot be undone.
                  </>
                ) : (
                  'removes the library, the course folders and the harness connections.'
                )}
              </p>
            </div>
            {confirming ? (
              <span className="flex flex-wrap gap-3">
                <Button variant="quiet" onClick={() => setConfirming(false)}>
                  keep the account
                </Button>
                <Button variant="danger" onClick={onSignOut}>
                  <Trash2 size={13} strokeWidth={1.9} />
                  delete everything
                </Button>
              </span>
            ) : (
              <Button variant="danger" onClick={() => setConfirming(true)}>
                <Trash2 size={13} strokeWidth={1.9} />
                delete account
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
