# 03: Sign-up and sign-in with email and password

**What to build:** A Student can create an account with email/password and sign in, replacing the navigation-only mock. Better Auth runs through its Drizzle adapter on D1, constructed per request. Signed-out visitors are redirected to sign-in; signed-in Students see their (still mocked) Course Library.

**Blocked by:** 02.

**Status:** ready-for-agent

- [ ] Better Auth configured with the Drizzle adapter; its tables ship in a new migration
- [ ] Sign-up creates a real account and session; sign-in establishes a session; sign-out ends it
- [ ] The mock sign-up/sign-in screens submit to the real flow, including error feedback for wrong credentials
- [ ] Requests requiring a Student reject anonymous callers
- [ ] Better Auth's instance is created per request from that request's bindings, not at module scope
- [ ] Integration tests cover sign-up, sign-in failure, and authenticated access
