# 19: Permanent deletion

**What to build:** The deletion control of ADR 0002: a Student permanently deletes a Course's stored data — R2 Course Folder and D1 index and Progress — with nothing left behind. Same-account scoping is strict; deleting is unrecoverable, so the confirm step must be honest about that.

**Blocked by:** 15.

**Status:** ready-for-agent

- [ ] Deleting removes the Course Folder from R2 and every index/Progress row for it; nothing surfaces in the Library afterward
- [ ] A concurrent Agent Job on the same course blocks or aborts cleanly (the Course Lock arbitrates), leaving no orphaned job
- [ ] Another Student's data is untouched by one Student's deletion, verified by test
- [ ] Any running data owned solely by the deleted course's jobs (sandbox artifacts) does not outlive the deletion path
