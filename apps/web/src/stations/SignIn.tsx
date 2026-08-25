import { useState } from 'react'
import { ArrowRight, Check, Hourglass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { stateTone } from '@/lib/state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, underline, opening } from '@/components/Ruled'
import { lifecycle, student } from '@/mock/data'

type Mode = 'sign-in' | 'sign-up'
type Gate = 'form' | 'blocked' | 'waiting'

/**
 * The front door, set the way every other station is: a ruled sheet on paper,
 * and a `paper-sunk` panel to its right — the same two-column frame the
 * Syllabus and the Lesson use, so the first screen is already the workspace.
 *
 * The panel is the Course lifecycle in its own five hues. It is the one thing
 * about Dolphin that cannot be shown with a screenshot the product has not
 * earned yet, and it teaches the Student the vocabulary of every later screen.
 */
export function SignInStation({ mode, onEnter, onSwitch }: { mode: Mode; onEnter: () => void; onSwitch: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [gate, setGate] = useState<Gate>('form')

  const signUp = mode === 'sign-up'
  const ready = email.includes('@') && password.length >= 8 && (!signUp || name.trim().length > 1)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ready) return
    // The private beta is an allowlist. Only the seeded Student is on it.
    if (signUp && email.trim().toLowerCase() !== student.email) return setGate('blocked')
    onEnter()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      <section className="flex flex-col bg-paper lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[38rem] flex-1 flex-col px-6 py-12 md:px-10 md:py-16">
          <Wordmark />

          {gate === 'form' ? (
            <>
              <header className="station-in mt-14">
                <h1 className="display text-[clamp(2rem,4.5vw,2.75rem)]">
                  {signUp ? 'make an account.' : 'welcome back.'}
                </h1>
                <p className="supporting mt-5 max-w-[46ch] text-ink-soft">
                  {signUp
                    ? 'dolphin is in a private beta, so accounts are made from an allowlist. connect a harness after you are in — nothing runs until you do.'
                    : 'your course library, your course folders, and whichever harness you connected last time.'}
                </p>
              </header>

              <form onSubmit={submit} className={cn('mt-11', opening)}>
                {signUp && (
                  <Field label="name" hint="what the tutor calls you.">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      autoFocus
                      placeholder="Ada Lovelace"
                      className={underline}
                    />
                  </Field>
                )}

                <Field label="email" hint={signUp ? 'must be on the beta allowlist.' : undefined}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus={!signUp}
                    placeholder="you@example.com"
                    className={cn(underline, 'numeral text-[1.125rem] md:text-[1.125rem]')}
                  />
                </Field>

                <Field label="password" hint={signUp ? 'eight characters or more.' : undefined}>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={signUp ? 'new-password' : 'current-password'}
                    placeholder="••••••••"
                    className={cn(underline, 'numeral text-[1.125rem] md:text-[1.125rem] tracking-[0.15em]')}
                  />
                </Field>

                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <Button type="submit" disabled={!ready}>
                    {signUp ? 'make the account' : 'sign in'}
                    <ArrowRight size={14} strokeWidth={2.2} />
                  </Button>
                  <p className="label text-ink-faint">
                    {ready ? 'no card, no model api key' : signUp ? 'name, email and password' : 'email and password'}
                  </p>
                </div>
              </form>

              <div className="mt-9 flex items-center gap-4">
                <span className="h-px flex-1 bg-rule" />
                <span className="label text-ink-faint">or</span>
                <span className="h-px flex-1 bg-rule" />
              </div>

              <button
                onClick={onEnter}
                className="label mt-6 flex w-full items-center justify-center gap-3 border border-rule bg-paper-raised px-5 py-3.5 text-ink-soft transition-colors duration-150 hover:border-accent-soft hover:bg-accent-wash hover:text-accent active:scale-[0.99]"
              >
                <GoogleMark className="size-4" />
                continue with google
              </button>

              <p className="supporting mt-8 text-[0.875rem] text-ink-faint">
                {signUp ? 'already have an account?' : 'no account yet?'}{' '}
                <button onClick={onSwitch} className="text-accent underline decoration-accent/30 hover:decoration-accent">
                  {signUp ? 'sign in' : 'ask for an invite'}
                </button>
              </p>
            </>
          ) : (
            <Allowlist state={gate} email={email} onWait={() => setGate('waiting')} onBack={() => setGate('form')} />
          )}

          <footer className="pt-16">
            <p className="supporting max-w-[46ch] text-[0.8125rem] text-ink-faint">
              dolphin never asks for a model api key. it runs the generator and the tutor on the harness subscription you
              already pay for, through a connection you can revoke.
            </p>
          </footer>
        </div>
      </section>

      <Lifecycle />
    </div>
  )
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-[1.5rem] shrink-0 place-items-center text-[1.1875rem] leading-none">🐬</span>
      <span className="label pt-px text-ink-soft">Dolphin</span>
    </span>
  )
}

