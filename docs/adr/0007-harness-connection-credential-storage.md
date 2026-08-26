# Harness Connection credentials are stored as an encrypted D1 column

A Harness Connection's reconnectable credential is stored as an encrypted blob in its D1 row. Dolphin uses a Workers Secret as the key.

We rejected a separate secrets vault. Cloudflare has no per-user secret store suited to this. The credential already lives alongside its Harness Connection row, so a second service would add an operational dependency without changing who can read the plaintext.

**Consequences**: Decryption happens only when Dolphin injects the credential into a Sandbox (per ADR 0001). Dolphin never returns the credential to the browser and never logs it.
