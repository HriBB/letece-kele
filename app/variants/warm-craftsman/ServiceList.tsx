import type { ServiceListItem } from '~/lib/types'

import { serviceHref } from '~/lib/link'

import { ListingCard } from '~/components/ListingCard'

/** Service listing (warm craftsman): a 3-up grid of service cards. */
export function ServiceList({ services }: { services: ServiceListItem[] }) {
  return (
    <section className="container-page py-16 sm:py-24">
      <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
        Storitve
      </h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ListingCard
            key={s._id}
            href={serviceHref(s.slug)}
            image={s.photo}
            title={s.title}
            summary={s.description ?? undefined}
          />
        ))}
      </div>
    </section>
  )
}

export default ServiceList
