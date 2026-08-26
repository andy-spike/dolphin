# 17: Lesson bodies served from R2

**What to build:** Opening a lesson fetches its markdown from R2 (the moment ADR 0006 intends: bodies leave D1 entirely and load only when a lesson station opens), rendering in the existing reading-page station. Works for generated courses; a seeded Course Folder verifies the path before any real generation is needed.

**Blocked by:** 15.

**Status:** ready-for-agent

- [ ] A lesson station fetches its body from R2 on open, including sections and exercises defined by the file
- [ ] Progress marks work against the real index while content comes from R2
- [ ] A missing or unreadable lesson file shows the source fault with recovery, never a blank page
