# 15: The Generator writes the Course Folder to R2

**What to build:** Real generation replaces the stub job: one Sandbox for the whole Course runs the Harness with the full Brief and agreed Syllabus, and every Lesson (plus Code Exercise files) lands in R2 as markdown, while D1 keeps only the index — state, module and lesson titles and order, Progress. R2 is the sole authority for lesson content per ADR 0006. A finished course becomes Ready and appears studyable in the Library.

**Blocked by:** 14.

**Status:** ready-for-agent

- [ ] Starting generation on an agreed course runs one whole-course Sandbox job through the pipeline
- [ ] Lesson files land in R2 as they are written; the D1 index updates as each arrives; the Generating station shows real per-lesson progress
- [ ] Completion sets the Course Ready; the Overview lists the generated Modules and Lessons
- [ ] A failure during generation leaves a consistent state: partial content in R2, index matching it, job failed honestly
