# A Durable Object per Course orchestrates jobs, holds Course Lock, and streams progress

Each Course gets one Durable Object (DO). The DO owns the Course Lock. It mediates only Generating and Tailor Mode, the two Agent Jobs that write to the Course Folder and need every connected client to see the same progress.

Ordinary Syllabus-chat turns and Tutor replies stream directly from a server function in a single request. They touch no shared state and have one listener, so routing them through the DO would add latency for no benefit.

Generating and Tailor Mode follow the same path:
1. A server function asks the Course's DO to acquire the lock and enqueue the job.
2. A Cloudflare Queue consumer runs the Harness in a Daytona Sandbox and streams each chunk back to the DO.
3. The DO fans each chunk out over Server-Sent Events (SSE) and persists the result.

We rejected two alternatives. Running the Sandbox work inside the DO itself would block the single-threaded DO. Tracking lock and job status as plain D1 rows with the browser polling would lose the free Course Lock that the DO provides. Queue's retry-on-failure also makes a Generating run resumable. A retry continues from the first Lesson missing in R2.

Generation is one Sandbox for the whole Course, not one per Lesson. This matches "whole-course-first", so the Harness gets the full Brief and Syllabus and writes every Lesson in a single run.

R2 is the sole authority for Lesson content, the Course Folder. D1 holds only the index: Course state, syllabus, Module and Lesson titles and order, and Progress. A Lesson body is fetched from R2 only when a Lesson station opens. The two stores never need two-way sync.

**Consequences**: Code Exercise test runs deliberately skip this pipeline. Each is a single synchronous call to Daytona, with only a lightweight lock-state check against the Course's DO first. These runs are short and single-client, and they touch nothing another client needs to see.
