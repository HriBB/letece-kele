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
 * Home (photo-led alpine): photography commands every section. Hero = full-bleed
 * image edge-to-edge, value prop on a clean white panel below — the image is
 * the first thing the eye lands on. Services as large editorial photo-cards
 * (horizontal split at desktop, stacked at mobile). Projects as a bold 2-col
 * photo grid with minimal text. No dark surfaces or scrims anywhere.
 */
export function Home({ data, site }: { data: HomeData; site: SiteData }) {
  const home = data.home
  const services = data.services
  const featured = selectFeaturedProjects(data.projects)
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <>
      {/* ── Hero: full-bleed photo → white text panel below ── */}
      {home?.hero?.heading && (
        <section>
          {home.hero.image && (
            <div className="aspect-[3/2] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9]">
              <Image
                image={home.hero.image}
                sizes={SIZES.fullBleed}
                aspectRatio={21 / 9}
                alt={home.hero.image.alt ?? home.hero.heading}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="bg-paper">
            <div className="container-page py-12 sm:py-16">
              {home.hero.eyebrow && (
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
                  {home.hero.eyebrow}
                </span>
              )}
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {home.hero.heading}
              </h1>
              {home.hero.lead && (
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">
                  {home.hero.lead}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {home.hero.cta?.href && (
                  <SmartLink
                    href={home.hero.cta.href}
                    className="bg-orange text-paper hover:bg-orange-dark inline-flex items-center gap-2 px-7 py-4 text-base font-bold transition-colors"
                  >
                    {home.hero.cta.label ?? 'Povprašajte po ponudbi'}
                    <ArrowRight size={18} />
                  </SmartLink>
                )}
                {contact?.phone && contact?.phoneHref && (
                  <a
                    href={contact.phoneHref}
                    className="font-grotesk inline-flex items-center gap-2 text-base font-semibold tabular-nums text-ink transition-colors hover:text-orange"
                  >
                    <Phone size={16} className="text-orange" />
                    {contact.phone}
                  </a>
                )}
              </div>

              {/* Stat badges: inline row below CTA, no floating */}
              {home.hero.badges && home.hero.badges.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-8 border-t border-ink/10 pt-8">
                  {home.hero.badges.map((b, i) => (
                    <div key={i}>
                      <div className="text-3xl font-extrabold tabular-nums leading-none text-orange sm:text-4xl">
                        {b.value}
                      </div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
                        {b.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats strip (when no hero badges) ── */}
      {home?.stats && home.stats.length > 0 && !home.hero?.badges?.length && (
        <section className="bg-bone">
          <div className="container-page flex flex-wrap justify-between gap-8 py-10">
            {home.stats.map((s, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-4xl font-extrabold tabular-nums leading-none text-orange">
                  {s.value}
                </div>
                <div className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Story: large photo left, text right ── */}
      {home?.story?.heading && (
        <section className="bg-bone">
          <div className="container-page grid items-stretch gap-0 py-0 lg:grid-cols-2">
            {/* Text panel */}
            <div className="flex flex-col justify-center px-0 py-12 lg:py-16 lg:pr-16">
              {home.story.eyebrow && (
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
                  {home.story.eyebrow}
                </span>
              )}
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
                {home.story.heading}
              </h2>
              {home.story.paragraphs && home.story.paragraphs.length > 0 && (
                <div className="mt-5">
                  <PortableText
                    value={home.story.paragraphs}
                    className="text-base leading-relaxed text-ink/60"
                  />
                </div>
              )}
              {home.story.cta?.href && (
                <SmartLink
                  href={home.story.cta.href}
                  className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-orange pb-0.5 text-sm font-bold text-orange transition-colors hover:border-orange-dark hover:text-orange-dark"
                >
                  {home.story.cta.label ?? 'Več o nas'}
                  <ArrowRight size={14} />
                </SmartLink>
              )}
            </div>
            {/* Placeholder for story image — story section has no dedicated image in the data model */}
            <div className="hidden h-full min-h-[300px] bg-bone-2 lg:block" />
          </div>
        </section>
      )}

      {/* ── Services: editorial photo-cards ── */}
      {services.length > 0 && (
        <section className="bg-paper">
          <div className="container-page py-16 sm:py-20">
            {home?.servicesSection && (
              <div className="mb-10 flex items-baseline justify-between gap-6">
                <div>
                  {home.servicesSection.eyebrow && (
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
                      {home.servicesSection.eyebrow}
                    </span>
                  )}
                  {home.servicesSection.heading && (
                    <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
                      {home.servicesSection.heading}
                    </h2>
                  )}
                </div>
                <SmartLink
                  href="/storitve"
                  className="whitespace-nowrap text-sm font-bold text-orange transition-colors hover:text-orange-dark"
                >
                  Vse storitve →
                </SmartLink>
              </div>
            )}
            {/* Grid: 1 col mobile → 2 col desktop, each = large photo-card */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <SmartLink
                  key={s._id}
                  href={serviceHref(s.slug)}
                  className="group block overflow-hidden bg-bone"
                >
                  {s.photo && (
                    <div className="aspect-[3/2] overflow-hidden">
                      <Image
                        image={s.photo}
                        sizes={SIZES.grid3}
                        aspectRatio={3 / 2}
                        alt={s.photo.alt ?? s.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-base font-bold leading-snug text-ink transition-colors group-hover:text-orange">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/55">
                        {s.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-orange">
                      Več <ArrowRight size={12} />
                    </div>
                  </div>
                </SmartLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why us: feature grid on bone ── */}
      {home?.whyUs?.items && home.whyUs.items.length > 0 && (
        <section className="bg-bone">
          <div className="container-page py-16 sm:py-20">
            {(home.whyUs.eyebrow || home.whyUs.heading) && (
              <div className="mb-10">
                {home.whyUs.eyebrow && (
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
                    {home.whyUs.eyebrow}
                  </span>
                )}
                {home.whyUs.heading && (
                  <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
                    {home.whyUs.heading}
                  </h2>
                )}
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {home.whyUs.items.map((f, i) => (
                <div key={i} className="bg-paper p-6">
                  <div className="text-3xl font-extrabold tabular-nums leading-none text-orange/30">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {f.title && (
                    <h3 className="mt-4 text-base font-bold leading-snug text-ink">
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

      {/* ── Featured projects: bold 2-col photo grid ── */}
      {featured.length > 0 && (
        <section className="bg-paper">
          <div className="container-page py-16 sm:py-20">
            {home?.featuredSection && (
              <div className="mb-10 flex items-baseline justify-between gap-6">
                <div>
                  {home.featuredSection.eyebrow && (
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
                      {home.featuredSection.eyebrow}
                    </span>
                  )}
                  {home.featuredSection.heading && (
                    <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
                      {home.featuredSection.heading}
                    </h2>
                  )}
                </div>
                <SmartLink
                  href="/reference"
                  className="whitespace-nowrap text-sm font-bold text-orange transition-colors hover:text-orange-dark"
                >
                  Vse reference →
                </SmartLink>
              </div>
            )}
            {/* Large 2-col photo grid: first item spans full width on mobile */}
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.map((p, i) => {
                const meta = projectMeta(p)
                const isLead = i === 0
                return (
                  <SmartLink
                    key={p._id}
                    href={projectHref(p.slug)}
                    className={`group block overflow-hidden bg-bone ${isLead ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                  >
                    {p.photo && (
                      <div className={`overflow-hidden ${isLead ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                        <Image
                          image={p.photo}
                          sizes={isLead ? SIZES.fullBleed : SIZES.grid2}
                          aspectRatio={isLead ? 16 / 9 : 4 / 3}
                          alt={p.photo.alt ?? p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {meta && (
                        <div className="mb-1 text-xs font-bold tabular-nums text-orange">
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
        <section className="bg-bone">
          <div className="container-page py-16 sm:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                {home.contact.eyebrow && (
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
                    {home.contact.eyebrow}
                  </span>
                )}
                {home.contact.heading && (
                  <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
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
                    className="bg-orange text-paper hover:bg-orange-dark inline-flex items-center gap-2 px-7 py-4 text-base font-bold transition-colors"
                  >
                    {cta.label ?? 'Povprašajte po ponudbi'}
                    <ArrowRight size={18} />
                  </SmartLink>
                )}
                {contact?.phone && contact?.phoneHref && (
                  <a
                    href={contact.phoneHref}
                    className="font-grotesk inline-flex items-center gap-2 text-base font-semibold tabular-nums text-ink transition-colors hover:text-orange"
                  >
                    <Phone size={16} className="text-orange" />
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
