# 07: Harness Connections with encrypted credentials

**What to build:** The Settings connections panel goes live per ADR 0007: a Student stores a reconnectable Codex credential as an encrypted blob in its Harness Connection row, keyed by a Workers Secret. Decryption happens server-side only, never returned to the browser, never logged. Revocation deletes the credential so it can no longer be used.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] Connecting records a credential for the chosen Harness; the settings panel reflects real state (connected / not)
- [ ] The stored value is ciphertext under a Workers Secret; a fresh encrypt-then-decrypt round trip returns the original
- [ ] No response body, log line, or error message ever contains plaintext credential material, covered by test assertions on captured output
- [ ] Revoking removes the connection and its credential; decrypt-after-revoke fails
- [ ] A Student's connections are isolated from other Students', verified by test
