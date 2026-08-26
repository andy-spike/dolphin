# 16: Resumable generation

**What to build:** The resumability consequence of ADR 0006: a Generating job that dies is retried by the Queue and continues from the first Lesson missing in R2, rather than starting over. Verified by fault injection mid-run.

**Blocked by:** 15.

**Status:** ready-for-agent

- [ ] Killing a run partway leaves completed lessons in R2 and marks the run failed
- [ ] Retry resumes from the first missing lesson; already-written lessons are neither rewritten nor lost
- [ ] The Student sees generation continue, not restart: progress picks up where it stopped
- [ ] Integration test simulates consumer failure at each lesson boundary and asserts what survived
