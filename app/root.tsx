import {
  data,
  isRouteErrorResponse,
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
export const loader = async () => {
  const { projectId, dataset, apiVersion } = projectDetails()
  return data({
    ENV: {
      VITE_SANITY_PROJECT_ID: projectId,
      VITE_SANITY_DATASET: dataset,
      VITE_SANITY_API_VERSION: apiVersion,
    },
  })
}

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
  let message = 'Oops!'
  let details = 'Prišlo je do nepričakovane napake.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Napaka'
    details =
      error.status === 404 ? 'Strani ni mogoče najti.' : error.statusText || details
  } else if (error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container-page py-24">
      <h1 className="text-4xl font-bold">{message}</h1>
      <p className="mt-4 text-muted-foreground">{details}</p>
      {stack && (
        <pre className="mt-6 w-full overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
