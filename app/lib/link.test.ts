import { describe, expect, it } from 'vitest'

import { projectHref, resolveLink, serviceHref } from './link'

describe('resolveLink', () => {
  it('classifies an app-absolute path as internal', () => {
    expect(resolveLink('/storitve')).toEqual({ href: '/storitve', internal: true })
  })

  it('classifies an https URL as external and opens it safely', () => {
    expect(resolveLink('https://example.com')).toEqual({
      href: 'https://example.com',
      internal: false,
      target: '_blank',
      rel: 'noreferrer',
    })
  })

  it('treats a plain http URL as external too', () => {
    const link = resolveLink('http://example.com')
    expect(link.internal).toBe(false)
    expect(link.target).toBe('_blank')
  })

  it('treats a scheme-relative //host URL as external', () => {
    const link = resolveLink('//cdn.example.com/x.js')
    expect(link.internal).toBe(false)
    expect(link.target).toBe('_blank')
  })

  it('falls back to a safe in-page anchor when href is missing', () => {
    expect(resolveLink(undefined)).toEqual({ href: '#', internal: true })
  })

  it('treats a tel: link as external but same-tab (plain <a>, no new tab)', () => {
    // Client-side routing can't handle tel: — it must render a plain <a>, not a <Link>.
    expect(resolveLink('tel:+38640465749')).toEqual({
      href: 'tel:+38640465749',
      internal: false,
    })
  })

  it('treats a mailto: link as external but same-tab', () => {
    expect(resolveLink('mailto:info@letecekele.si')).toEqual({
      href: 'mailto:info@letecekele.si',
      internal: false,
    })
  })
})

describe('serviceHref', () => {
  it('maps a service slug to its canonical detail path', () => {
    expect(serviceHref('izolacijska-fasada')).toBe('/storitve/izolacijska-fasada')
  })
})

describe('projectHref', () => {
  it('maps a project slug to its canonical reference path', () => {
    expect(projectHref('preglov-trg-10')).toBe('/reference/preglov-trg-10')
  })
})
