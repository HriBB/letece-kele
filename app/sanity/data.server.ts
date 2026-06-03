import { loadQuery } from '~/sanity/loader.server'
import { loadQueryOptions } from '~/sanity/loadQueryOptions.server'

import type { QueryParams } from '@sanity/client'
import type { SanityLoaderData, SanityQuery } from '~/sanity/data'

type LoadOptions<Params extends QueryParams> = {
  /** Query parameters, typed by the descriptor (e.g. `{ slug }`). */
  params?: Params
  /** Throw a 404 `Response` when the query returns no document. */
  notFoundIfEmpty?: boolean
  /** Include the resolved `preview` flag in the return (for Visual Editing gating). */
  withPreview?: boolean
}

/**
 * Server half of the descriptor seam (holds the read token). Resolves preview options from
 * the request, runs the descriptor's query, and returns the `{ initial, params }` wire shape
 * that `useSanity` rehydrates. See {@link SanityQuery}.
 */
export function loadSanity<Result, Params extends QueryParams>(
  request: Request,
  descriptor: SanityQuery<Result, Params>,
  opts: LoadOptions<Params> & { withPreview: true },
): Promise<SanityLoaderData<Result, Params> & { preview: boolean }>
export function loadSanity<Result, Params extends QueryParams>(
  request: Request,
  descriptor: SanityQuery<Result, Params>,
  opts?: LoadOptions<Params>,
): Promise<SanityLoaderData<Result, Params>>
export async function loadSanity<Result, Params extends QueryParams>(
  request: Request,
  descriptor: SanityQuery<Result, Params>,
  opts: LoadOptions<Params> = {},
): Promise<SanityLoaderData<Result, Params> & { preview?: boolean }> {
  const params = (opts.params ?? {}) as Params
  const { preview, options } = await loadQueryOptions(request.headers)
  const initial = await loadQuery<Result>(descriptor.query, params, options)

  if (opts.notFoundIfEmpty && initial.data == null) {
    throw new Response('Not found', { status: 404 })
  }

  return opts.withPreview ? { initial, params, preview } : { initial, params }
}
