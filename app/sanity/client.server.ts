import { client } from '~/sanity/client'

/**
 * The one authenticated read client. The dataset is private, so any server-side
 * read of published content must carry the read token — the bare `client`
 * (tokenless, CDN) returns nothing. Token wiring lives here only: `loadQuery`
 * (via loader.server) and the sitemap both build on this, so no route re-derives
 * the token. Server-only — never import from client code.
 */
export const serverClient = client.withConfig({
  token: process.env.SANITY_READ_TOKEN,
})
