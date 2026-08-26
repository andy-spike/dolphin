# 20: Tailor Mode edits under the Course Lock

**What to build:** Tailor Mode becomes real: the Tutor modifies an existing course at the Student's request as a job through the locked pipeline of ADR 0006. While it works, every other course-writing Agent Job is refused by the Course's Durable Object. Editing a completed lesson returns its Progress mark to not complete, per CONTEXT.md.

**Blocked by:** 15.

**Status:** ready-for-agent

- [ ] A requested edit rewrites the targeted lesson file in R2 and updates the index; the change is visible when reopening the lesson
- [ ] Progress for a completed, edited lesson flips back to not complete
- [ ] While Tailor Mode holds the Course Lock, a simultaneous generation or exercise run is refused with the lock state surfaced honestly (the existing lock UI)
- [ ] Edited content streams live progress like generation does; completion leaves the course studyable
