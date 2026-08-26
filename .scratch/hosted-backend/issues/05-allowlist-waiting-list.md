# 05: Allowlist gate and Waiting list capture

**What to build:** The private-beta Allowlist bites at sign-up only, per the amended stack ADR. An allowlisted address signs up normally. A non-allowlisted address is refused at sign-up and recorded on the Waiting list (a separate table per the CONTEXT.md terms), which the existing mocked gate and waiting-list screens now express with real data. Accounts that already exist keep access; sign-in is never re-checked.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] An address on the Allowlist can sign up; one not on it cannot, and lands on the Waiting list instead
- [ ] Waiting-list capture is idempotent: the same address asking twice stays a single row
- [ ] An account created while allowlisted continues to sign in even if later removed from the list
- [ ] The mocked beta gate reflects reality: try-while-not-allowlisted shows the waiting-list outcome
- [ ] Integration tests cover allowed sign-up, rejected capture, and grandfathered sign-in
