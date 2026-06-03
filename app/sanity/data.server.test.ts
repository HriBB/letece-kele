import { beforeEach, describe, expect, it, vi } from 'vitest'

import { defineSanityQuery } from './data'
import { loadSanity } from './data.server'

// Cut the mock at the collaborator boundary: loadSanity's own logic (param
// default, notFoundIfEmpty 404, withPreview toggle, option forwarding) is the
// unit under test. loadQuery (network + token) and loadQueryOptions (cookie →
// perspective) are each tested elsewhere / stubbed here.
const loadQuery = vi.fn()
const loadQueryOptions = vi.fn()

vi.mock('~/sanity/loader.server', () => ({
  loadQuery: (...a: unknown[]) => loadQuery(...a),
}))
vi.mock('~/sanity/loadQueryOptions.server', () => ({
  loadQueryOptions: (...a: unknown[]) => loadQueryOptions(...a),
}))

const req = () => new Request('https://letecekele.si/')
const descriptor = defineSanityQuery<{ title: string }, { slug: string }>(
  '*[_type=="x"][0]',
)

beforeEach(() => {
  vi.clearAllMocks()
  loadQueryOptions.mockResolvedValue({
    preview: false,
    options: { perspective: 'published' },
  })
})

describe('loadSanity', () => {
  it('forwards the descriptor query, params and resolved options to loadQuery', async () => {
    loadQuery.mockResolvedValue({ data: { title: 'Hi' } })

    const result = await loadSanity(req(), descriptor, { params: { slug: 'a' } })

    expect(loadQuery).toHaveBeenCalledWith(
      descriptor.query,
      { slug: 'a' },
      {
        perspective: 'published',
      },
    )
    expect(result).toEqual({
      initial: { data: { title: 'Hi' } },
      params: { slug: 'a' },
    })
  })

  it('defaults params to {} when none are given', async () => {
    loadQuery.mockResolvedValue({ data: { title: 'Hi' } })

    const result = await loadSanity(req(), descriptor)

    expect(loadQuery).toHaveBeenCalledWith(descriptor.query, {}, expect.anything())
    expect(result.params).toEqual({})
  })

  it('throws a 404 Response when notFoundIfEmpty and the document is missing', async () => {
    loadQuery.mockResolvedValue({ data: null })

    await expect(
      loadSanity(req(), descriptor, { notFoundIfEmpty: true }),
    ).rejects.toMatchObject({ status: 404 })
  })

  it('does not throw when notFoundIfEmpty but the document exists', async () => {
    loadQuery.mockResolvedValue({ data: { title: 'Hi' } })

    await expect(
      loadSanity(req(), descriptor, { notFoundIfEmpty: true }),
    ).resolves.toMatchObject({ initial: { data: { title: 'Hi' } } })
  })

  it('includes the preview flag only when withPreview is set', async () => {
    loadQuery.mockResolvedValue({ data: { title: 'Hi' } })
    loadQueryOptions.mockResolvedValue({
      preview: true,
      options: { perspective: 'drafts' },
    })

    const withFlag = await loadSanity(req(), descriptor, { withPreview: true })
    expect(withFlag).toMatchObject({ preview: true })

    const without = await loadSanity(req(), descriptor)
    expect(without).not.toHaveProperty('preview')
  })
})
