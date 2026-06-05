import { ArrowRight, Phone } from 'lucide-react'

import type { HomeData, SiteData } from '~/lib/types'

import { selectFeaturedProjects } from '~/lib/home'
import { projectHref, serviceHref } from '~/lib/link'
import { projectMeta } from '~/lib/format'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Home (Swiss technical): data-forward, strict grid layout. Hero leads with the
 * value proposition + a right-side key-metrics panel (no hero photo — the numbers
 * do the work). Services are a numbered rule list; projects a metadata-heavy grid;
 * the Why Us strip is a gap-px cell grid. All headings in Inter, labels in Space
 * Grotesk; orange used only for accent numbers and CTA. No shadows, no rounding.
 */
export function Home({ data, site }: { data: HomeData; site: SiteData }) {
  const home = data.home
  const services = data.services
  const featured = selectFeaturedProjects(data.projects)
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <>
      {/* ── Hero: value prop + key metrics panel ── */}
      {home?.hero?.heading && (
        <section className="border-b border-ink/10 bg-paper">
          <div className="container-page grid items-start gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_auto]">
            <div className="max-w-xl">
              {home.hero.eyebrow && (
                <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
                  {home.hero.eyebrow}
                </span>
              )}
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {home.hero.heading}
              </h1>
              {home.hero.lead && (
                <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/60">
                  {home.hero.lead}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {home.hero.cta?.href && (
                  <SmartLink
                    href={home.hero.cta.href}
                    className="bg-orange text-paper hover:bg-orange-dark inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors"
                  >
                    {home.hero.cta.label ?? 'Povprašajte po ponudbi'}
                    <ArrowRight size={16} />
                  </SmartLink>
                )}
                {contact?.phone && contact?.phoneHref && (
                  <a
                    href={contact.phoneHref}
                    className="font-grotesk inline-flex items-center gap-2 border-b border-ink/20 text-sm font-semibold text-ink tabular-nums transition-colors hover:border-orange hover:text-orange"
                  >
                    <Phone size={13} />
                    {contact.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Key metrics panel — data-forward, right column */}
            {home.stats && home.stats.length > 0 && (
              <div className="hidden border-l border-ink/10 pl-12 lg:block">
                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  {home.stats.map((s, i) => (
                    <div key={i}>
                      <div className="font-grotesk text-3xl font-bold tabular-nums leading-none text-orange">
                        {s.value}
                      </div>
                      <div className="font-grotesk mt-1.5 text-[10px] font-bold tracking-widest uppercase text-ink/40">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Story / about teaser ── */}
      {home?.story?.heading && (
        <section className="border-b border-ink/10 bg-paper">
          <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="border-l-2 border-orange pl-6">
              {home.story.eyebrow && (
                <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
                  {home.story.eyebrow}
                </span>
              )}
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink">
                {home.story.heading}
              </h2>
              {home.story.cta?.href && (
                <SmartLink
                  href={home.story.cta.href}
                  className="mt-5 inline-flex items-center gap-1.5 border-b border-orange/30 text-sm font-bold text-orange transition-colors hover:border-orange"
                >
                  {home.story.cta.label ?? 'Več o nas'}
                  <ArrowRight size={14} />
                </SmartLink>
              )}
            </div>
            {home.story.paragraphs && home.story.paragraphs.length > 0 && (
              <PortableText
                value={home.story.paragraphs}
                className="text-base leading-relaxed text-ink/60"
              />
            )}
          </div>
        </section>
      )}

      {/* ── Services: numbered rule list ── */}
      {services.length > 0 && (
        <section className="border-b border-ink/10 bg-paper">
          <div className="container-page py-16 sm:py-20">
            {home?.servicesSection && (
              <div className="mb-10 flex items-baseline justify-between gap-6">
                <div>
                  {home.servicesSection.eyebrow && (
                    <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
                      {home.servicesSection.eyebrow}
                    </span>
                  )}
                  {home.servicesSection.heading && (
                    <h2 className="mt-2 text-2xl font-extrabold text-ink">
                      {home.servicesSection.heading}
                    </h2>
                  )}
                </div>
                <SmartLink
                  href="/storitve"
                  className="font-grotesk whitespace-nowrap border-b border-orange/30 text-sm font-bold text-orange transition-colors hover:border-orange"
                >
                  Vse storitve
                </SmartLink>
              </div>
            )}
            <div className="divide-y divide-ink/8">
              {services.map((s, i) => (
                <SmartLink
                  key={s._id}
                  href={serviceHref(s.slug)}
                  className="group flex items-start gap-6 py-5 transition-colors"
                >
                  <span className="font-grotesk w-7 shrink-0 pt-0.5 text-sm font-bold tabular-nums text-orange">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-snug text-ink transition-colors group-hover:text-orange">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/50">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    size={16}
                    className="mt-0.5 shrink-0 text-ink/20 transition-colors group-hover:text-orange"
                  />
                </SmartLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why us: gap-px cell grid ── */}
      {home?.whyUs?.items && home.whyUs.items.length > 0 && (
        <section className="border-b border-ink/10 bg-paper">
          <div className="container-page py-16 sm:py-20">
            {(home.whyUs.eyebrow || home.whyUs.heading) && (
              <div className="mb-10">
                {home.whyUs.eyebrow && (
                  <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
                    {home.whyUs.eyebrow}
                  </span>
                )}
                {home.whyUs.heading && (
                  <h2 className="mt-2 text-2xl font-extrabold text-ink">
                    {home.whyUs.heading}
                  </h2>
                )}
              </div>
            )}
            <div className="grid gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-3">
              {home.whyUs.items.map((f, i) => (
                <div key={i} className="bg-paper p-7">
                  <div className="font-grotesk text-sm font-bold tabular-nums text-orange">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {f.title && (
                    <h3 className="mt-3 text-base font-bold leading-snug text-ink">
                      {f.title}
                    </h3>
                  )}
                  {f.body && (
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured projects: metadata-heavy grid ── */}
      {featured.length > 0 && (
        <section className="border-b border-ink/10 bg-paper">
          <div className="container-page py-16 sm:py-20">
            {home?.featuredSection && (
              <div className="mb-10 flex items-baseline justify-between gap-6">
                <div>
                  {home.featuredSection.eyebrow && (
                    <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
                      {home.featuredSection.eyebrow}
                    </span>
                  )}
                  {home.featuredSection.heading && (
                    <h2 className="mt-2 text-2xl font-extrabold text-ink">
                      {home.featuredSection.heading}
                    </h2>
                  )}
                </div>
                <SmartLink
                  href="/reference"
                  className="font-grotesk whitespace-nowrap border-b border-orange/30 text-sm font-bold text-orange transition-colors hover:border-orange"
                >
                  Vse reference
                </SmartLink>
              </div>
            )}
            <div className="grid gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => {
                const meta = projectMeta(p)
                return (
                  <SmartLink
                    key={p._id}
                    href={projectHref(p.slug)}
                    className="group overflow-hidden bg-paper"
                  >
                    {p.photo && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <Image
                          image={p.photo}
                          sizes={SIZES.grid3}
                          aspectRatio={4 / 3}
                          alt={p.photo.alt ?? p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {meta && (
                        <div className="font-grotesk mb-1.5 text-xs font-bold tabular-nums text-orange">
                          {meta}
                        </div>
                      )}
                      <h3 className="text-base font-bold leading-snug text-ink transition-colors group-hover:text-orange">
                        {p.title}
                      </h3>
                    </div>
                  </SmartLink>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact strip ── */}
      {home?.contact && (
        <section className="bg-paper">
          <div className="container-page py-16 sm:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                {home.contact.eyebrow && (
                  <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
                    {home.contact.eyebrow}
                  </span>
                )}
                {home.contact.heading && (
                  <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink">
                    {home.contact.heading}
                  </h2>
                )}
                {home.contact.text && (
                  <p className="mt-4 text-base leading-relaxed text-ink/60">
                    {home.contact.text}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {cta?.href && (
                  <SmartLink
                    href={cta.href}
                    className="bg-orange text-paper hover:bg-orange-dark inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors"
                  >
                    {cta.label ?? 'Povprašajte po ponudbi'}
                    <ArrowRight size={16} />
                  </SmartLink>
                )}
                {contact?.phone && contact?.phoneHref && (
                  <a
                    href={contact.phoneHref}
                    className="font-grotesk inline-flex items-center gap-2 border-b border-ink/20 text-sm font-semibold text-ink tabular-nums transition-colors hover:border-orange hover:text-orange"
                  >
                    <Phone size={13} />
                    {contact.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Home
