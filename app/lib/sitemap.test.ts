import { describe, expect, it } from 'vitest'

import { buildSitemapXml } from './sitemap'

describe('buildSitemapXml', () => {
  it('wraps the static public routes as absolute <loc> URLs in a urlset', () => {
    const xml = buildSitemapXml({
      origin: 'https://letecekele.si',
      services: [],
      projects: [],
    })

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    )
    for (const path of [
      '/',
      '/storitve',
      '/reference',
      '/o-podjetju',
      '/kontakt',
    ]) {
      expect(xml).toContain(`<loc>https://letecekele.si${path}</loc>`)
    }
    expect(xml.trim().endsWith('</urlset>')).toBe(true)
  })

  it('adds a <url> per service and project, with <lastmod> when known', () => {
    const xml = buildSitemapXml({
      origin: 'https://letecekele.si',
      services: [{ slug: 'sanacija-betona', updatedAt: '2026-05-01T10:00:00Z' }],
      projects: [{ slug: 'preglov-trg-10' }],
    })

    expect(xml).toContain(
      '<url><loc>https://letecekele.si/storitve/sanacija-betona</loc><lastmod>2026-05-01T10:00:00Z</lastmod></url>',
    )
    // Project without an updatedAt emits no <lastmod>.
    expect(xml).toContain(
      '<url><loc>https://letecekele.si/reference/preglov-trg-10</loc></url>',
    )
  })

  it('XML-escapes the loc so an & or < in the origin or a slug cannot break the document', () => {
    const xml = buildSitemapXml({
      origin: 'https://host/?a=1&b=2',
      services: [{ slug: 's<x>' }],
      projects: [],
    })

    // Raw & / < would make the sitemap invalid XML; they must be entity-escaped.
    expect(xml).toContain('https://host/?a=1&amp;b=2')
    expect(xml).not.toMatch(/<loc>[^<]*&(?!amp;|lt;|gt;|quot;|apos;)/)
    expect(xml).toContain('/storitve/s&lt;x&gt;')
  })
})