/**
 * Not on the list. The address is a machine string, so it is set in mono, and
 * the recovery is a real action rather than an apology.
 */
function Allowlist({
  state,
  email,
  onWait,
  onBack,
}: {
  state: Gate
  email: string
  onWait: () => void
  onBack: () => void
}) {
  const waiting = state === 'waiting'

  return (
    <div className="station-in mt-14">
      <h1 className="display text-[clamp(2rem,4.5vw,2.75rem)]">
        {waiting ? 'you are on the list.' : 'not on the list yet.'}
      </h1>

      <p className="supporting mt-5 max-w-[48ch] text-ink-soft">
        {waiting ? (
          <>
            we will write to <Address>{email}</Address> when the beta opens a place. nothing else is needed from you.
          </>
        ) : (
          <>
            <Address>{email}</Address> is not on the beta allowlist. dolphin runs every agent job on a student's own
            harness subscription, and the beta is sized to a fixed number of students while it is still being built.
          </>
        )}
      </p>

      <div className={cn('mt-10', opening)}>
        <div className="flex items-start gap-4 border-b border-rule py-5">
          <span
            className={cn(
              'mt-0.5 grid size-5 shrink-0 place-items-center',
              waiting ? 'bg-pass text-white' : 'text-ink-faint',
            )}
          >
            {waiting ? <Check size={13} strokeWidth={3} /> : <Hourglass size={16} strokeWidth={1.9} />}
          </span>
          <div className="min-w-0">
            <p className="title text-[1.0625rem]">{waiting ? 'waiting for a place' : 'ask for a place'}</p>
            <p className="supporting mt-1.5 text-[0.875rem] text-ink-soft">
              {waiting
                ? 'places open as the beta widens. we do not send anything else.'
                : 'one address on the waiting list. no course is generated until you are in.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        {!waiting && <Button onClick={onWait}>join the waiting list</Button>}
        <Button variant="quiet" onClick={onBack}>
          {waiting ? 'back to sign in' : 'use a different address'}
        </Button>
      </div>
    </div>
  )
}

const Address = ({ children }: { children: React.ReactNode }) => (
  <code className="numeral bg-paper-sunk px-1.5 py-0.5 text-[0.8125rem] text-ink">{children}</code>
)

/**
 * The five Course States, in lifecycle order, each in its own hue: cool at the
 * start, warm in the Student's hands, green when it is done. It is the same
 * `StateChip` vocabulary every later screen uses, hung on one hairline spine.
 */
function Lifecycle() {
  return (
    <aside className="flex shrink-0 flex-col border-t border-rule bg-paper-sunk lg:w-[24rem] lg:overflow-y-auto lg:border-t-0 lg:border-l xl:w-[27rem]">
      <div className="flex flex-1 flex-col px-8 py-12 md:px-10 md:py-16">
        <h2 className="label text-ink-faint">how a course happens</h2>

        <ol className="mt-9">
          {lifecycle.map(({ state, line }, i) => {
            const tone = stateTone[state]
            return (
              <li key={state} className="relative flex gap-5 pb-9 last:pb-0">
                {/* the spine runs behind the dots; each dot's ring cuts it */}
                {i < lifecycle.length - 1 && (
                  <span className="absolute inset-y-0 left-[0.3125rem] w-px bg-rule-strong" aria-hidden />
                )}
                {/* a legend, not a live Course, so nothing here pulses */}
                <span className={cn('relative z-10 mt-[0.4375rem] size-2.5 shrink-0 ring-4 ring-paper-sunk', tone.fill)} />
                <div className="min-w-0">
                  <p className={cn('label', tone.text)}>{state.toLowerCase()}</p>
                  <p className="supporting mt-2 text-[0.875rem] text-ink-soft">{line}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <p className="supporting mt-12 border-t border-rule pt-6 text-[0.8125rem] text-ink-faint">
          every lesson is a markdown file in a course folder you keep, whether or not you open dolphin again.
        </p>
      </div>
    </aside>
  )
}

/** Google's own mark. Not a lucide glyph, because it identifies a company. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}
