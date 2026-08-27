import { exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

const ORIGIN = 'http://localhost:5173'

const fetchHandler = (request: Request) => exports.default.fetch(request)

function pageRequest(path: string, cookie?: string, origin = ORIGIN): Request {
  const headers = new Headers({ accept: 'text/html' })
  if (cookie) headers.set('cookie', cookie)
  return new Request(`${origin}${path}`, { headers, redirect: 'manual' })
}

function browserJsonHeaders(cookie?: string, origin = ORIGIN): Headers {
  const headers = new Headers({
    'content-type': 'application/json',
    origin,
  })
  if (cookie) headers.set('cookie', cookie)
  return headers
}

function cookiePairs(res: Response): string[] {
  return res.headers.getSetCookie().map((c) => c.split(';')[0]).filter(Boolean)
}

function sessionCookie(res: Response): string {
  const pair = cookiePairs(res).find((c) => c.startsWith('better-auth.session_token='))
  return pair ?? ''
}

type Credentials = { email: string; password: string; name: string }

function freshCredentials(): Credentials {
  return {
    email: `t03-${crypto.randomUUID().slice(0, 8)}@example.test`,
    password: `pw-${crypto.randomUUID()}`,
    name: 'Ticket Three Tester',
  }
}

async function signUpNewAccount(creds = freshCredentials()): Promise<{ creds: Credentials; res: Response }> {
  const res = await fetchHandler(new Request(`${ORIGIN}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: browserJsonHeaders(),
    body: JSON.stringify(creds),
  }))
  return { creds, res }
}

describe('ticket 03: email/password auth over the worker boundary', () => {
  it('sign-up creates an account and returns a real session cookie', async () => {
    const { creds, res } = await signUpNewAccount()
    expect(res.status, await res.text()).toBe(200)
    expect(sessionCookie(res)).toMatch(/^better-auth\.session_token=/)

    const me = await fetchHandler(new Request(`${ORIGIN}/api/auth/get-session`, {
      headers: { cookie: cookiePairs(res).join('; ') },
    }))
    expect(me.status).toBe(200)
    const body = (await me.json()) as { user?: { id: string; name: string; email: string } } | null
    expect(body?.user?.email).toBe(creds.email)
    expect(body?.user?.name).toBe(creds.name)
  })

  it('the session reaches the mocked course library', async () => {
    const { creds, res } = await signUpNewAccount()
    expect(res.status).toBe(200)

    const page = await fetchHandler(pageRequest('/', cookiePairs(res).join('; ')))
    expect(page.status).toBe(200)
    expect(await page.text()).toContain('course library')
  })

  it('sign-in works for an existing account; wrong password fails with no session', async () => {
    const { creds, res } = await signUpNewAccount()
    expect(res.status).toBe(200)

    const good = await fetchHandler(new Request(`${ORIGIN}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: browserJsonHeaders(),
      body: JSON.stringify({ email: creds.email, password: creds.password }),
    }))
    expect(good.status).toBe(200)
    expect(sessionCookie(good)).toMatch(/^better-auth\.session_token=/)

    const bad = await fetchHandler(new Request(`${ORIGIN}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: browserJsonHeaders(),
      body: JSON.stringify({ email: creds.email, password: `wrong-${crypto.randomUUID()}` }),
    }))
    expect(bad.status).toBeGreaterThanOrEqual(400)
    expect(await bad.text()).not.toContain(creds.password)
    expect(sessionCookie(bad)).toBe('')
  })

  it('a second sign-up for a taken address fails without revealing any other address state', async () => {
    const { creds, res } = await signUpNewAccount()
    expect(res.status).toBe(200)

    const dupe = await fetchHandler(new Request(`${ORIGIN}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: browserJsonHeaders(),
      body: JSON.stringify({ ...creds, name: `${creds.name} again` }),
    }))
    expect(dupe.status).toBeGreaterThanOrEqual(400)
    expect(sessionCookie(dupe)).toBe('')
  })

  it.each(['/', '/new', '/courses/course-01', '/settings/account'])(
    'an anonymous request to %s redirects to /sign-in',
    async (path) => {
      const res = await fetchHandler(pageRequest(path))
      expect([301, 302, 307, 308]).toContain(res.status)
      expect(res.headers.get('location')).toContain('/sign-in')
    },
  )

  it('the protected server helper rejects anonymous requests', async () => {
    const { requireStudent } = await import('../src/server/students')
    await expect(requireStudent(new Request(`${ORIGIN}/courses/course-01`))).rejects.toThrow(
      /unauthorized/i,
    )
  })

  it('the protected server helper resolves a real session from an authenticated request', async () => {
    const { creds, res } = await signUpNewAccount()
    expect(res.status).toBe(200)

    const { requireStudent } = await import('../src/server/students')
    const session = await requireStudent(new Request(`${ORIGIN}/courses/course-01`, {
      headers: { cookie: cookiePairs(res).join('; ') },
    }))
    expect(session.user.email).toBe(creds.email)
  })

  it('sign-out invalidates the session and the old cookie no longer unlocks protected access', async () => {
    const { creds, res } = await signUpNewAccount()
    expect(res.status).toBe(200)
    const oldCookiePair = sessionCookie(res)
    expect(oldCookiePair).not.toBe('')

    const signOut = await fetchHandler(new Request(`${ORIGIN}/api/auth/sign-out`, {
      method: 'POST',
      headers: browserJsonHeaders(oldCookiePair),
      body: JSON.stringify({}),
    }))
    expect(signOut.status).toBe(200)

    const me = await fetchHandler(new Request(`${ORIGIN}/api/auth/get-session`, {
      headers: { cookie: oldCookiePair },
    }))
    const meBody = (await me.json()) as { user?: unknown } | null
    expect(meBody?.user ?? null).toBeFalsy()

    const page = await fetchHandler(pageRequest('/', oldCookiePair))
    expect([301, 302, 307, 308]).toContain(page.status)
    expect(page.headers.get('location')).toContain('/sign-in')
  })
})

describe('regression: session resolution derives origin from the request', () => {

  it('a page GET without Origin still resolves the session created over HTTPS', async () => {
    const httpsOrigin = 'https://dolphin.example'
    const creds = freshCredentials()

    const signUp = await fetchHandler(new Request(`${httpsOrigin}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: browserJsonHeaders(undefined, httpsOrigin),
      body: JSON.stringify(creds),
    }))
    expect(signUp.status, await signUp.text()).toBe(200)

    const cookies = cookiePairs(signUp)
    expect(cookies.some((c) => c.startsWith('__Secure-better-auth.session_token='))).toBe(true)

    const page = await fetchHandler(pageRequest('/', cookies.join('; '), httpsOrigin))
    expect(page.status).toBe(200)
    expect(await page.text()).toContain('course library')
  })
})
