# 12: The Brief persists and starts a Drafting course

**What to build:** Submitting the Brief creates a real Course row in the Drafting state owned by the signed-in Student, then navigates into Syllabus. From here on, courses in the Library are ones the Student actually began.

**Blocked by:** 06.

**Status:** ready-for-agent

- [ ] Brief fields (Topic, Goal, Difficulty, Time Budget, Sources, web-search toggle) persist with the Course
- [ ] A new Course appears in the Library as Drafting; the Syllabus station opens for it
- [ ] Uploaded Sources are stored (R2 per ADR 0002) or public URLs recorded, and listed back correctly
- [ ] Validation rejects an unusable Brief with feedback at the field that failed
- [ ] Integration tests cover create-then-list round trip and validation failure
