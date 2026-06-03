# Self-host packaging for the RR7 SSR app (ADR 0006), mirroring
# slackalien/studio-website. Multi-stage: install deps, build, then a slim
# runtime that serves with the standard adapter-free `react-router-serve`.
#
# Only the non-secret Sanity project details are baked (as build ARGs) so the
# client bundle + embedded /studio resolve a projectId. Every secret
# (SANITY_*_TOKEN, SANITY_SESSION_SECRET) is supplied at runtime via the
# environment — never an ARG, never an ENV value, never COPYed in.

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

FROM base AS development-dependencies-env
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS production-dependencies-env
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

FROM base AS build-env
# Non-secret, public Sanity identifiers (see app/sanity/projectDetails.ts). Vite
# inlines VITE_-prefixed vars at build for the client bundle + embedded Studio.
ARG VITE_SANITY_PROJECT_ID
ARG VITE_SANITY_DATASET=production
ARG VITE_SANITY_API_VERSION=2024-10-01
ENV VITE_SANITY_PROJECT_ID=$VITE_SANITY_PROJECT_ID
ENV VITE_SANITY_DATASET=$VITE_SANITY_DATASET
ENV VITE_SANITY_API_VERSION=$VITE_SANITY_API_VERSION
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
COPY . /app/
WORKDIR /app
RUN pnpm build

FROM node:22-alpine
COPY package.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
USER node
EXPOSE 3000
ENV PORT=3000
ENV HOST="0.0.0.0"
CMD ["npm", "run", "start"]
