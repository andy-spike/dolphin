# 10: Code Exercises run real hidden tests

**What to build:** Pressing run tests on a Code Exercise runs its hidden tests in a fresh, network-disabled Daytona Sandbox (the synchronous path ADR 0006 carves out for exercise runs), replacing the timed mock with real pass/fail and a hint on failure. The Student never sees test source.

**Blocked by:** 09.

**Status:** ready-for-agent

- [ ] A run provisions a fresh network-disabled Sandbox per attempt; hidden tests execute there and only pass/fail plus a failure hint return
- [ ] The exercise UI shows the real result state (pass/fail/running) instead of the scripted outcome
- [ ] Each run performs the lightweight Course Lock state check before running, per ADR 0006
- [ ] The fault path is honest: a failed sandbox run shows the sandbox-unavailable recovery text rather than hanging
- [ ] Usage metering counts Sandbox runs
