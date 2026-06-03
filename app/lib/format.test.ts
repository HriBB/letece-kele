import { describe, expect, it } from 'vitest'

import { projectMeta } from './format'

describe('projectMeta', () => {
  it('joins location and year with a middot', () => {
    expect(projectMeta({ location: 'Ljubljana', year: 2013 })).toBe('Ljubljana · 2013')
  })

  it('omits a missing field without leaving a dangling separator', () => {
    expect(projectMeta({ location: 'Ljubljana' })).toBe('Ljubljana')
    expect(projectMeta({ year: 2013 })).toBe('2013')
    expect(projectMeta({})).toBe('')
  })
})
