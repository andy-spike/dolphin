# 06: Course Library reads from D1

**What to build:** The Library lists the signed-in Student's own Courses from D1 instead of mock data, with the empty state shown when none exist yet. Other screens stay mocked; this slice replaces only the library and whatever course-index storage it needs.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] The Course index (state, titles, Progress-relevant fields) lives in D1 and is scoped to the signed-in Student
- [ ] The Library station renders real rows; a new Student sees the empty state
- [ ] One Student never sees another's Courses, verified by test
- [ ] Signing out guards the route: anonymous visitors are redirected to sign-in
- [ ] Integration tests cover listing, empty state, and cross-Student isolation
