import type { ProjectData } from '~/lib/types'

import { projectMeta } from '~/lib/format'
import { Gallery } from '~/components/Gallery'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Project detail layout (ADR 0003 — one type, two depths): a title with a
 * location · year meta line, the summary, the photo gallery (pure-CSS scroll-snap
 * slider), and — when present — the case-study `body`. A project with a rich body
 * reads as a full case study; a gallery-only project reads as a reference card.
 * Closes with a quote/contact CTA. Tap-to-call is a plain `tel:` anchor; the quote
 * link is an in-app path via SmartLink.
 */
export function ProjectPage({
  data,
  phone,
  phoneHref,
  quoteHref,
  quoteLabel,
}: {
  data: ProjectData
  phone?: string
  phoneHref?: string
  quoteHref: string
  quoteLabel: string
}) {
  const { title, location, year, summary, gallery, body } = data
  const meta = projectMeta({ location, year })
  const photos = (gallery ?? []).filter(Boolean)
  const hasBody = Boolean(body && body.length > 0)

  return (
    <article className="container-page py-16 sm:py-24">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {meta ? (
          <p className="mt-4 font-bold text-orange">{meta}</p>
        ) : null}
        {summary ? (
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{summary}</p>
        ) : null}
      </header>

      {photos.length > 0 ? (
        <div className="mt-10">
          <Gallery images={photos} title={title} />
        </div>
      ) : null}

      {hasBody ? (
        <section className="mt-12">
          <PortableText value={body} className="mt-5 max-w-3xl text-ink-soft" />
        </section>
      ) : null}

      {/* Tap-to-call / quote CTA */}
      <section className="mt-16 rounded-2xl bg-bone p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold text-ink">Potrebujete podobno rešitev?</h2>
        <p className="mt-3 text-ink-soft">
          Pokličite nas ali povprašajte po ponudbi — svetujemo brezplačno.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          {phoneHref ? (
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center rounded-full bg-orange px-6 py-3 font-bold text-white transition-colors hover:bg-orange-dark"
            >
              {phone ? `Pokličite ${phone}` : 'Pokličite nas'}
            </a>
          ) : null}
          <SmartLink
            href={quoteHref}
            className="inline-flex items-center justify-center rounded-full border-2 border-ink px-6 py-3 font-bold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            {quoteLabel}
          </SmartLink>
        </div>
      </section>
    </article>
  )
}

export default ProjectPage
