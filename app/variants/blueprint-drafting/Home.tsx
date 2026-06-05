import { ArrowRight, Phone } from 'lucide-react'

import type { HomeData, SiteData } from '~/lib/types'

import { selectFeaturedProjects } from '~/lib/home'
import { projectHref, serviceHref } from '~/lib/link'
import { projectMeta } from '~/lib/format'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

const gridBg = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px)',
}

function CornerMarks() {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute right-0 top-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute bottom-0 left-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute bottom-0 right-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
    </>
  )
}

/**
 * Home (blueprint/drafting): engineering-drawing aesthetic throughout. Hero uses a
 * bordered title-block (left) + registration-mark photo (right) — distinct from alpine
 * (photo-first full-bleed), swiss (text-only metrics), rugged (heavy-frame), and wc
 * (shadow cards). Thin 1px hairline borders, monospace annotation labels, grid paper
 * texture on bone sections, measurement-table stats, spec-list services, cell-grid
 * why-us, general-notes CTA block.
 */
export function Home({ data, site }: { data: HomeData; site: SiteData }) {
  const home = data.home
  const services = data.services
  const featured = selectFeaturedProjects(data.projects)
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <>
      {/* ── Hero: title block left + registration-mark photo right ── */}
      {home?.hero?.heading && (
        <section className="bg-paper">
          <div className="container-page grid items-stretch gap-0 py-16 sm:py-20 lg:grid-cols-2">
            {/* Engineering drawing title block */}
            <div className="border border-ink/20 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                {home.hero.eyebrow && (
                  <p className="font-mono mb-6 border-b border-ink/10 pb-3 text-[9px] uppercase tracking-[0.25em] text-orange">
                    ↗ {home.hero.eyebrow}
                  </p>
                )}
                <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  {home.hero.heading}
                </h1>
                {home.hero.lead && (
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/60">
                    {home.hero.lead}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {home.hero.cta?.href && (
                    <SmartLink
                      href={home.hero.cta.href}
                      className="inline-flex items-center gap-2 bg-orange px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-paper transition-colors hover:bg-orange-dark"
                    >
                      {home.hero.cta.label ?? 'Povprašajte po ponudbi'}
                      <ArrowRight size={14} />
                    </SmartLink>
                  )}
                  {contact?.phone && contact?.phoneHref && (
                    <a
                      href={contact.phoneHref}
                      className="inline-flex items-center gap-2 border border-ink/20 px-5 py-3 font-mono text-xs tabular-nums text-ink transition-colors hover:border-orange hover:text-orange"
                    >
                      <Phone size={12} className="text-orange" />
                      {contact.phone}
                    </a>
                  )}
                </div>
              </div>
              {/* Drawing metadata stamp */}
              <div className="mt-8 border-t border-ink/10 pt-4 flex items-center gap-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/25">DRW-001</span>
                <span className="font-mono text-[9px] text-ink/20">·</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/25">REV A</span>
              </div>
            </div>

            {/* Photo with corner registration marks */}
            {home.hero.image ? (
              <div className="relative aspect-[4/3] overflow-hidden border border-ink/20 border-l-0 lg:border-l-0">
                <CornerMarks />
                <Image
                  image={home.hero.image}
                  sizes={SIZES.grid2}
                  aspectRatio={4 / 3}
                  alt={home.hero.image.alt ?? home.hero.heading}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="hidden aspect-[4/3] border border-ink/15 border-l-0 bg-bone lg:block" />
            )}
          </div>
        </section>
      )}

      {/* ── Stats: measurement table ── */}
      {home?.stats && home.stats.length > 0 && (
        <section className="bg-bone border-y border-ink/15" style={gridBg}>
          <div className="container-page py-10">
            <div className="grid grid-cols-2 divide-x divide-ink/15 sm:grid-cols-4">
              {home.stats.map((s, i) => (
                <div key={i} className="px-6 py-5 first:pl-0 last:pr-0">
                  <p className="font-mono mb-2 text-[9px] uppercase tracking-[0.25em] text-orange">
                    {String(i + 1).padStart(2, '0')}.
                  </p>
                  <div className="text-3xl font-bold leading-none text-ink sm:text-4xl">
                    {s.value}
                  </div>
                  {s.label && (
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-ink/40">
                      {s.label}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Story: annotation zone ── */}
      {home?.story?.heading && (
        <section className="bg-paper border-b border-ink/10">
          <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              {home.story.eyebrow && (
                <p className="font-mono mb-4 text-[9px] uppercase tracking-[0.25em] text-orange">
                  § {home.story.eyebrow}
                </p>
              )}
              <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
                {home.story.heading}
              </h2>
              {home.story.cta?.href && (
                <SmartLink
                  href={home.story.cta.href}
                  className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-orange transition-colors hover:text-orange-dark"
                >
                  {home.story.cta.label ?? 'Več o nas'}
                  <ArrowRight size={12} />
                </SmartLink>
              )}
            </div>
            {home.story.paragraphs && home.story.paragraphs.length > 0 && (
              <PortableText
                value={home.story.paragraphs}
                className="text-sm leading-relaxed text-ink/60"
              />
            )}
          </div>
        </section>
      )}

      {/* ── Services: spec table rows ── */}
      {services.length > 0 && (
        <section className="bg-bone border-b border-ink/10" style={gridBg}>
          <div className="container-page py-16 sm:py-20">
            {home?.servicesSection && (
              <div className="mb-8 flex items-baseline justify-between gap-6">
                <div>
                  {home.servicesSection.eyebrow && (
                    <p className="font-mono mb-3 text-[9px] uppercase tracking-[0.25em] text-orange">
                      § {home.servicesSection.eyebrow}
                    </p>
                  )}
                  {home.servicesSection.heading && (
                    <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                      {home.servicesSection.heading}
                    </h2>
                  )}
                </div>
                <SmartLink
                  href="/storitve"
                  className="whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-orange transition-colors hover:text-orange-dark"
                >
                  Vse →
                </SmartLink>
              </div>
            )}
            <div className="border border-ink/15 divide-y divide-ink/10">
              {services.map((s, i) => (
                <SmartLink
                  key={s._id}
                  href={serviceHref(s.slug)}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 bg-paper px-5 py-4 transition-colors hover:bg-bone-2"
                >
                  <span className="font-mono text-xs tabular-nums text-orange/50 transition-colors group-hover:text-orange">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-orange">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="mt-0.5 line-clamp-1 font-mono text-[10px] leading-relaxed text-ink/40">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-ink/20 transition-colors group-hover:text-orange"
                  />
                </SmartLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why us: specification cell grid ── */}
      {home?.whyUs?.items && home.whyUs.items.length > 0 && (
        <section className="bg-paper border-b border-ink/10">
          <div className="container-page py-16 sm:py-20">
            {(home.whyUs.eyebrow || home.whyUs.heading) && (
              <div className="mb-10">
                {home.whyUs.eyebrow && (
                  <p className="font-mono mb-3 text-[9px] uppercase tracking-[0.25em] text-orange">
                    § {home.whyUs.eyebrow}
                  </p>
                )}
                {home.whyUs.heading && (
                  <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                    {home.whyUs.heading}
                  </h2>
                )}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {home.whyUs.items.map((f, i) => (
                <div key={i} className="border border-ink/15 bg-bone p-6">
                  <p className="font-mono mb-3 text-[9px] tabular-nums text-orange">
                    {String(i + 1).padStart(2, '0')}.
                  </p>
                  {f.title && (
                    <h3 className="mb-2 text-sm font-semibold leading-snug text-ink">{f.title}</h3>
                  )}
                  {f.body && (
                    <p className="font-mono text-[10px] leading-relaxed text-ink/50">{f.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured projects: registration-mark photo grid ── */}
      {featured.length > 0 && (
        <section className="bg-bone border-b border-ink/10" style={gridBg}>
          <div className="container-page py-16 sm:py-20">
            {home?.featuredSection && (
              <div className="mb-8 flex items-baseline justify-between gap-6">
                <div>
                  {home.featuredSection.eyebrow && (
                    <p className="font-mono mb-3 text-[9px] uppercase tracking-[0.25em] text-orange">
                      § {home.featuredSection.eyebrow}
                    </p>
                  )}
                  {home.featuredSection.heading && (
                    <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                      {home.featuredSection.heading}
                    </h2>
                  )}
                </div>
                <SmartLink
                  href="/reference"
                  className="whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-orange transition-colors hover:text-orange-dark"
                >
                  Vse →
                </SmartLink>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => {
                const meta = projectMeta(p)
                return (
                  <SmartLink
                    key={p._id}
                    href={projectHref(p.slug)}
                    className="group border border-ink/15 bg-paper transition-colors hover:border-orange"
                  >
                    {p.photo && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <CornerMarks />
                        <Image
                          image={p.photo}
                          sizes={SIZES.grid3}
                          aspectRatio={4 / 3}
                          alt={p.photo.alt ?? p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="border-t border-ink/10 p-4">
                      {meta && (
                        <p className="font-mono mb-1 text-[9px] uppercase tracking-[0.2em] text-orange">
                          {meta}
                        </p>
                      )}
                      <h3 className="text-sm font-semibold leading-snug text-ink">{p.title}</h3>
                    </div>
                  </SmartLink>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact CTA: general notes block ── */}
      {home?.contact && (
        <section className="bg-paper">
          <div className="container-page py-16 sm:py-20">
            <div className="border border-ink/20">
              {/* Drawing header bar */}
              <div className="flex items-center gap-4 border-b border-ink/15 bg-bone px-6 py-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">
                  SPLOŠNE OPOMBE
                </span>
                <span className="ml-auto font-mono text-[9px] text-orange">§ CTA</span>
              </div>
              <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-2">
                <div>
                  {home.contact.eyebrow && (
                    <p className="font-mono mb-4 text-[9px] uppercase tracking-[0.25em] text-orange">
                      ↗ {home.contact.eyebrow}
                    </p>
                  )}
                  {home.contact.heading && (
                    <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
                      {home.contact.heading}
                    </h2>
                  )}
                  {home.contact.text && (
                    <p className="mt-4 text-sm leading-relaxed text-ink/60">{home.contact.text}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {cta?.href && (
                    <SmartLink
                      href={cta.href}
                      className="inline-flex items-center gap-2 bg-orange px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-paper transition-colors hover:bg-orange-dark"
                    >
                      {cta.label ?? 'Povprašajte po ponudbi'}
                      <ArrowRight size={14} />
                    </SmartLink>
                  )}
                  {contact?.phone && contact?.phoneHref && (
                    <a
                      href={contact.phoneHref}
                      className="inline-flex items-center gap-2 border border-ink/20 px-5 py-3 font-mono text-xs tabular-nums text-ink transition-colors hover:border-orange hover:text-orange"
                    >
                      <Phone size={12} className="text-orange" />
                      {contact.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Home
