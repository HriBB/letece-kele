import { describe, expect, it } from 'vitest'

import { buildRobotsTxt } from './robots'

describe('buildRobotsTxt', () => {
  it('allows crawling, keeps the admin/resource routes out, and points at the sitemap', () => {
    const txt = buildRobotsTxt('https://letecekele.si')

    expect(txt).toContain('User-agent: *')
    expect(txt).toContain('Allow: /')
    expect(txt).toContain('Disallow: /studio')
    expect(txt).toContain('Disallow: /resource')
    expect(txt).toContain('Sitemap: https://letecekele.si/sitemap.xml')
  })

  it('blocks all crawlers when disallowAll is true (staging mode, ADR 0008)', () => {
    const txt = buildRobotsTxt('https://staging.letecekele.si', { disallowAll: true })

    expect(txt).toContain('User-agent: *')
    expect(txt).toContain('Disallow: /')
    expect(txt).not.toContain('Allow: /')
    expect(txt).not.toContain('Sitemap:')
  })
})
