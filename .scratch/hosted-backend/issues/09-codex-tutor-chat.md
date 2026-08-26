# 09: Codex Tutor chat streamed from a Sandbox

**What to build:** The first real Agent Job (ADR 0001): the Tutor answers a question about a mocked lesson, with Codex running in a Daytona Sandbox using the Student's connected credential, streamed to the browser over Server-Sent Events straight from a server function, per ADR 0006's direct path for single-listener chat. No queue, no Durable Object yet.

**Blocked by:** 08.

**Status:** ready-for-agent

- [ ] A signed-in Student with a Codex connection opens the Tutor on any lesson and gets real streamed replies
- [ ] The flow selects TanStack AI's Codex adapter and runs inside the Sandbox, never on Dolphin's server
- [ ] Streaming survives mid-generation client refresh gracefully: the turn is lost, nothing corrupts
- [ ] A Student without a usable connection sees the mocked no-connection fault rather than an error page
- [ ] Usage metering increments per Agent Job so later tickets can read it
