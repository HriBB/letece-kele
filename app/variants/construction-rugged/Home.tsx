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
 * Home (construction rugged): sturdy Manrope headings, thick orange borders as
 * structural frames, blocky layout. Hero leads with headline left + heavy-bordered
 * photo frame right (distinct from alpine photo-first, swiss text-only, wc shadow
 * cards). Services as thick-bordered bold rows; projects in heavy-frame grid;
 * Why Us as top-border accent tiles.
 */
export function Home({ data, site }: { data: HomeData; site: SiteData }) {
  const home = data.home
  const services = data.services
  const featured = selectFeaturedProjects(data.projects)
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <>
      {/* ── Hero: headline left + framed photo right ── */}
      {home?.hero?.heading && (
        <section className="bg-paper">
          <div className="container-page grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              {home.hero.eyebrow && (
                <span className="inline-block bg-orange px-2.5 py-1 font-manrope text-[10px] font-black tracking-[0.2em] uppercase text-paper mb-5">
                  {home.hero.eyebrow}
                </span>
              )}
              <h1 className="font-manrope text-5xl font-black leading-[1.0] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                {home.hero.heading}
              </h1>
              {home.hero.lead && (
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/60">
                  {home.hero.lead}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {home.hero.cta?.href && (
                  <SmartLink
                    href={home.hero.cta.href}
                    className="inline-flex items-center gap-2 bg-orange px-6 py-3.5 font-manrope text-sm font-black tracking-wide uppercase text-paper transition-colors hover:bg-orange-dark"
                  >
                    {home.hero.cta.label ?? 'Povprašajte po ponudbi'}
                    <ArrowRight size={16} />
                  </SmartLink>
                )}
                {contact?.phone && contact?.phoneHref && (
                  <a
                    href={contact.phoneHref}
                    className="inline-flex items-center gap-2 border-2 border-ink/20 px-5 py-3 text-sm font-bold tabular-nums text-ink transition-colors hover:border-orange hover:text-orange"
                  >
                    <Phone size={14} />
                    {contact.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Heavy-bordered photo frame */}
            {home.hero.image ? (
              <div className="border-4 border-ink/15 overflow-hidden">
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
              <div className="hidden border-4 border-ink/10 bg-bone lg:block aspect-[4/3]" />
            )}
          </div>
        </section>
      )}

      {/* ── Stats strip ── */}
      {home?.stats && home.stats.length > 0 && (
        <section className="bg-bone border-y-2 border-ink/10">
          <div className="container-page py-10">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {home.stats.map((s, i) => (
                <div key={i} className="border-l-4 border-orange pl-4">
                  <div className="font-manrope text-3xl font-black leading-none text-ink sm:text-4xl">
                    {s.value}
                  </div>
                  {s.label && (
                    <div className="mt-1.5 text-xs font-bold tracking-wider uppercase text-ink/40">
                      {s.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Story teaser ── */}
      {home?.story?.heading && (
        <section className="bg-paper border-b-2 border-ink/8">
          <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              {home.story.eyebrow && (
                <span className="font-manrope text-xs font-black tracking-[0.2em] uppercase text-orange">
                  {home.story.eyebrow}
                </span>
              )}
              <h2 className="font-manrope mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">
                {home.story.heading}
              </h2>
              {home.story.cta?.href && (
                <SmartLink
                  href={home.story.cta.href}
                  className="mt-6 inline-flex items-center gap-1.5 border-b-2 border-orange pb-0.5 font-manrope text-sm font-black text-orange transition-colors hover:border-orange-dark hover:text-orange-dark"
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

      {/* ── Services: thick-bordered bold rows ── */}
      {services.length > 0 && (
        <section className="bg-bone border-b-2 border-ink/8">
          <div className="container-page py-16 sm:py-20">
            {home?.servicesSection && (
              <div className="mb-10 flex items-baseline justify-between gap-6">
                <div>
                  {home.servicesSection.eyebrow && (
                    <span className="font-manrope text-xs font-black tracking-[0.2em] uppercase text-orange">
                      {home.servicesSection.eyebrow}
                    </span>
                  )}
                  {home.servicesSection.heading && (
                    <h2 className="font-manrope mt-2 text-2xl font-black text-ink sm:text-3xl">
                      {home.servicesSection.heading}
                    </h2>
                  )}
                </div>
                <SmartLink
                  href="/storitve"
                  className="font-manrope whitespace-nowrap border-b-2 border-orange pb-0.5 text-sm font-black text-orange transition-colors hover:border-orange-dark"
                >
                  Vse storitve
                </SmartLink>
              </div>
            )}
            <div className="space-y-2">
              {services.map((s, i) => (
                <SmartLink
                  key={s._id}
                  href={serviceHref(s.slug)}
                  className="group flex items-center gap-5 border-2 border-ink/10 bg-paper p-5 transition-colors hover:border-orange"
                >
                  <span className="font-manrope w-8 shrink-0 text-2xl font-black tabular-nums text-orange/30 transition-colors group-hover:text-orange">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-manrope text-base font-black leading-snug text-ink transition-colors group-hover:text-orange">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="mt-0.5 line-clamp-1 text-sm leading-relaxed text-ink/50">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-ink/20 transition-colors group-hover:text-orange"
                  />
                </SmartLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why us: top-accent tiles ── */}
      {home?.whyUs?.items && home.whyUs.items.length > 0 && (
        <section className="bg-paper border-b-2 border-ink/8">
          <div className="container-page py-16 sm:py-20">
            {(home.whyUs.eyebrow || home.whyUs.heading) && (
              <div className="mb-10">
                {home.whyUs.eyebrow && (
                  <span className="font-manrope text-xs font-black tracking-[0.2em] uppercase text-orange">
                    {home.whyUs.eyebrow}
                  </span>
                )}
                {home.whyUs.heading && (
                  <h2 className="font-manrope mt-2 text-2xl font-black text-ink sm:text-3xl">
                    {home.whyUs.heading}
                  </h2>
                )}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {home.whyUs.items.map((f, i) => (
                <div
                  key={i}
                  className="border-2 border-ink/10 border-t-4 border-t-orange bg-bone p-6"
                >
                  <div className="font-manrope text-xs font-black tabular-nums text-orange/50 tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {f.title && (
                    <h3 className="font-manrope mt-3 text-base font-black leading-snug text-ink">
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

      {/* ── Featured projects: heavy-frame grid ── */}
      {featured.length > 0 && (
        <section className="bg-bone border-b-2 border-ink/8">
          <div className="container-page py-16 sm:py-20">
            {home?.featuredSection && (
              <div className="mb-10 flex items-baseline justify-between gap-6">
                <div>
                  {home.featuredSection.eyebrow && (
                    <span className="font-manrope text-xs font-black tracking-[0.2em] uppercase text-orange">
                      {home.featuredSection.eyebrow}
                    </span>
                  )}
                  {home.featuredSection.heading && (
                    <h2 className="font-manrope mt-2 text-2xl font-black text-ink sm:text-3xl">
                      {home.featuredSection.heading}
                    </h2>
                  )}
                </div>
                <SmartLink
                  href="/reference"
                  className="font-manrope whitespace-nowrap border-b-2 border-orange pb-0.5 text-sm font-black text-orange transition-colors hover:border-orange-dark"
                >
                  Vse reference
                </SmartLink>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => {
                const meta = projectMeta(p)
                return (
                  <SmartLink
                    key={p._id}
                    href={projectHref(p.slug)}
                    className="group border-2 border-ink/10 bg-paper transition-colors hover:border-orange"
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
                    <div className="border-t-2 border-ink/8 p-5 group-hover:border-orange/30">
                      {meta && (
                        <div className="font-manrope mb-1 text-xs font-black tabular-nums text-orange">
                          {meta}
                        </div>
                      )}
                      <h3 className="font-manrope text-base font-black leading-snug text-ink">
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

      {/* ── Contact CTA ── */}
      {home?.contact && (
        <section className="bg-paper">
          <div className="container-page py-16 sm:py-20">
            <div className="border-4 border-orange p-8 sm:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                <div>
                  {home.contact.eyebrow && (
                    <span className="font-manrope text-xs font-black tracking-[0.2em] uppercase text-orange">
                      {home.contact.eyebrow}
                    </span>
                  )}
                  {home.contact.heading && (
                    <h2 className="font-manrope mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">
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
                      className="inline-flex items-center gap-2 bg-orange px-6 py-3.5 font-manrope text-sm font-black tracking-wide uppercase text-paper transition-colors hover:bg-orange-dark"
                    >
                      {cta.label ?? 'Povprašajte po ponudbi'}
                      <ArrowRight size={16} />
                    </SmartLink>
                  )}
                  {contact?.phone && contact?.phoneHref && (
                    <a
                      href={contact.phoneHref}
                      className="inline-flex items-center gap-2 border-2 border-ink/20 px-5 py-3 text-sm font-bold tabular-nums text-ink transition-colors hover:border-orange hover:text-orange"
                    >
                      <Phone size={14} />
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
