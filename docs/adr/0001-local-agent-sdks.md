# TanStack AI selects the Harness adapter for each Agent Job

Dolphin uses TanStack AI for the Generator, Tutor, and Tailor Mode. A Student selects Codex, Claude Code, or OpenCode for each Agent Job. Dolphin uses one TanStack AI flow for chat, streaming, and Sandbox work. TanStack AI selects the matching Harness adapter.

Each Harness runs in a Daytona Sandbox. The Sandbox gives the Harness the Course Folder, approved Sources, and only the access it needs. This keeps Harness file and shell tools away from Dolphin's application server. We rejected direct model APIs because Dolphin should use the Student's connected Harness subscription. We also rejected direct integration with three Harness SDKs because TanStack AI already provides that common layer.

**Consequences**: A Harness Connection is browser or device authorization, never a provider password, pasted API key, or uploaded credential bundle. Dolphin encrypts the reconnectable connection material and injects it only into the selected Sandbox.
