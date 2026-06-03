import { useQuery } from '@sanity/react-loader'

import type { QueryParams } from '@sanity/client'
import type { QueryResponseInitial } from '@sanity/react-loader'

/**
 * A GROQ query bound to its result type — and, when parameterised, its params type.
 *
 * The descriptor is the one place a query string meets its (hand-written) result type.
 * Both halves of a route's request flow reference the SAME descriptor, so `query` and
 * `params` cannot drift between server (`loadSanity`) and client (`useSanity`): the
 * hydration-matching invariant `@sanity/react-loader` needs is enforced by construction.
 */
export type SanityQuery<Result, Params extends QueryParams = QueryParams> = {
  readonly query: string
  /** phantom — carries Result/Params at the type level only, never read at runtime */
  readonly __types?: (params: Params) => Result
}

export function defineSanityQuery<Result, Params extends QueryParams = QueryParams>(
  query: string,
): SanityQuery<Result, Params> {
  return { query }
}

/** What `loadSanity` returns and `useSanity` consumes — the cross-seam wire shape. */
export type SanityLoaderData<Result, Params extends QueryParams = QueryParams> = {
  initial: QueryResponseInitial<Result>
  params: Params
}

/**
 * Subscribe to live data using the same descriptor the loader used. Returns `null` while
 * preview hydration is in flight (callers guard), even when the server load was non-empty.
 */
export function useSanity<Result, Params extends QueryParams>(
  descriptor: SanityQuery<Result, Params>,
  loaderData: SanityLoaderData<Result, Params>,
): Result | null {
  const { data } = useQuery<Result | null>(descriptor.query, loaderData.params, {
    initial: loaderData.initial as QueryResponseInitial<Result | null>,
  })
  return data ?? null
}
