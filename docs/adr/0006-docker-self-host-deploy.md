# 0006 — Docker self-host deployment

- Status: Accepted
- Date: 2026-06-03

## Context

The new site needs a deployment target. The sibling `mojterapevt` runs as a plain RR7
Node server; `slackalien/studio-website` ships a Dockerfile + docker-compose for
self-hosting. The owner wants to self-host this site rather than use a managed platform.

## Decision

Deploy as a **container**: a `Dockerfile` building the RR7 SSR app plus a
`docker-compose.yaml`, mirroring the `slackalien/studio-website` setup. The app stays
deploy-agnostic (standard `react-router build` + `react-router-serve`); the container is
the packaging, not a framework lock-in. Env (Sanity project/dataset/tokens,
`SANITY_SESSION_SECRET`) is supplied at runtime, not baked into the image.

## Consequences

- Portable to any VPS/host that runs containers; no platform vendor lock-in.
- We own the ops: TLS, restarts, logs, and the build pipeline are ours to run (no managed
  edge/CDN out of the box — image CDN is still Sanity's).
- Because the app itself is adapter-free, switching to a managed platform later (e.g.
  Vercel) is a packaging change, not a rewrite.
- Secrets live in the runtime environment; the image contains no credentials.
