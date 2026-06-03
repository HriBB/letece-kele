import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { loadQueryOptions } from './loadQueryOptions.server'

// Cookie → perspective is this unit's logic. Stub the session store (cookie
// parsing) and the Sanity client config (the projectId it matches against).
const sessionGet = vi.fn()
vi.mock('~/lib/session.server', () => ({
  getSession: () => Promise.resolve({ get: (k: string) => sessionGet(k) }),
}))
vi.mock('~/sanity/client', () => ({
  client: { config: () => ({ projectId: 'proj-1' }) },
}))

const headers = () => new Headers({ Cookie: '__preview=whatever' })

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('SANITY_READ_TOKEN', 'tok')
})
afterEach(() => vi.unstubAllEnvs())

describe('loadQueryOptions', () => {
  it('serves published content with no stega when the session is not in preview', async () => {
    sessionGet.mockReturnValue(undefined) // no matching projectId in the cookie

    const { preview, options } = await loadQueryOptions(headers())

    expect(preview).toBe(false)
    expect(options).toEqual({ perspective: 'published', stega: undefined })
  })

  it('serves drafts with stega when the cookie projectId matches the client', async () => {
    sessionGet.mockReturnValue('proj-1') // matches mocked client.config().projectId

    const { preview, options } = await loadQueryOptions(headers())

    expect(preview).toBe(true)
    expect(options).toEqual({
      perspective: 'drafts',
      stega: { enabled: true, studioUrl: '/studio' },
    })
  })

  it('refuses to enter preview without a read token', async () => {
    sessionGet.mockReturnValue('proj-1')
    vi.stubEnv('SANITY_READ_TOKEN', '')

    await expect(loadQueryOptions(headers())).rejects.toThrow(/SANITY_READ_TOKEN/)
  })
})
