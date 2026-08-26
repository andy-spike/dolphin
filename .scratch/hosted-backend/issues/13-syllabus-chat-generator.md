# 13: Syllabus chat with the Generator

**What to build:** The Drafting state becomes real: the Student iterates on the Syllabus with the Generator in a chat that streams directly from a server function (the ordinary path of ADR 0006). When both agree, the Syllabus is locked in with its Modules and Lessons, and the course moves toward Ready.

**Blocked by:** 12, 09.

**Status:** ready-for-agent

- [ ] Chat turns stream from a real Generator run inside a Sandbox, using the selected Harness
- [ ] The Generator reads the Brief (and approved Sources) each turn; replies propose or revise the Syllabus outline shown beside the chat
- [ ] Agreement records the Syllabus and transitions the Course state out of Drafting
- [ ] The Syllabus panel reflects the latest proposed state as turns arrive
