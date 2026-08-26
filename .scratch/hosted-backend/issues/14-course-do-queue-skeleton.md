# 14: Course Durable Object and Queue skeleton with a fake job

**What to build:** The pipeline of ADR 0006, proven with a stub: starting a job asks the Course's Durable Object to acquire the Course Lock and enqueue work; a Queue consumer runs it in a Sandbox; each progress chunk fans back through the DO over Server-Sent Events to every connected client. The Generating station shows genuinely streamed progress of fake content, proving lock, queue, fanout, and persistence wiring before real generation depends on them.

**Blocked by:** 13.

**Status:** ready-for-agent

- [ ] One DO exists per Course and owns its Course Lock: a second job while one runs is refused
- [ ] Enqueueing survives a Worker restart; the Queue consumer processes the job (durability over process lifetime)
- [ ] Progress chunks stream to multiple simultaneously open clients without duplication or loss
- [ ] The Generating station renders the real SSE stream; closing and reopening mid-job reattaches to live progress
- [ ] The job result is persisted by the consumer, not only streamed
- [ ] Integration test drives the whole path against emulated bindings (DO + Queue)
