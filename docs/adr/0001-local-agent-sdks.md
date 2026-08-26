# TanStack AI selects the Harness adapter for each Agent Job

Dolphin uses TanStack AI for the Generator, Tutor, and Tailor modes. One TanStack AI flow handles chat, streaming, and Sandbox work. A Student selects Codex, Claude Code, or OpenCode for each Agent Job, and TanStack AI picks the matching Harness adapter.

Each Harness runs in a Daytona Sandbox. The Sandbox gives the Harness the Course Folder and approved Sources, and nothing more. This keeps the Harness's file and shell tools away from Dolphin's application server.

We rejected direct model APIs because Dolphin must use the Student's connected Harness subscription. We also rejected building against the Harness SDKs directly because TanStack AI already provides that common layer.

**Consequences**: A Harness Connection is browser or device authorization. It is never a provider password, a pasted API key, or an uploaded credential bundle. Dolphin encrypts the reconnect material and injects it only into the selected Sandbox.
