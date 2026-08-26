import { exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

// Smoke test for ticket 01: the Worker serves the mocked app over HTTP.
// Sends a request across the Worker boundary (not a component mount) and
// asserts server-rendered output, per ADR 0003 / ADR 0004.
describe('worker SSR smoke', () => {
  it('serves the mocked course library HTML', async () => {
    const response = await exports.default.fetch('http://example.com/')

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')

    const html = await response.text()
    // Stable literal rendered by the mocked Library station.
    expect(html).toContain('course library')
  })
})
