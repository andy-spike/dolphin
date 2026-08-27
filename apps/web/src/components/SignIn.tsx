import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { stateTone } from '@/lib/state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, underline, opening } from '@/components/Ruled'
import { lifecycle } from '@/mock/data'
import { authClient } from '@/lib/auth-client'

type Mode = 'sign-in' | 'sign-up'

export function SignIn({ mode }: { mode: Mode }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)

  const signUp = mode === 'sign-up'
  const ready =
    email.includes('@') && password.length >= 8 && (!signUp || name.trim().length > 1) && !submitting

  const fail = () => {
    setFailed(true)
    setSubmitting(false)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ready || submitting) return

    setFailed(false)
    setSubmitting(true)

    if (signUp) {
      const { error } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      })
      if (error) return fail()
    } else {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      })
      if (error) return fail()
    }

    setSubmitting(false)
    navigate({ to: '/' })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      <section className="flex flex-col bg-paper lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[38rem] flex-1 flex-col px-6 py-12 md:px-10 md:py-16">
          <Wordmark />

          <header className="station-in mt-14">
            <h1 className="display text-[clamp(2rem,4.5vw,2.75rem)]">
              {signUp ? 'make an account.' : 'welcome back.'}
            </h1>
            <p className="supporting mt-5 max-w-[46ch] text-ink-soft">
              {signUp
                ? 'dolphin runs on your own harness subscription. connect one after you are in — nothing starts until you do.'
                : 'your course library, your course folders, and whichever harness you connected last time.'}
            </p>
          </header>

          <form onSubmit={submit} aria-describedby={failed ? 'auth-error' : undefined} className={cn('mt-11', opening)}>
            {signUp && (
              <Field label="name" hint="what the tutor calls you.">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  autoFocus
                  placeholder="Ada Lovelace"
                  className={underline}
                  disabled={submitting}
                />
              </Field>
            )}

            <Field label="email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus={!signUp}
                placeholder="you@example.com"
                className={cn(underline, 'numeral text-[1.125rem] md:text-[1.125rem]')}
                disabled={submitting}
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
                disabled={submitting}
              />
            </Field>

            {failed && (
              <p id="auth-error" role="alert" className="mt-6 border-l-2 border-fail bg-fail-wash px-4 py-3 text-[0.875rem] text-ink">
                {signUp
                  ? 'we could not make that account. check the details and try again.'
                  : 'that email and password did not match an account. check them and try again.'}
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button type="submit" disabled={!ready} aria-busy={submitting}>
                {submitting ? (
                  'one moment…'
                ) : signUp ? (
                  <>
                    make the account
                    <ArrowRight size={14} strokeWidth={2.2} />
                  </>
                ) : (
                  <>
                    sign in
                    <ArrowRight size={14} strokeWidth={2.2} />
                  </>
                )}
              </Button>
              {!submitting && !failed && (
                <p className="label text-ink-faint">
                  {ready ? 'no card, no model api key' : signUp ? 'name, email and password' : 'email and password'}
                </p>
              )}
            </div>
          </form>

          <div className="mt-9 flex items-center gap-4">
            <span className="h-px flex-1 bg-rule" />
            <span className="label text-ink-faint">or</span>
            <span className="h-px flex-1 bg-rule" />
          </div>

          <button
            type="button"
            disabled
            aria-disabled="true"
            title="google sign-in arrives with the next release"
            className="label mt-6 flex w-full cursor-not-allowed items-center justify-center gap-3 border border-rule bg-paper-sunk px-5 py-3.5 text-ink-faint"
          >
            <GoogleMark className="size-4" />
            continue with google
            <span className="text-[0.6875rem]">— not available yet</span>
          </button>

          <p className="supporting mt-8 text-[0.875rem] text-ink-faint">
            {signUp ? 'already have an account?' : 'no account yet?'}{' '}
            <button type="button" onClick={() => navigate({ to: signUp ? '/sign-in' : '/sign-up' })} className="text-accent underline decoration-accent/30 hover:decoration-accent">
              {signUp ? 'sign in' : 'ask for an invite'}
            </button>
          </p>

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

                {i < lifecycle.length - 1 && (
                  <span className="absolute inset-y-0 left-[0.3125rem] w-px bg-rule-strong" aria-hidden />
                )}

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
