# Spacefast build spec

This project is a fully static site: every public page is prerendered to HTML at
build time and needs no server at request time.

| Setting                  | Value                                          |
| ------------------------ | ---------------------------------------------- |
| Install command          | `bun install` (or `npm install`)               |
| Build command            | `vite build && node scripts/copy-static-output.mjs` |
| Static output directory  | `dist/client`                                  |
| Raw prerender output     | `.output/public` (copied into `dist/client`)   |
| Node version             | 20 or newer                                    |

## Prerendered routes

`/`, `/setup`, `/faq`, `/troubleshooting`, `/licenses`, `/security`,
`/changelog`, and one guide page per stack: `/guide/openclaw`,
`/guide/ollama`, `/guide/openwebui`, `/guide/n8n`, `/guide/nemoclaw`,
`/guide/hermes`, `/guide/razeraikit`, `/guide/atomic-agents`.

The list lives in `STATIC_ROUTES` in `vite.config.ts`. When a route or stack is
added, update that list and `public/sitemap.xml`.

## Static files served from the output root

- `sitemap.xml` — all public URLs
- `robots.txt` — points at `/sitemap.xml`
- `_redirects` — `/*  /index.html  200` so deep links resolve

## Notes

- Do not set `nitro: { preset: "static" }`; it breaks the build. The normal
  SSR/Nitro build already prerenders into `.output/public`.
- `scripts/copy-static-output.mjs` is idempotent and skips gracefully when the
  output already lives in `dist/client`.
- The site stores user choices in the URL and in browser storage only. There is
  no database, login, or server function at request time.

## No Cloudflare Workers target

`wrangler.jsonc` and `@cloudflare/vite-plugin` were removed. Static hosts reject
Worker entrypoints ("cloudflare-pages: Cloudflare Worker entrypoints are not
converted"), and the Workers output renames the SSR entry so the prerender pass
cannot boot it. Do not re-add either unless the site goes back to server
rendering.
