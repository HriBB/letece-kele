import {
  data,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router'

import type { Route } from './+types/root'

import { projectDetails } from '~/sanity/projectDetails'

import './styles/app.css'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://cdn.sanity.io', crossOrigin: 'anonymous' },
  { rel: 'dns-prefetch', href: 'https://cdn.sanity.io' },
]

// Expose the non-secret Sanity project details to the browser via window.ENV so
// the embedded Studio + react-loader hydration can read them client-side.
// `staging` drives the noindex meta — keep crawlers off the design-review URL (ADR 0008).
export const loader = async () => {
  const { projectId, dataset, apiVersion } = projectDetails()
  return data({
    staging: process.env.SITE_ENV === 'staging',
    ENV: {
      VITE_SANITY_PROJECT_ID: projectId,
      VITE_SANITY_DATASET: dataset,
      VITE_SANITY_API_VERSION: apiVersion,
    },
  })
}

export const meta: Route.MetaFunction = ({ data: loaderData }) =>
  loaderData?.staging ? [{ name: 'robots', content: 'noindex, nofollow' }] : []

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>() as
    | { ENV: Record<string, string> }
    | undefined
  const ENV = loaderData?.ENV ?? {}

  return (
    <html lang="sl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:," />
        <Meta />
        <Links />
      </head>
      <body className="min-h-dvh">
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const is404 = isRouteErrorResponse(error) && error.status === 404

  let eyebrow = 'Napaka'
  let heading = 'Nekaj je šlo narobe'
  let details = 'Prišlo je do nepričakovane napake. Poskusite znova čez nekaj trenutkov.'
  let stack: string | undefined

  if (is404) {
    eyebrow = '404'
    heading = 'Strani ni mogoče najti'
    details =
      'Stran, ki jo iščete, ne obstaja ali pa je bila premaknjena. Vrnite se na domačo stran.'
  } else if (isRouteErrorResponse(error)) {
    details = error.statusText || details
  } else if (error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center py-24 text-center">
      <p className="text-orange font-manrope text-sm font-extrabold tracking-widest uppercase">
        {eyebrow}
      </p>
      <h1 className="text-ink mt-4 text-4xl leading-tight font-extrabold sm:text-5xl">
        {heading}
      </h1>
      <p className="text-ink-soft mt-5 max-w-xl text-lg leading-relaxed">{details}</p>
      <Link
        to="/"
        className="bg-orange text-paper hover:bg-orange-dark font-manrope mt-8 inline-flex items-center gap-3 rounded-full px-7 py-4 text-lg font-extrabold transition-colors"
      >
        Nazaj na domačo stran
      </Link>
      {stack && (
        <pre className="bg-ink/5 mt-10 w-full max-w-3xl overflow-x-auto rounded-lg p-4 text-left text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
