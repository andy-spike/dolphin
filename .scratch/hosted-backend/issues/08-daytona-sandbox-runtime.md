# 08: Daytona Sandbox runtime proven

**What to build:** The sandbox half of ADR 0001, proven standalone before any Harness touches it: Dolphin can provision a Daytona Sandbox from a server function, run a trivial command inside it, pass files in and get results out, and tear it down. The Daytona API key lives in a Workers Secret. This is the prefactor that makes the Harness tickets small.

**Blocked by:** 07.

**Status:** ready-for-agent

- [ ] A server function creates a short-lived Sandbox, executes a command, captures its output, and disposes of it
- [ ] Credential injection into the Sandbox is the only place decryption happens (ADR 0007), demonstrated end to end with a real stored credential
- [ ] The API key is a Workers Secret (or `.dev.vars` locally); nothing about it reaches a client
- [ ] Integration test runs against the real Daytona API behind a flag so CI stays hermetic by default
