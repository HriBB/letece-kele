import { describe, expect, it } from 'vitest'

import { buildFixedImageProps, buildImageProps, DEFAULT_WIDTHS, lqipOf } from './image'

import type { SanityImage } from './image'

// A realistic Sanity image asset _ref: `image-<40-hex sha1>-<w>x<h>-<ext>`.
// `getImageDimensions` reads the natural size straight from this string, so the
// builder needs no network to compute aspect / width / height.
const ref = (w: number, h: number) => `image-${'a'.repeat(40)}-${w}x${h}-jpg`

const img = (w: number, h: number, lqip?: string): SanityImage => ({
  _type: 'image',
  asset: { _ref: ref(w, h), ...(lqip ? { metadata: { lqip } } : {}) },
})

describe('buildImageProps', () => {
  it('returns null when the asset is missing', () => {
    expect(buildImageProps(null, { sizes: '100vw' })).toBeNull()
    expect(buildImageProps({ asset: undefined }, { sizes: '100vw' })).toBeNull()
    expect(buildImageProps(undefined, { sizes: '100vw' })).toBeNull()
  })

  it('emits a srcset entry for every width in the ladder, each with its `w` descriptor', () => {
    const props = buildImageProps(img(1600, 1200), { sizes: '100vw' })
    const entries = props!.srcSet.split(', ')

    expect(entries).toHaveLength(DEFAULT_WIDTHS.length)
    DEFAULT_WIDTHS.forEach((w, i) => {
      expect(entries[i]).toMatch(new RegExp(`\\bw=${w}\\b`))
      expect(entries[i].endsWith(` ${w}w`)).toBe(true)
    })
    expect(props!.sizes).toBe('100vw')
  })

  it('honours a custom width ladder', () => {
    const props = buildImageProps(img(1600, 1200), { sizes: '100vw', widths: [320, 640] })
    expect(props!.srcSet.split(', ')).toHaveLength(2)
    expect(props!.srcSet).toContain('320w')
    expect(props!.srcSet).toContain('640w')
  })

  it('returns the asset natural width/height (no CLS) and preserves natural aspect when no aspectRatio is given', () => {
    const props = buildImageProps(img(1600, 1200), { sizes: '100vw' })
    // 1600x1200 = 4:3 natural; width/height come straight from the asset ref.
    expect(props!.width).toBe(1600)
    expect(props!.height).toBe(1200)
  })

  it('crops to a passed aspectRatio (ignoring the natural ratio) and reflects it in width/height', () => {
    // Natural is 4:3, but we ask for 16:9. width pins to baseWidth, height derives.
    const props = buildImageProps(img(1600, 1200), { sizes: '100vw', aspectRatio: 16 / 9 })
    expect(props!.width).toBe(800)
    expect(props!.height).toBe(Math.round(800 / (16 / 9))) // 450
    // a fixed ratio forces a server-side crop
    expect(props!.src).toContain('fit=crop')
  })

  it('does not crop (fit=max) when preserving natural aspect', () => {
    const props = buildImageProps(img(1600, 1200), { sizes: '100vw' })
    expect(props!.src).toContain('fit=max')
  })
})

describe('buildFixedImageProps', () => {
  it('returns null when the asset is missing', () => {
    expect(buildFixedImageProps(null, { displayHeight: 40 })).toBeNull()
    expect(buildFixedImageProps({ asset: undefined }, { displayHeight: 40 })).toBeNull()
  })

  it('pins width + height and emits a DPR srcSet (1x base, 2x retina)', () => {
    const props = buildFixedImageProps(img(498, 214), { displayWidth: 120, displayHeight: 40 })

    expect(props!.width).toBe(120)
    expect(props!.height).toBe(40)
    const entries = props!.srcSet.split(', ')
    expect(entries).toHaveLength(2)
    // 1x asks the pipeline for the display size; 2x doubles it.
    expect(entries[0]).toMatch(/\bw=120\b/)
    expect(entries[0]).toMatch(/\bh=40\b/)
    expect(entries[0].endsWith(' 1x')).toBe(true)
    expect(entries[1]).toMatch(/\bw=240\b/)
    expect(entries[1]).toMatch(/\bh=80\b/)
    expect(entries[1].endsWith(' 2x')).toBe(true)
    expect(props!.src).toBe(entries[0].replace(' 1x', ''))
  })

  it('pins by height only when no displayWidth is given', () => {
    const props = buildFixedImageProps(img(498, 214), { displayHeight: 40 })

    expect(props!.width).toBeUndefined()
    expect(props!.height).toBe(40)
    expect(props!.src).toMatch(/\bh=40\b/)
    expect(props!.src).not.toMatch(/\bw=/)
  })
})

describe('lqipOf', () => {
  it('reads the LQIP data-URI from asset.metadata', () => {
    const lqip = 'data:image/png;base64,iVBORw0KGgoAAAA'
    expect(lqipOf(img(1600, 1200, lqip))).toBe(lqip)
  })

  it('returns undefined when no metadata lqip is present', () => {
    expect(lqipOf(img(1600, 1200))).toBeUndefined()
    expect(lqipOf(null)).toBeUndefined()
    expect(lqipOf('image-ref-string')).toBeUndefined()
  })
})
