import type { HomeData, SiteData } from '~/lib/types'

import { selectFeaturedProjects } from '~/lib/home'

import { FeaturedProjects } from './sections/FeaturedProjects'
import { Hero } from './sections/Hero'
import { HomeContact } from './sections/HomeContact'
import { ServicesTeaser } from './sections/ServicesTeaser'
import { StatsStrip } from './sections/StatsStrip'
import { StoryTeaser } from './sections/StoryTeaser'
import { WhyUs } from './sections/WhyUs'

/**
 * Home (warm craftsman): the homePage singleton drives the section copy in render
 * order, while the services teaser and featured strip are backed by the same
 * `service` / `project` documents as /storitve and /reference (ADR 0003). Phone +
 * legal data come from siteSettings (handed in via `site`); the featured strip is
 * picked in app code with a fallback (selectFeaturedProjects).
 */
export function Home({ data, site }: { data: HomeData; site: SiteData }) {
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

export default Home
