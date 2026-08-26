// Custom Workers entrypoint per the Cloudflare x TanStack Start guide.
// Re-exports the framework server entry so `wrangler.jsonc` can point at a
// resolvable file, and so later slices add Queues consumers / Durable Object
// exports here (ADR 0004).
import handler from '@tanstack/react-start/server-entry'

export default handler
