# 04: Google OAuth sign-in

**What to build:** The same sign-in/sign-up path through Google, as ADR 0003 requires alongside email/password. The client secret lives in a Workers Secret and never reaches the browser.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] Google configured as a Better Auth social provider; callback URL registered
- [ ] The mock screens offer Google sign-in; a successful OAuth grants the same session as email/password
- [ ] An existing account signed in by password can link Google, and vice versa; either route reaches the same Student
- [ ] The client secret is stored via wrangler secrets (or `.dev.vars` locally), never committed or returned to a client
- [ ] Integration test covers the provider round-trip with the provider mocked at the boundary
