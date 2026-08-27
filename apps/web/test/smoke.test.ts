import { exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

describe('worker SSR smoke', () => {
  it('serves the mocked course library HTML', async () => {
    const response = await exports.default.fetch('http://example.com/')

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')

    const html = await response.text()

    expect(html).toContain('course library')
  })
})
