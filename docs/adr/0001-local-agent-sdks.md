# Local coding-agent SDKs power the agents

Dolphin's Generator and Tutor need a language model to run. Instead of calling a model API directly, Dolphin drives the coding-agent SDKs already installed on the student's machine — for example the Codex Agents SDK or the Claude Code Agents SDK. The student's existing AI subscription pays for the work, so Dolphin does not need its own model API key or per-token billing.

This is deliberate. The obvious path is a direct model API (OpenAI, Anthropic, or a local model via Ollama). We rejected it because it would charge the student a second time for capability they already pay for. The cost is complexity: Dolphin depends on those SDKs being installed and behaves differently when they are absent, and it inherits whatever each SDK supports rather than a uniform API.

**Consequences**: live web search rides the SDK's own search tool rather than a separate search API, so Dolphin keeps a single key/subscription to manage.

