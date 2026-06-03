import type { MetaFunction } from 'react-router'

import { SanityStudio } from '~/components/SanityStudio'

import '~/styles/studio.css'

export const meta: MetaFunction = () => [
  { title: 'Leteče Kele — Studio' },
  { name: 'robots', content: 'noindex' },
]

export default function StudioPage() {
  return <SanityStudio />
}
