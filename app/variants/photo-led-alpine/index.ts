import type { VariantPages } from '~/variants/types'

import { About } from './About'
import { Contact } from './Contact'
import { Footer } from './Footer'
import { Header } from './Header'
import { Home } from './Home'
import { NotFound } from './NotFound'
import { ProjectDetail } from './ProjectDetail'
import { ProjectList } from './ProjectList'
import { ServiceDetail } from './ServiceDetail'
import { ServiceList } from './ServiceList'

export const photoLedAlpinePages: VariantPages = {
  Header,
  Footer,
  Home,
  ServiceList,
  ServiceDetail,
  ProjectList,
  ProjectDetail,
  About,
  Contact,
  NotFound,
}
