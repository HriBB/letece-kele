import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

// Read the packaging artifacts as committed, resolved relative to this file so
// the assertions hold regardless of the test runner's cwd.
const read = (name: string) =>
  readFileSync(fileURLToPath(new URL(`./${name}`, import.meta.url)), 'utf8')

describe('Docker self-host packaging (ADR 0006, issue #10)', () => {
  describe('Dockerfile — standard, adapter-free RR7 commands', () => {
    const dockerfile = read('Dockerfile')

    it('builds with the standard `pnpm build` (react-router build), no platform adapter', () => {
      expect(dockerfile).toMatch(/\bpnpm\s+(run\s+)?build\b/)
      expect(dockerfile).not.toMatch(
        /@react-router\/(architect|vercel|netlify|cloudflare)/,
      )
    })

    it('serves with the standard `npm run start` (react-router-serve)', () => {
      expect(dockerfile).toMatch(/CMD\s+\["npm",\s*"run",\s*"start"\]/)
    })
  })

  describe('image contains no credentials — secrets only at runtime', () => {
    const dockerfile = read('Dockerfile')

    it('never declares or bakes a value for any Sanity secret', () => {
      for (const secret of [
        'SANITY_READ_TOKEN',
        'SANITY_WRITE_TOKEN',
        'SANITY_SESSION_SECRET',
      ]) {
        // No `ARG SECRET` (build args leak into image history) and no
        // `ENV/ARG SECRET=value` baked into a layer.
        expect(dockerfile).not.toMatch(new RegExp(`ARG\\s+${secret}\\b`))
        expect(dockerfile).not.toMatch(
          new RegExp(`(ENV|ARG)\\s+${secret}\\s*=\\s*\\S`),
        )
      }
    })

    it('never copies the local .env file into the image', () => {
      expect(dockerfile).not.toMatch(/COPY\b[^\n]*\.env\b/)
    })

    it('.dockerignore keeps the secret-bearing .env out of the build context', () => {
      const lines = read('.dockerignore')
        .split(/\r?\n/)
        .map((l) => l.trim())
      expect(lines).toContain('.env')
    })

    it('.dockerignore excludes node_modules, build output and git metadata', () => {
      const lines = read('.dockerignore')
        .split(/\r?\n/)
        .map((l) => l.trim())
      expect(lines).toContain('node_modules')
      expect(lines).toContain('build')
      expect(lines).toContain('.git')
    })
  })

  describe('docker-compose.yaml — builds the image, env at runtime', () => {
    const compose = read('docker-compose.yaml')

    it('builds the app image from the local Dockerfile', () => {
      expect(compose).toMatch(/build:/)
      expect(compose).toMatch(/dockerfile:\s*Dockerfile/)
    })

    it('reads Sanity env at runtime from .env via env_file', () => {
      expect(compose).toMatch(/env_file:/)
      expect(compose).toMatch(/\.env\b/)
    })

    it('passes only the non-secret VITE_ Sanity identifiers as build args', () => {
      // Build args are the only thing baked; they are public, not secrets.
      expect(compose).toMatch(/VITE_SANITY_PROJECT_ID:\s*\$\{VITE_SANITY_PROJECT_ID\}/)
      // No secret is wired through compose into the build.
      for (const secret of [
        'SANITY_READ_TOKEN',
        'SANITY_WRITE_TOKEN',
        'SANITY_SESSION_SECRET',
      ]) {
        expect(compose).not.toMatch(new RegExp(secret))
      }
    })

    it('publishes the service port so `docker compose up` serves the site', () => {
      expect(compose).toMatch(/ports:/)
      expect(compose).toMatch(/3000/)
    })
  })
})
