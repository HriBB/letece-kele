import type { ProjectData } from '~/lib/types'

import { projectMeta } from '~/lib/format'

import { ContactCta } from '~/components/ContactCta'
import { Gallery } from '~/components/Gallery'
import { PortableText } from '~/components/PortableText'

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
        <h1 className="text-ink text-4xl leading-tight font-extrabold sm:text-5xl">
          {title}
        </h1>
        {meta ? <p className="text-orange mt-4 font-bold">{meta}</p> : null}
        {summary ? (
          <p className="text-ink-soft mt-5 text-lg leading-relaxed">{summary}</p>
        ) : null}
      </header>

      {photos.length > 0 ? (
        <div className="mt-10">
          <Gallery images={photos} title={title} />
        </div>
      ) : null}

      {hasBody ? (
        <section className="mt-12">
          <PortableText value={body} className="text-ink-soft mt-5 max-w-3xl" />
        </section>
      ) : null}

      <ContactCta
        heading="Potrebujete podobno rešitev?"
        phone={phone}
        phoneHref={phoneHref}
        quoteHref={quoteHref}
        quoteLabel={quoteLabel}
      />
    </article>
  )
}

export default ProjectPage
