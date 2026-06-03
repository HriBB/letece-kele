import { describe, expect, it } from 'vitest'

import type { PortableTextBlock } from '@portabletext/types'

import { selectFeaturedProjects, serviceChecklist } from './home'

describe('selectFeaturedProjects', () => {
  it('returns only the projects flagged featured', () => {
    const projects = [
      { _id: 'a', featured: false },
      { _id: 'b', featured: true },
      { _id: 'c', featured: true },
    ]
    expect(selectFeaturedProjects(projects).map((p) => p._id)).toEqual(['b', 'c'])
  })

  it('falls back to the first projects (in order) when none are flagged', () => {
    const projects = [
      { _id: 'a', featured: false },
      { _id: 'b', featured: false },
      { _id: 'c', featured: false },
    ]
    expect(selectFeaturedProjects(projects, 2).map((p) => p._id)).toEqual([
      'a',
      'b',
    ])
  })

  it('caps the result at the limit', () => {
    const projects = Array.from({ length: 9 }, (_, i) => ({
      _id: `${i}`,
      featured: true,
    }))
    expect(selectFeaturedProjects(projects, 6)).toHaveLength(6)
  })

  it('returns an empty array for missing or empty input', () => {
    expect(selectFeaturedProjects(undefined)).toEqual([])
    expect(selectFeaturedProjects([])).toEqual([])
  })
})

/** A cleaned `service.steps` value: an h2 heading followed by the process paragraphs. */
const steps: PortableTextBlock[] = [
  { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Postopek' }] },
  {
    _type: 'block',
    style: 'normal',
    children: [
      { _type: 'span', text: 'Mehanska odstranitev slabo sprijetega betona' },
    ],
  },
  {
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text: 'Pranje betonov pod visokim pritiskom' }],
  },
  {
    _type: 'block',
    style: 'normal',
    children: [
      { _type: 'span', text: 'Zaščita armature z antikorozijskim premazom' },
    ],
  },
  {
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text: 'Sanacija betonov z grobo malto' }],
  },
]

describe('serviceChecklist', () => {
  it('distils the process paragraphs into short checklist lines, skipping headings', () => {
    expect(serviceChecklist(steps, 3)).toEqual([
      'Mehanska odstranitev slabo sprijetega betona',
      'Pranje betonov pod visokim pritiskom',
      'Zaščita armature z antikorozijskim premazom',
    ])
  })

  it('returns an empty array for missing or empty steps', () => {
    expect(serviceChecklist(undefined)).toEqual([])
    expect(serviceChecklist([])).toEqual([])
  })
})
