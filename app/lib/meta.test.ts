import { describe, expect, it } from 'vitest'

import { pageMeta } from './meta'

describe('pageMeta', () => {
  it('expands title + description into the full tag set, defaulting og:* sensibly', () => {
    expect(pageMeta({ title: 'Storitve', description: 'Vse storitve.' })).toEqual([
      { title: 'Storitve' },
      { name: 'description', content: 'Vse storitve.' },
      { property: 'og:title', content: 'Storitve' }, // og:title defaults to title
      { property: 'og:description', content: 'Vse storitve.' },
      { property: 'og:type', content: 'website' }, // og:type defaults to website
    ])
  })

  it('uses a distinct ogTitle and ogType when given', () => {
    const tags = pageMeta({
      title: 'Sanacija betona — Leteče Kele',
      description: 'Opis.',
      ogTitle: 'Sanacija betona',
      ogType: 'article',
    })
    expect(tags).toContainEqual({
      property: 'og:title',
      content: 'Sanacija betona',
    })
    expect(tags).toContainEqual({ property: 'og:type', content: 'article' })
    // document <title> stays the full title; only the share title shortens.
    expect(tags).toContainEqual({ title: 'Sanacija betona — Leteče Kele' })
  })
})
