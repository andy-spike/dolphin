// Injected Node-side via vitest.config.ts (`define`), matches the shape of
// readD1Migrations() / applyD1Migrations() from the Workers Vitest plugin.
declare const __D1_MIGRATIONS__: { name: string; queries: string[] }[]
