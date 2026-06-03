import { useLoaderData, useOutletContext } from 'react-router'

import type { Route } from './+types/home'
import type { WebsiteOutletContext } from './layout'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { homeQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'
import { selectFeaturedProjects } from '~/lib/home'

import { FeaturedProjects } from '~/components/sections/FeaturedProjects'
import { Hero } from '~/components/sections/Hero'
import { HomeContact } from '~/components/sections/HomeContact'
import { ServicesTeaser } from '~/components/sections/ServicesTeaser'
import { StatsStrip } from '~/components/sections/StatsStrip'
import { StoryTeaser } from '~/components/sections/StoryTeaser'
import { WhyUs } from '~/components/sections/WhyUs'

// The real home page: the variant-5 "Warm craftsman" fold-in (issue #8). Its own loader
// reads the homePage singleton plus the `service` / `project` documents its sections
// render; siteSettings (phone, legal) arrives via the layout's outlet context.
export const loader = ({ request }: Route.LoaderArgs) => loadSanity(request, homeQuery)

export const meta: Route.MetaFunction = ({ data }) =>
  pageMeta({
    title: 'Leteče Kele — Kvaliteta na višini',
    description:
      data?.initial?.data?.home?.hero?.lead ??
      'Alpinistična višinska dela — sanacija fasad, betona in jeklenih konstrukcij brez gradbenih odrov.',
    ogTitle: 'Leteče Kele',
  })

export default function HomePage() {
  const data = useSanity(homeQuery, useLoaderData<typeof loader>())
  const { site } = useOutletContext<WebsiteOutletContext>()
  if (!data) return null

  const home = data.home
  const featured = selectFeaturedProjects(data.projects)
  const contact = site.settings?.contact

  return (
    <>
      <Hero data={home?.hero} phone={contact?.phone} phoneHref={contact?.phoneHref} />
      <StatsStrip stats={home?.stats} />
      <StoryTeaser data={home?.story} />
      <ServicesTeaser data={home?.servicesSection} services={data.services} />
      <WhyUs data={home?.whyUs} />
      <FeaturedProjects data={home?.featuredSection} projects={featured} />
      <HomeContact data={home?.contact} settings={site.settings} />
    </>
  )
}
